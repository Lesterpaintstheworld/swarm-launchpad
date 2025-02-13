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
HELIUS_RPC_URL = os.getenv('NEXT_PUBLIC_HELIUS_RPC_URL')
if not HELIUS_RPC_URL:
    print("Warning: HELIUS_RPC_URL not found in environment")
    HELIUS_RPC_URL = "https://api.mainnet-beta.solana.com"
else:
    print(f"Using RPC URL: {HELIUS_RPC_URL}")
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
        
        headers = {
            "Content-Type": "application/json",
        }
        
        print(f"Sending request to {HELIUS_RPC_URL} for pool {pool_address}")
        response = requests.post(HELIUS_RPC_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        result = response.json().get('result', [])
        print(f"Got {len(result)} accounts for pool {pool_address}")
        return result
        
    except Exception as e:
        print(f"Error fetching program accounts for pool {pool_address}: {e}")
        if hasattr(e, 'response'):
            print(f"Response status: {e.response.status_code}")
            print(f"Response text: {e.response.text}")
        return []

def parse_shareholder_data(data: str) -> int:
    """Parse shareholder account data to get number of shares"""
    try:
        raw_data = base64.b64decode(data)
        # Shareholder struct layout:
        # - 8 bytes discriminator
        # - 32 bytes pool
        # - 32 bytes owner
        # - 8 bytes shares
        # - 8 bytes available_shares
        shares = int.from_bytes(raw_data[72:80], 'little')
        return shares
    except Exception as e:
        print(f"Error parsing shareholder data: {e}")
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
            
        # Get all accounts for this pool
        accounts = get_program_accounts(pool_address)
        
        # Calculate total shares held by shareholders
        total_shares = 100000  # Fixed total supply
        shares_sold = 0
        
        for account in accounts:
            try:
                if account['account']['data'][0]:
                    shares = parse_shareholder_data(account['account']['data'][0])
                    shares_sold += shares
            except Exception as e:
                print(f"Error processing account for {swarm_data.get('name')}: {e}")
        
        # Calculate available shares
        available_shares = total_shares - shares_sold
        
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
