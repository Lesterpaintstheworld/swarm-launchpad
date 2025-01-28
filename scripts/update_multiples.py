import requests
import base64
import time
from typing import Optional
import random

# Constants
PROGRAM_ID = "4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf"
RPC_URL = "https://api.mainnet-beta.solana.com"
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

def get_account_info(pubkey: str, retries: int = 0) -> Optional[dict]:
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
        response = requests.post(RPC_URL, json=payload)
        response.raise_for_status()
        data = response.json()
        
        if 'error' in data:
            if retries < MAX_RETRIES and ('429' in str(data['error']) or 'too large' in str(data['error']).lower()):
                time.sleep(RETRY_DELAY * (retries + 1))
                return get_account_info(pubkey, retries + 1)
            raise Exception(data['error'])
            
        return data
        
    except Exception as e:
        if retries < MAX_RETRIES:
            time.sleep(RETRY_DELAY * (retries + 1))
            return get_account_info(pubkey, retries + 1)
        raise e

def main():
    # List of pools to check
    pools = {
        'DigitalKin': 'FM6aFbs9cQ6Jrp3GJPABBVxpLnGFEZZD3tSJ5JGCUsyZ',
        'Kin Kong': 'FwJfuUfrX91VH1Li4PJWCNXXRR4gUXLkqbEgQPo6t9fz',
        'Swarm Ventures': '911eRdu96ncdnmEUYA3UQ39gEtE9ueg7UbqycKuKweCG',
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
        'WealthHive': 'HeR7qoPbvmgcLFywkduZ27Hr2wKYuxtVkTBaGhVohP88'
    }

    print("\nSwarm Multiples:\n")
    print("Name                  Multiple    Shares Sold")
    print("-" * 50)

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
            
            # Skip 8 byte discriminator
            data = data[8:]
            
            # Skip pool_name and admin_authority
            offset = 32 + 32
            total_shares = int.from_bytes(data[offset:offset+8], 'little')
            available_shares = int.from_bytes(data[offset+8:offset+16], 'little')
            
            # Validate the numbers
            if total_shares < 0 or available_shares < 0 or available_shares > total_shares:
                print(f"{name:<20} Invalid share counts: total={total_shares}, available={available_shares}")
                continue
                
            sold_shares = total_shares - available_shares
            cycle = sold_shares // 5000
            multiple = pow(1.35, cycle)
            
            print(f"{name:<20} {multiple:>8.2f}x    {sold_shares:>10,}")

        except Exception as e:
            print(f"{name:<20} Error: {str(e)}")

if __name__ == "__main__":
    main()
