import requests
import base64
import time
from typing import Optional
import random
import re
import json

# Constants
PROGRAM_ID = "4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf"
RPC_URLS = [
    "https://api.mainnet-beta.solana.com",
    "https://solana-mainnet.g.alchemy.com/v2/demo",  # Replace with your key
    "https://solana-api.projectserum.com"
]
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

def get_account_info(pubkey: str, retries: int = 0) -> Optional[dict]:
    # Try different RPC endpoints
    rpc_url = RPC_URLS[retries % len(RPC_URLS)]
    
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getAccountInfo",
        "params": [
            pubkey,
            {
                "encoding": "base64",
                "commitment": "confirmed",
                "dataSlice": {
                    "offset": 8,  # Skip discriminator
                    "length": 80  # Just get the data we need
                }
            }
        ]
    }
    
    try:
        response = requests.post(rpc_url, json=payload)
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

def parse_pool_data(data: bytes) -> tuple[int, int]:
    """Parse pool data according to the Anchor account structure"""
    try:
        # Skip pool_name (string) and admin_authority (pubkey)
        # The pool_name length is stored in the first 4 bytes
        name_len = int.from_bytes(data[0:4], 'little')
        offset = 4 + name_len + 32  # Skip name content and admin_authority
        
        # Read total_shares and available_shares
        total_shares = int.from_bytes(data[offset:offset+8], 'little')
        available_shares = int.from_bytes(data[offset+8:offset+16], 'little')
        
        return total_shares, available_shares
    except Exception as e:
        print(f"Error parsing data: {e}")
        return 0, 0

def update_info_file(multiples: dict):
    file_path = 'data/swarms/info.tsx'
    
    try:
        # Read the file
        with open(file_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
        
        # Track current position in the file
        current_pool = None
        
        # Process each line
        for i in range(len(lines)):
            line = lines[i]
            
            # If we find a pool line, note which pool we're on
            if 'pool:' in line:
                # Extract pool address from the line using regex
                pool_match = re.search(r'pool:\s*["\']([^"\']+)["\']', line)
                if pool_match:
                    current_pool = pool_match.group(1)
            
            # If we find a multiple line and we have a current pool
            elif 'multiple:' in line and current_pool and current_pool in multiples:
                # Replace the multiple value using string formatting instead of regex groups
                new_line = re.sub(
                    r'multiple:\s*[0-9.]+',
                    f'multiple: {multiples[current_pool]}',
                    line
                )
                lines[i] = new_line
                current_pool = None  # Reset current pool after using it
        
        # Write the modified lines back to the file
        with open(file_path, 'w', encoding='utf-8') as file:
            file.writelines(lines)
            
        print("\nSuccessfully updated info.tsx with new multiples!")
            
    except Exception as e:
        print(f"\nError updating info.tsx: {e}")
        raise

def main():
    # List of pools in exact order from SwarmData array
    pools = {
        'KinOS': '37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8',
        'SLOP FATHER': None,  # No pool
        'DigitalKin': 'FM6aFbs9cQ6Jrp3GJPABBVxpLnGFEZZD3tSJ5JGCUsyZ',
        'Kin Kong': 'FwJfuUfrX91VH1Li4PJWCNXXRR4gUXLkqbEgQPo6t9fz',
        'Swarm Ventures': '911eRdu96ncdnmEUYA3UQ39gEtE9ueg7UbqycKuKweCG',
        'Terminal Velocity': None,  # No pool
        'Synthetic Souls': 'CmC2AUuurX19TLBVQbpNct8pmEjaHsRj6o8SLBAVvxAk',
        'DuoAI': '68K6BBsPynRbLkjJzdQmKMvTPLaUiKb93BUwbJfjqepS',
        'XForge': 'AaFvJBvjuCTs93EVNYqMcK5upiTaTh33SV7q4hjaPFNi',
        'PropertyKin': '6HnxTkNhQaoYRkPyZD1zTH5WBvFGLes5X2vrH66roa5G',
        'TherapyKin': '5wWLpeH2DDrAS9Lxx1nGnwtMTvu7U9txf4BuXxdN6V6H',
        'PublishKin': 'Dt7iwGTgRVZGV2NZFvNtrWVNX77s8ejGdhB2XaR4DxX6',
        'PlayWise': '2iAarCWnsdFqddprxzUwmaLiozHarMTpzLdhJPbi2HRR',
        'TalentKin': 'DTFE1peg5aNe8gFuaT9KZe8TJ4RHks9prpd12iUBKwi4',
        'CareHive': 'FHXsVnEfqHQBQS6An4icuSD5ewwn5WWkoj2LWRMGw4mb',
        'CommerceNest': '9hAfNquoNDbvzcEc1rBG8JzbWRskAsjKm7sYbarRfxyj',
        'ProfitBeeAI': '7AEP5qWyPF92Wgv6tLCwe51e8yrF3WwSzSef5Vg7RQt4',
        'DeskMate': 'Gucj554x7dRebtfUBxK1XTBUhQmq2Rqp4v2H6WtL7wNX',
        'STUMPED': '5wL5rah4gWqbbv74vWvsmqqEf99uhRLr3jNPsMcw5imN',
        'TravelAId': 'BEsb73xDJH3PrRGs1D4zkPAssg94Yi8dAtiFa59gzeY1',
        'GrantKin': '3oa4GKg3hpavEAEacDUKJQoA12VPvRE1CKoHypBho2Rt',
        'CareerKin': 'EMtoBMEn6JtV9tnbF8ZVVrxnYZbdapWAYEzabq7cW2gR',
        'Robinhood Agent': 'H7xCtjoCyqf55uc5nmPKpypN82jANkRDTNmPx6C3XhS5',
        'StudioKin': 'EJ4Ad3faa43JLZW3HQnxweYFqm4T2cUzBGntG5KnJWE8',
        'WealthHive': 'HeR7qoPbvmgcLFywkduZ27Hr2wKYuxtVkTBaGhVohP88',
        'AI Alley': 'DmdtWBcEwWr15MCm9Wa8iB8EJhHPK9NydiuLptuvMBxj',
        'LogicAtlas': '9pMb8Ez61vh3YRKKKrkdA5MthswuNE6Bzj9KYPEVCFme'
    }

    print("\nSwarm Multiples:\n")
    print("Name                  Multiple    Shares Sold")
    print("-" * 50)

    multiples = {}  # Store multiples for file update

    for name, pool in pools.items():
        try:
            # Add random delay between requests
            time.sleep(random.uniform(0.5, 1.5))
            
            response = get_account_info(pool)
            if not response or not response.get('result') or not response['result'].get('value'):
                print(f"{name:<20} No data found")
                continue

            # Decode base64 data
            data = base64.b64decode(response['result']['value']['data'][0])
            
            # Parse the data according to the account structure
            total_shares, available_shares = parse_pool_data(data)
            
            # Validate the numbers
            if total_shares <= 0 or available_shares < 0 or available_shares > total_shares:
                print(f"{name:<20} Invalid share counts: total={total_shares}, available={available_shares}")
                continue
                
            sold_shares = total_shares - available_shares
            cycle = sold_shares // 5000
            multiple = round(pow(1.35, cycle), 2)  # Round to 2 decimal places
            
            # Store multiple for file update
            multiples[pool] = multiple
            
            print(f"{name:<20} {multiple:>8.2f}x    {sold_shares:>10,}")

        except Exception as e:
            print(f"{name:<20} Error: {str(e)}")

    # Update the info.tsx file
    update_info_file(multiples)

if __name__ == "__main__":
    main()
