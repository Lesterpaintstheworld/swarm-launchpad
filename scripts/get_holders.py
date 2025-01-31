import requests
import base64
import time
from typing import Dict, List, Optional
import random
from collections import defaultdict

# Constants
PROGRAM_ID = "4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf"
HELIUS_RPC = "https://mainnet.helius-rpc.com/?api-key=4c3a5fc2-ea3f-45eb-85d5-2f282a6b4401"
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

# Hardcoded pools data
POOLS = {
    'KinOS': '37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8',
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
    'WealthHive': 'HeR7qoPbvmgcLFywkduZ27Hr2wKYuxtVkTBaGhVohP88',
    'AI Alley': 'DmdtWBcEwWr15MCm9Wa8iB8EJhHPK9NydiuLptuvMBxj',
    'LogicAtlas': '9pMb8Ez61vh3YRKKKrkdA5MthswuNE6Bzj9KYPEVCFme'
}

class SwarmHolder:
    def __init__(self, wallet: str):
        self.wallet = wallet
        self.shares = 0
        self.percentage = 0.0

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
        
        # The shareholder account structure should have shares at offset 40
        # This is after: discriminator (8 bytes) + pool (32 bytes)
        shares = int.from_bytes(raw_data[40:48], 'little')
        return shares
    except Exception as e:
        print(f"Error parsing account data: {e}")
        return 0

def main():
    print("\nSwarm Holders Analysis:\n")
    print("Name                  Holders    Total Shares    Top Holder %")
    print("-" * 65)

    for name, pool in POOLS.items():
        try:
            print(f"\nProcessing {name}...")
            
            # Add random delay between requests
            time.sleep(random.uniform(0.5, 1.5))
            
            accounts = get_program_accounts(pool)
            
            # Use defaultdict to aggregate shares by wallet
            wallet_shares = defaultdict(int)
            total_shares = 0
            
            for account in accounts:
                shares = parse_account_data(account['account']['data'][0])
                if shares > 0:
                    wallet = account['pubkey']
                    wallet_shares[wallet] += shares
                    total_shares += shares

            # Convert to list of SwarmHolder objects
            holders = []
            for wallet, shares in wallet_shares.items():
                holder = SwarmHolder(wallet)
                holder.shares = shares
                holder.percentage = (shares / total_shares * 100) if total_shares > 0 else 0
                holders.append(holder)

            # Sort by percentage descending
            holders.sort(key=lambda x: x.percentage, reverse=True)

            # Print summary
            top_holder_pct = holders[0].percentage if holders else 0
            print(f"{name:<20} {len(holders):>8} {total_shares:>13,} {top_holder_pct:>11.1f}%")

            # Print top 10 holders
            print("\nTop 10 Holders:")
            for i, holder in enumerate(holders[:10], 1):
                print(f"{i}. {holder.wallet}")
                print(f"   Shares: {holder.shares:,} ({holder.percentage:.2f}%)")
            print("-" * 65)

        except Exception as e:
            print(f"Error processing {name}: {str(e)}")

if __name__ == "__main__":
    main()
