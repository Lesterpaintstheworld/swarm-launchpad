import json
import requests
import base64
import time
from typing import Dict, List, Optional
import random
import re

# Constants
PROGRAM_ID = "4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf"
HELIUS_RPC = "https://mainnet.helius-rpc.com/?api-key=NGMzYTVmYzItZWEzZi00NWViLTg1ZDUtMmYyODJhNmI0NDAx"
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

class SwarmHolder:
    def __init__(self, wallet: str, shares: int, percentage: float):
        self.wallet = wallet
        self.shares = shares
        self.percentage = percentage

def get_account_info(pubkey: str, retries: int = 0) -> Optional[Dict]:
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
    
    try:
        response = requests.post(HELIUS_RPC, json=payload)
        response.raise_for_status()
        data = response.json()
        
        if 'error' in data:
            if retries < MAX_RETRIES:
                time.sleep(RETRY_DELAY * (retries + 1))
                return get_account_info(pubkey, retries + 1)
            raise Exception(data['error'])
            
        return data
        
    except Exception as e:
        if retries < MAX_RETRIES:
            time.sleep(RETRY_DELAY * (retries + 1))
            return get_account_info(pubkey, retries + 1)
        raise e

def get_program_accounts(pool_address: str, retries: int = 0) -> List[Dict]:
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getProgramAccounts",
        "params": [
            PROGRAM_ID,
            {
                "encoding": "base64",
                "filters": [
                    {
                        "memcmp": {
                            "offset": 8,
                            "bytes": pool_address
                        }
                    }
                ]
            }
        ]
    }
    
    try:
        response = requests.post(HELIUS_RPC, json=payload)
        response.raise_for_status()
        data = response.json()
        
        if 'error' in data:
            if retries < MAX_RETRIES:
                time.sleep(RETRY_DELAY * (retries + 1))
                return get_program_accounts(pool_address, retries + 1)
            raise Exception(data['error'])
            
        return data.get('result', [])
        
    except Exception as e:
        if retries < MAX_RETRIES:
            time.sleep(RETRY_DELAY * (retries + 1))
            return get_program_accounts(pool_address, retries + 1)
        raise e

def parse_account_data(data: str) -> int:
    """Parse account data to get number of shares"""
    try:
        # Decode base64 data
        raw_data = base64.b64decode(data)
        # Extract shares (8 bytes starting at offset 8)
        shares = int.from_bytes(raw_data[8:16], 'little')
        return shares
    except Exception as e:
        print(f"Error parsing account data: {e}")
        return 0

def extract_swarm_data(content: str) -> List[Dict]:
    """Extract and parse SwarmData from TypeScript content"""
    # Find the array content
    start = content.find('SwarmData: SwarmInfo[] = [') + len('SwarmData: SwarmInfo[] = [')
    end = content.rfind(']')
    data = content[start:end].strip()
    
    # Remove TypeScript-specific syntax
    data = re.sub(r'new Date\([\'"]([^\'"]+)[\'"]\)', r'"\1"', data)  # Convert Date objects
    data = re.sub(r'`[\s\S]*?`', '"PLACEHOLDER"', data)  # Replace template literals
    data = re.sub(r'description: \w+Description', 'description: "PLACEHOLDER"', data)  # Replace description references
    
    # Fix property names and values
    data = re.sub(r'(\w+):', r'"\1":', data)  # Quote property names
    data = data.replace("'", '"')  # Convert single quotes to double quotes
    data = data.replace('undefined', 'null')  # Convert undefined to null
    data = re.sub(r',(\s*[}\]])', r'\1', data)  # Remove trailing commas
    
    # Wrap in array brackets and parse
    try:
        return json.loads(f"[{data}]")
    except json.JSONDecodeError as e:
        print(f"Error parsing data: {str(e)}")
        print("Problematic data:", data[:200])  # Show start of problematic data
        return []

def main():
    # Load SwarmData from info.tsx
    with open('data/swarms/info.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
        swarm_data = extract_swarm_data(content)

    if not swarm_data:
        print("Failed to parse swarm data")
        return

    print("\nSwarm Holders Analysis:\n")
    print("Name                  Holders    Total Shares    Top Holder %")
    print("-" * 65)

    for swarm in swarm_data:
        if not swarm.get('pool'):
            continue

        try:
            print(f"\nProcessing {swarm['name']}...")
            
            # Add random delay between requests
            time.sleep(random.uniform(0.5, 1.5))
            
            accounts = get_program_accounts(swarm['pool'])
            
            holders = []
            total_shares = 0
            
            for account in accounts:
                shares = parse_account_data(account['account']['data'][0])
                if shares > 0:
                    total_shares += shares
                    holders.append(SwarmHolder(
                        wallet=account['pubkey'],
                        shares=shares,
                        percentage=0  # Will calculate after
                    ))

            # Calculate percentages and sort
            for holder in holders:
                holder.percentage = (holder.shares / total_shares * 100) if total_shares > 0 else 0
            holders.sort(key=lambda x: x.percentage, reverse=True)

            # Print summary
            top_holder_pct = holders[0].percentage if holders else 0
            print(f"{swarm['name']:<20} {len(holders):>8} {total_shares:>13,} {top_holder_pct:>11.1f}%")

            # Print top 10 holders
            print("\nTop 10 Holders:")
            for i, holder in enumerate(holders[:10], 1):
                print(f"{i}. {holder.wallet}")
                print(f"   Shares: {holder.shares:,} ({holder.percentage:.2f}%)")
            print("-" * 65)

        except Exception as e:
            print(f"Error processing {swarm['name']}: {str(e)}")

if __name__ == "__main__":
    main()
