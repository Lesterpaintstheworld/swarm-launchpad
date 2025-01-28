import json
import requests
from pathlib import Path
import base64
import re

# Constants
PROGRAM_ID = "4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf"
RPC_URL = "https://api.mainnet-beta.solana.com"

def get_account_info(pubkey: str):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getAccountInfo",
        "params": [
            pubkey,
            {
                "encoding": "base64",
                "commitment": "confirmed"
            }
        ]
    }
    response = requests.post(RPC_URL, json=payload)
    return response.json()

def extract_swarm_data(content: str) -> str:
    """Extract SwarmData array from TypeScript file content"""
    # Find the start of the SwarmData array
    start_marker = "export const SwarmData: SwarmInfo[] = ["
    end_marker = "];\n\n"  # Changed to match actual file format
    
    try:
        start_idx = content.index(start_marker) + len(start_marker)
        end_idx = content.index(end_marker, start_idx)
        array_content = content[start_idx:end_idx] + "]"
        return array_content
    except ValueError:
        print("Content preview:", content[:1000])  # Show more content for debugging
        print("\nMarkers not found. Looking for alternative format...")
        try:
            # Try alternative format
            alt_start = "SwarmData: SwarmInfo[] = ["
            alt_end = "];\n"
            start_idx = content.index(alt_start) + len(alt_start)
            end_idx = content.index(alt_end, start_idx)
            array_content = content[start_idx:end_idx] + "]"
            return array_content
        except ValueError:
            raise ValueError("Could not find SwarmData array in content")

def convert_to_json(ts_object_str: str) -> str:
    """Convert TypeScript object notation to valid JSON"""
    # Handle template literals
    ts_object_str = re.sub(r'`([^`]*)`', lambda m: json.dumps(m.group(1)), ts_object_str)
    
    # Replace single quotes with double quotes (except in content)
    ts_object_str = re.sub(r"'([^']*)'", r'"\1"', ts_object_str)
    
    # Handle property names without quotes
    ts_object_str = re.sub(r'(\s*)(\w+):', r'\1"\2":', ts_object_str)
    
    # Remove trailing commas
    ts_object_str = re.sub(r',(\s*[}\]])', r'\1', ts_object_str)
    
    # Handle imported constants
    ts_object_str = re.sub(r':\s*\w+Description', ': ""', ts_object_str)
    
    return ts_object_str

def main():
    # Load IDL
    script_dir = Path(__file__).parent
    idl_path = script_dir.parent / "data" / "programs" / "ubclaunchpad.json"
    with open(idl_path, 'r', encoding='utf-8') as f:
        idl = json.load(f)

    # Load SwarmData from info.tsx
    info_path = script_dir.parent / "data" / "swarms" / "info.tsx"
    with open(info_path, 'r', encoding='utf-8') as f:
        content = f.read()

    try:
        # Extract and convert SwarmData array
        array_content = extract_swarm_data(content)
        json_str = convert_to_json(array_content)
        
        try:
            swarm_data = json.loads(json_str)
        except json.JSONDecodeError as e:
            print("Error parsing JSON. Preview of converted content:")
            print(json_str[:500])
            print("\nOriginal content:")
            print(array_content[:500])
            raise e

    except ValueError as e:
        print("Error finding array in content. Content preview:")
        print(content[:500])
        raise e

    # Process each swarm
    for swarm in swarm_data:
        if not swarm.get('pool'):
            continue

        try:
            response = get_account_info(swarm['pool'])
            if 'error' in response:
                print(f"Error fetching account info for {swarm['name']}: {response['error']}")
                continue
                
            if not response['result']['value']:
                print(f"No account info found for {swarm['name']}")
                continue

            # Decode base64 data
            data = base64.b64decode(response['result']['value']['data'][0])
            
            # Parse account data - skip 8 byte discriminator
            data = data[8:]
            
            # Parse total_shares and available_shares (both u64)
            # Skip pool_name and admin_authority
            offset = 32 + 32  # Skip string data and pubkey
            total_shares = int.from_bytes(data[offset:offset+8], 'little')
            available_shares = int.from_bytes(data[offset+8:offset+16], 'little')
            
            sold_shares = total_shares - available_shares
            cycle = sold_shares // 5000
            multiple = pow(1.35, cycle)
            
            print(f"{swarm['name']}: {multiple:.2f}x multiple ({sold_shares} shares sold)")
            
            swarm['multiple'] = round(multiple * 100) / 100  # Round to 2 decimal places
        except Exception as e:
            print(f"Error processing {swarm['name']}: {str(e)}")

    # Write updated data back to file
    file_content = f"""// Auto-generated by update_multiples.py
import {{ SwarmInfo }} from "@/components/swarms/swarm.types";
import {{ KinKongDescription }} from "./descriptions/kinkong";
import {{ SwarmVenturesDescription }} from "./descriptions/swarmventures";
import {{ TerminalVelocityDescription }} from "./descriptions/terminalvelocity";
import {{ SyntheticSoulsDescription }} from "./descriptions/syntheticsouls";
import {{ DuoAIDescription }} from "./descriptions/duoai";

export const getSwarmUsingId = (swarmId: string) => SwarmData.find(swarm => swarm.id === swarmId);
export const getSwarmUsingPoolId = (poolId: string) => {{
    // First try direct pool match
    const swarm = SwarmData.find(swarm => swarm.pool === poolId);
    if (swarm) return swarm;

    // If no direct match, try program.pool match
    return SwarmData.find(swarm => swarm.program?.pool === poolId);
}};
export const getSwarmInfo = (swarmId: string) => SwarmData.find(swarm => swarm.id === swarmId);

export const SwarmData: SwarmInfo[] = {json.dumps(swarm_data, indent=2)};"""

    with open(info_path, 'w', encoding='utf-8') as f:
        f.write(file_content)

    print('Multiples updated successfully!')

if __name__ == "__main__":
    main()
