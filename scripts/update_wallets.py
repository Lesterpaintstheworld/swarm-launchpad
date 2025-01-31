import re
import json

# Map of swarm IDs to wallet addresses
WALLET_MAP = {
    'digitalkin-partner-id': '9PEHXookTVdhr4eFfar6RdGr1zPq1RfFxeoiRcR5XZwt',
    'h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q': '6t8QAg9SrsdD1SEt75iFLJDRzR8txZr3L6rBfuDHTqWW',  # ProfitBeeAI
    'mentor-swarm-id': 'GM3P3XTjhanEDFewwrfmUuoQUM7cei8ih1KPViHBb3E1',
    'wealthhive-inception-id': 'C1uvoRUhHj2o6swBMvgZsdzkaM3Po5J7WMtrcQxGcVJx',
    'speaker-swarm-id': 'EXQfXLxMkMg6HX2ETo929VFoJc1dqoqyWdspZrPerFcX',  # STUMPED
    'logicatlas-inception-id': 'CoaDrb1uq7dBfPeirzpYvVD87rPa3cde8oL6xgfqUA6G',  # LogicAtlas
    'altered-alley-inception-id': '7GmuNjA5AGWMu5izEfrBjakEjuwNpgh5QJuKB1GUq5mGI',
    'travel-swarm-id': '7xvZiYwZD6mBRkeWYm1p93Zy936HYhjSecPa85K9r3Tz',
    'grant-swarm-id': 'EnUAJY8TKSyqcHwktZCCQ7ixvofcGN8si1N4g1rey6Vu',
    'resume-swarm-id': '8KpUuw7eZQqKUu8byivvzoY1AUotPsabsEL48gKQNuRj',  # CareerKin
    'propertykin-inception-id': '7y555firARY2tnQjYKfpy18Zu9vYYZwaftMohenyHuG',
    'f7a92b3c-d8e4-4c1a-9f5d-1234567890ab': '6EfkPAoDDeRhDdzbsjYxYkfs5DysnR3ikzm5PK32uQqB',  # StudioKin
    'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d': '9StiTDrivvtbjFiM9z1J4Zg63ALS5vkUoGXZz7aCeNyD',  # RobinhoodAgent
    'b2c3d4e5-f6g7-5b6c-9d0e-1f2g3h4i5j6k': 'AyA5XS9NKQUoVroHkvZy6ppssAGQzU2n69PRfKxgvWtu',  # TherapyKin
    'c3d4e5f6-g7h8-6c7d-ae1f-2g3h4i5j6k7l': '6eAG4RQkAHPFfKGkiXWXcBXou9QcEfxVxXrt8bYqY5PE',  # PublishKin
    'd4e5f6g7-h8i9-7d8e-bf2g-3h4i5j6k7l8m': '3VvQGX8pozFdnfoTED6bAH9NkUJkzUyxjdPZdsSWEPce',  # ToyKin
    'e5f6g7h8-i9j0-8e9f-cg3h-4i5j6k7l8m9n': 'J7VQ5m9A66t6s4VZ463Yxgt3G5cDA2qhs6ztafB1p3P9',  # TalentKin
    'f6g7h8i9-j0k1-9f0g-dh4i-5j6k7l8m9n0o': 'EU9nEKBFEcK2C6oBvTKwywhBpW2xkSatJ3c2eWLYuXm1',  # CareHive
    'g7h8i9j0-k1l2-0g1h-ei5j-6k7l8m9n0o1p': '3yiG4ftdPae7zfrPcm1x9Mpykh46Yqt6MJVWzPceVM1H',  # CommerceNest
    'eb76ae17-b9eb-476d-b272-4bde2d85c808': '7wNok2HWJxNt8fS1aL9bhs4FvEu1jdPaNugSy65RsTcK',  # Kinkong
    'e8ffff3d-64d3-44d3-a8cf-f082c5c42234': '8sUWjMiNsLvmCPerFdmgGJkyQitTXAbwXmQ2CejMPCbN',  # SwarmVentures
    '03616e66-a21e-425b-a93b-16d6396e883f': 'AyJ2wV7UYHwkxvveyuwn2gzDrs9sK6grcyqjLFW3pcaF',  # Synthetic Souls
    '7d3c9e5b-1f8a-4d3c-b8d4-9e5b1f8a4d3c': 'GkfRszY7B93QL6o8DSP2inVspBpDeZAHCjvYyLddyAo3',  # DuoAI
    'forge-partner-id': 'AFSr2ATJ244u1CY8JRKAK85uuW7VsjNiyKSycmVR4Vg9'  # XForge
}

