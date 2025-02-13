import requests
import os
from typing import Dict
import json
from dotenv import load_dotenv
import base64

# Load environment variables
load_dotenv()

AIRTABLE_API_KEY = os.getenv('AIRTABLE_API_KEY')
AIRTABLE_BASE_ID = os.getenv('AIRTABLE_BASE_ID')
HELIUS_RPC = f"https://mainnet.helius-rpc.com/?api-key={os.getenv('HELIUS_RPC_KEY')}"
PROGRAM_ID = "4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf"

def get_swarms() -> list:
    """Fetch all swarms from Airtable"""
    try:
        response = requests.get(
            f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/Swarms",
            headers={
                "Authorization": f"Bearer {AIRTABLE_API_KEY}",
            }
        )
        response.raise_for_status()
        return response.json()['records']
    except Exception as e:
        print(f"Error fetching swarms: {e}")
        return []

def get_program_accounts(pool_address: str) -> Dict:
    """Fetch pool data from Solana"""
    try:
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
                                "offset": 8,  # Skip discriminator
                                "bytes": pool_address
                            }
                        }
                    ]
                }
            ]
        }
        
        response = requests.post(HELIUS_RPC, json=payload)
        response.raise_for_status()
        return response.json().get('result', [])
    except Exception as e:
        print(f"Error fetching program accounts for pool {pool_address}: {e}")
        return []

def parse_pool_data(data: str) -> int:
    """Parse pool account data to get available shares"""
    try:
        raw_data = base64.b64decode(data)
        # Pool struct layout:
        # - 8 bytes discriminator
        # - 32 bytes pool_name (String)
        # - 32 bytes admin_authority
        # - 8 bytes total_shares
        # - 8 bytes available_shares
        # - 1 byte is_frozen
        # - 32 bytes ubc_mint
        # - 32 bytes compute_mint
        # - 8 bytes fee_ratio
        # - 32 bytes custodial_account
        available_shares = int.from_bytes(raw_data[80:88], 'little')
        return available_shares
    except Exception as e:
        print(f"Error parsing pool data: {e}")
        return 0

def calculate_share_price(n: int) -> float:
    """
    Python implementation of the Rust calculate_share_price function
    Returns price in COMPUTE with 6 decimal places
    """
    n_float = float(n)
    
    # Calculate cycle and position within cycle
    cycle = n_float // 5000
    x = n_float % 5000
    
    # Calculate base price with 35% growth per cycle
    base = pow(1.35, cycle)
    
    # Calculate multiplier based on position in cycle
    if x <= 1250:
        # Phase 1: Linear up to +30%
        multiplier = 1.0 + (0.30 * x / 1250)
    elif x <= 2500:
        # Phase 2: Linear down to base
        multiplier = 1.30 - (0.30 * (x - 1250) / 1250)
    elif x <= 3750:
        # Phase 3: Linear down to -30%
        multiplier = 1.0 - (0.30 * (x - 2500) / 1250)
    else:
        # Phase 4: Linear up to base
        multiplier = 0.70 + (0.30 * (x - 3750) / 1250)
    
    # Calculate final price with 6 decimal places
    return round(base * multiplier * 1_000_000) / 1_000_000

def main():
    # Fetch all swarms
    swarms = get_swarms()
    
    results = []
    
    for swarm in swarms:
        swarm_data = swarm['fields']
        pool_address = swarm_data.get('pool')
        
        if not pool_address:
            print(f"No pool address for swarm {swarm_data.get('name')}")
            continue
            
        # Get pool data from Solana
        accounts = get_program_accounts(pool_address)
        
        # Find the pool account and parse available shares
        available_shares = 100000  # Default to all shares available
        for account in accounts:
            try:
                if account['account']['data'][0]:  # Check if data exists
                    available_shares = parse_pool_data(account['account']['data'][0])
                    break  # Found the pool account
            except Exception as e:
                print(f"Error parsing account data for {swarm_data.get('name')}: {e}")
        
        # Calculate shares sold
        total_shares = 100000  # Default total shares
        shares_sold = total_shares - available_shares
        
        # Calculate current price
        current_price = calculate_share_price(shares_sold)
        
        # Calculate multiple (current price / initial price)
        initial_price = calculate_share_price(0)  # Price at 0 shares sold
        multiple = current_price / initial_price if initial_price > 0 else 1
        
        result = {
            'name': swarm_data.get('name'),
            'pool': pool_address,
            'shares_sold': shares_sold,
            'available_shares': available_shares,
            'initial_price': initial_price,
            'current_price': current_price,
            'multiple': multiple
        }
        
        results.append(result)
        print(f"\nSwarm: {result['name']}")
        print(f"Pool: {result['pool']}")
        print(f"Shares Sold: {result['shares_sold']:,}")
        print(f"Available Shares: {result['available_shares']:,}")
        print(f"Initial Price: {result['initial_price']:.6f} COMPUTE")
        print(f"Current Price: {result['current_price']:.6f} COMPUTE")
        print(f"Multiple: {result['multiple']:.2f}x")
    
    # Sort results by multiple descending
    results.sort(key=lambda x: x['multiple'], reverse=True)
    
    # Save results to file
    os.makedirs('data', exist_ok=True)
    with open('data/swarm_multiples.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\nResults saved to data/swarm_multiples.json")

if __name__ == "__main__":
    main()
