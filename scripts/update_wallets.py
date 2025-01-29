import re

# Map of swarm IDs to wallet addresses
WALLET_MAP = {
    'digitalkin-partner-id': '9PEHXookTVdhr4eFfar6RdGr1zPq1RfFxeoiRcR5XZwt',
    'h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q': '6t8QAg9SrsdD1SEt75iFLJDRzR8txZr3L6rBfuDHTqWW',  # ProfitBeeAI
    'mentor-swarm-id': 'GM3P3XTjhanEDFewwrfmUuoQUM7cei8ih1KPViHBb3E1',
    'wealthhive-inception-id': 'C1uvoRUhHj2o6swBMvgZsdzkaM3Po5J7WMtrcQxGcVJx',
    'speaker-swarm-id': 'EXQfXLxMkMg6HX2ETo929VFoJc1dqoqyWdspZrPerFcX',  # STUMPED
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
            
            # Create pattern to match the swarm object - now handles both single and double quotes
            pattern = f'id: ["\'{swarm_id}]'
            
            # Find the position of the swarm object using regex
            match = re.search(pattern, content)
            if not match:
                print(f"WARNING: Could not find swarm with ID: {swarm_id}")
                continue
            pos = match.start()
            print(f"Found swarm at position: {pos}")
            
            # Find the next closing brace after the ID
            start_pos = content.find('{', pos)
            # Find matching closing brace by counting braces
            brace_count = 1
            end_pos = start_pos + 1
            while brace_count > 0 and end_pos < len(content):
                if content[end_pos] == '{':
                    brace_count += 1
                elif content[end_pos] == '}':
                    brace_count -= 1
                end_pos += 1
            end_pos -= 1  # Adjust to point to the closing brace
            
            if start_pos == -1 or end_pos == -1:
                print(f"ERROR: Could not find proper object boundaries for swarm: {swarm_id}")
                continue
            print(f"Object boundaries: {start_pos} to {end_pos}")
            
            # Get the swarm object text
            swarm_text = content[start_pos:end_pos+1]
            print(f"Current swarm text length: {len(swarm_text)}")
            
            # Remove existing wallet if present
            original_length = len(swarm_text)
            swarm_text = re.sub(r',\s*wallet:\s*[\'"][^\'"]*[\'"]', '', swarm_text)
            if len(swarm_text) != original_length:
                print("Removed existing wallet field")
            
            # Add the new wallet before the closing brace
            new_swarm_text = swarm_text[:-1] + f',\n        wallet: "{wallet}"' + swarm_text[-1]
            print(f"New swarm text length: {len(new_swarm_text)}")
            
            # Replace the old swarm text with the new one
            if swarm_text != new_swarm_text:
                content = content.replace(swarm_text, new_swarm_text)
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