def find_matching_brace(content: str, start_pos: int) -> int:
    """Find the matching closing brace for an object, handling nested objects correctly"""
    brace_count = 1
    pos = start_pos + 1
    in_string = False
    escape_char = False
    
    while pos < len(content) and brace_count > 0:
        char = content[pos]
        
        if escape_char:
            escape_char = False
        elif char == '\\':
            escape_char = True
        elif char == '"' and not escape_char:
            in_string = not in_string
        elif not in_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                
        pos += 1
        
    return pos - 1 if brace_count == 0 else -1

def update_info_file(multiples: dict):
    # The order of pools must match exactly with SwarmData order
    pool_order = [
        '37u532qgHbjUHic6mQK51jkT3Do7qkWLEUQCx22MDBD8',  # KinOS
        None,  # SLOP FATHER (no pool)
        'FM6aFbs9cQ6Jrp3GJPABBVxpLnGFEZZD3tSJ5JGCUsyZ',  # DigitalKin
        'FwJfuUfrX91VH1Li4PJWCNXXRR4gUXLkqbEgQPo6t9fz',  # Kin Kong
        '911eRdu96ncdnmEUYA3UQ39gEtE9ueg7UbqycKuKweCG',  # Swarm Ventures
        None,  # Terminal Velocity (no pool)
        'CmC2AUuurX19TLBVQbpNct8pmEjaHsRj6o8SLBAVvxAk',  # Synthetic Souls
        '68K6BBsPynRbLkjJzdQmKMvTPLaUiKb93BUwbJfjqepS',  # DuoAI
        'AaFvJBvjuCTs93EVNYqMcK5upiTaTh33SV7q4hjaPFNi',  # XForge
        '6HnxTkNhQaoYRkPyZD1zTH5WBvFGLes5X2vrH66roa5G',  # PropertyKin
        '5wWLpeH2DDrAS9Lxx1nGnwtMTvu7U9txf4BuXxdN6V6H',  # TherapyKin
        'Dt7iwGTgRVZGV2NZFvNtrWVNX77s8ejGdhB2XaR4DxX6',  # PublishKin
        '2iAarCWnsdFqddprxzUwmaLiozHarMTpzLdhJPbi2HRR',  # PlayWise
        'DTFE1peg5aNe8gFuaT9KZe8TJ4RHks9prpd12iUBKwi4',  # TalentKin
        'FHXsVnEfqHQBQS6An4icuSD5ewwn5WWkoj2LWRMGw4mb',  # CareHive
        '9hAfNquoNDbvzcEc1rBG8JzbWRskAsjKm7sYbarRfxyj',  # CommerceNest
        '7AEP5qWyPF92Wgv6tLCwe51e8yrF3WwSzSef5Vg7RQt4',  # ProfitBeeAI
        'Gucj554x7dRebtfUBxK1XTBUhQmq2Rqp4v2H6WtL7wNX',  # DeskMate
        '5wL5rah4gWqbbv74vWvsmqqEf99uhRLr3jNPsMcw5imN',  # STUMPED
        'BEsb73xDJH3PrRGs1D4zkPAssg94Yi8dAtiFa59gzeY1',  # TravelAId
        '3oa4GKg3hpavEAEacDUKJQoA12VPvRE1CKoHypBho2Rt',  # GrantKin
        'EMtoBMEn6JtV9tnbF8ZVVrxnYZbdapWAYEzabq7cW2gR',  # CareerKin
        'H7xCtjoCyqf55uc5nmPKpypN82jANkRDTNmPx6C3XhS5',  # Robinhood Agent
        'EJ4Ad3faa43JLZW3HQnxweYFqm4T2cUzBGntG5KnJWE8',  # StudioKin
        'HeR7qoPbvmgcLFywkduZ27Hr2wKYuxtVkTBaGhVohP88',  # WealthHive
        'DmdtWBcEwWr15MCm9Wa8iB8EJhHPK9NydiuLptuvMBxj',  # AI Alley
        '9pMb8Ez61vh3YRKKKrkdA5MthswuNE6Bzj9KYPEVCFme',  # LogicAtlas
    ]

    file_path = 'data/swarms/info.tsx'
    
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()

        # For each pool in order
        for pool in pool_order:
            if pool and pool in multiples:
                # Create regex pattern to match the multiple value for this swarm
                pattern = rf'(multiple:\s*)[0-9.]+([,\n])'
                replacement = rf'\g<1>{multiples[pool]}\2'
                
                # Replace first occurrence only (maintains order)
                content = re.sub(pattern, replacement, content, count=1)

        # Write updated content
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
            
        print("\nSuccessfully updated info.tsx with new multiples!")
            
    except Exception as e:
        print(f"\nError updating info.tsx: {e}")
        raise

if __name__ == "__main__":
    update_info_file()
