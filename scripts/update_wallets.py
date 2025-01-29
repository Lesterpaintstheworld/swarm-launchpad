import re

# Map of swarm IDs to wallet addresses
WALLET_MAP = {
    'digitalkin-partner-id': '9PEHXookTVdhr4eFfar6RdGr1zPq1RfFxeoiRcR5XZwt',
    'h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q': '6t8QAg9SrsdD1SEt75iFLJDRzR8txZr3L6rBfuDHTqWW',  # ProfitBeeAI
    'mentor-swarm-id': 'GM3P3XTjhanEDFewwrfmUuoQUM7cei8ih1KPViHBb3E1',
    'wealthhive-inception-id': 'C1uvoRUhHj2o6swBMvgZsdzkaM3Po5J7WMtrcQxGcVJx',
    'speaker-swarm-id': 'EXQfXLxMkMg6HX2ETo929VFoJc1dqoqyWdspZrPerFcX',  # STUMPED
    'logicatlas-inception-id': 'YOUR_WALLET_ADDRESS_HERE',  # LogicAtlas
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

def update_wallets():
    print("Starting wallet update process...")
    
    try:
        # Read the file
        print("Reading data/swarms/info.tsx...")
        with open('data/swarms/info.tsx', 'r', encoding='utf-8') as file:
            content = file.read()
        print(f"File read successfully. Content length: {len(content)} characters")

        changes_made = 0
        
        # For each swarm ID and wallet in the map
        for swarm_id, wallet in WALLET_MAP.items():
            print(f"\nProcessing swarm ID: {swarm_id}")
            
            # Find the swarm object with fixed pattern
            pattern = f'id:\\s*["\']?{swarm_id}["\']?'
            match = re.search(pattern, content)
            
            if not match:
                print(f"WARNING: Could not find swarm with ID: {swarm_id}")
                continue
                
            pos = match.start()
            print(f"Found swarm at position: {pos}")
            
            # Find the object boundaries
            start_pos = content.rfind('{', 0, pos)
            if start_pos == -1:
                print(f"ERROR: Could not find opening brace for swarm: {swarm_id}")
                continue
                
            end_pos = find_matching_brace(content, start_pos)
            if end_pos == -1:
                print(f"ERROR: Could not find closing brace for swarm: {swarm_id}")
                continue
                
            print(f"Object boundaries: {start_pos} to {end_pos}")
            
            # Get the swarm object text
            swarm_text = content[start_pos:end_pos + 1]
            print(f"Current swarm text length: {len(swarm_text)}")
            
            # Remove existing wallet if present
            swarm_text = re.sub(r',\s*wallet:\s*["\'][^"\']*["\']', '', swarm_text)
            
            # Add the new wallet before the closing brace
            # First find the last property
            last_prop_match = re.search(r',\s*[a-zA-Z]+:\s*[^,}]+\s*}$', swarm_text)
            if last_prop_match:
                insert_pos = last_prop_match.start() + 1
                new_swarm_text = (
                    swarm_text[:insert_pos] +
                    f'\n        wallet: "{wallet}",' +
                    swarm_text[insert_pos:]
                )
            else:
                # Fallback: insert before closing brace
                new_swarm_text = swarm_text[:-1] + f',\n        wallet: "{wallet}"\n    }}'
            
            # Replace the old swarm text with the new one
            if swarm_text != new_swarm_text:
                content = content[:start_pos] + new_swarm_text + content[end_pos + 1:]
                changes_made += 1
                print(f"Updated wallet for swarm: {swarm_id}")
            else:
                print(f"No changes needed for swarm: {swarm_id}")

        print(f"\nTotal changes made: {changes_made}")

        # Write the updated content back to the file
        print("\nWriting updated content back to file...")
        with open('data/swarms/info.tsx', 'w', encoding='utf-8') as file:
            file.write(content)
        print("File written successfully!")

    except Exception as e:
        print(f"ERROR: An exception occurred: {str(e)}")
        raise

    print("\nWallet update process completed!")

if __name__ == "__main__":
    update_wallets()
