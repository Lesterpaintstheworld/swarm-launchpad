import requests
import base64
import time
from typing import Dict, List, Optional
import json
from collections import defaultdict

import os
from dotenv import load_dotenv

# Constants
load_dotenv()
PROGRAM_ID = "4dWhc3nkP4WeQkv7ws4dAxp6sNTBLCuzhTGTf1FynDcf"
HELIUS_RPC = f"https://mainnet.helius-rpc.com/?api-key={os.getenv('HELIUS_RPC_KEY')}"
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

# Weekly revenue constants (from dividendPayments component)
WEEKLY_REVENUES = {
    'FwJfuUfrX91VH1Li4PJWCNXXRR4gUXLkqbEgQPo6t9fz': 12000,  # Kin Kong
    'AaFvJBvjuCTs93EVNYqMcK5upiTaTh33SV7q4hjaPFNi': 160000, # XForge
    '37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8': 46000,  # KinOS
}

def get_program_accounts(pool_address: str, retries: int = 0) -> List[Dict]:
    """Fetch all shareholder accounts for a given pool"""
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
        raw_data = base64.b64decode(data)
        shares = int.from_bytes(raw_data[40:48], 'little')
        return shares
    except Exception as e:
        print(f"Error parsing account data: {e}")
        return 0

def main():
    # Load top holders from JSON
    with open('data/shares/top_holders.json', 'r') as f:
        top_holders = json.load(f)

    # Track revenue for each holder
    holder_revenues = defaultdict(lambda: {
        'compute_revenue': 0,
        'ubc_revenue': 0,
        'details': []
    })

    print("\nCalculating Weekly Revenue for Top Holders:\n")

    # Process each revenue-generating pool
    for pool_address, weekly_revenue in WEEKLY_REVENUES.items():
        try:
            print(f"\nProcessing pool {pool_address}...")
            
            # Get all accounts for this pool
            accounts = get_program_accounts(pool_address)
            
            # Calculate total shares in pool
            total_shares = 0
            wallet_shares = {}
            
            for account in accounts:
                shares = parse_account_data(account['account']['data'][0])
                if shares > 0:
                    wallet = account['pubkey']
                    wallet_shares[wallet] = shares
                    total_shares += shares

            # Check each top holder's position
            for holder_address in top_holders:
                holder_total_shares = 0
                for wallet, shares in wallet_shares.items():
                    if wallet == holder_address:
                        holder_total_shares += shares

                if holder_total_shares > 0:
                    # Calculate revenue share (90% COMPUTE, 10% UBC)
                    ownership_percentage = holder_total_shares / total_shares
                    compute_amount = int(weekly_revenue * 0.90 * ownership_percentage)
                    ubc_amount = int(weekly_revenue * 0.10 * ownership_percentage)

                    # Add to holder's total
                    holder_revenues[holder_address]['compute_revenue'] += compute_amount
                    holder_revenues[holder_address]['ubc_revenue'] += ubc_amount
                    holder_revenues[holder_address]['details'].append({
                        'pool': pool_address,
                        'shares': holder_total_shares,
                        'total_shares': total_shares,
                        'compute_amount': compute_amount,
                        'ubc_amount': ubc_amount
                    })

        except Exception as e:
            print(f"Error processing pool {pool_address}: {e}")

    # Sort holders by total revenue and print results
    sorted_holders = sorted(
        holder_revenues.items(),
        key=lambda x: x[1]['compute_revenue'],
        reverse=True
    )

    print("\nWeekly Revenue Distribution for Top Holders:\n")
    print("Address                                                  Weekly COMPUTE    Weekly UBC")
    print("-" * 100)

    for address, revenue in sorted_holders:
        print(
            f"{address}    {revenue['compute_revenue']:>10,} $COMPUTE    {revenue['ubc_revenue']:>8,} $UBC"
        )

        # Print detailed breakdown
        print('\nDetailed Breakdown:')
        for detail in revenue['details']:
            print(f"  Pool {detail['pool']}:")
            print(f"    Shares: {detail['shares']:,} / {detail['total_shares']:,} "
                  f"({(detail['shares']/detail['total_shares']*100):.2f}%)")
            print(f"    Revenue: {detail['compute_amount']:,} $COMPUTE + {detail['ubc_amount']:,} $UBC")
        print("-" * 100)

    # Print summary statistics
    total_compute = sum(rev['compute_revenue'] for _, rev in sorted_holders)
    total_ubc = sum(rev['ubc_revenue'] for _, rev in sorted_holders)
    holder_count = len(sorted_holders)

    print('\nSummary Statistics:')
    print(f"Total Weekly Distribution: {total_compute:,} $COMPUTE + {total_ubc:,} $UBC")
    print(f"Number of Revenue-Earning Holders: {holder_count}")
    if holder_count > 0:
        print(f"Average Weekly Revenue per Holder: {total_compute//holder_count:,} $COMPUTE + {total_ubc//holder_count:,} $UBC")

if __name__ == "__main__":
    main()
