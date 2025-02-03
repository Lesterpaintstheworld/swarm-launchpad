import os
from dotenv import load_dotenv
import requests
import time

# Load environment variables
load_dotenv()

AIRTABLE_API_KEY = os.getenv('AIRTABLE_API_KEY')
AIRTABLE_BASE_ID = os.getenv('AIRTABLE_BASE_ID')
AIRTABLE_TABLE_NAME = 'Swarms'

if not AIRTABLE_API_KEY or not AIRTABLE_BASE_ID:
    print('Missing required environment variables. Please check your .env file')
    exit(1)

def read_description_file(filename):
    """Read the content of a description file"""
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        # Extract the description string from the TypeScript export
        if 'export const description =' in content:
            # Split on the first occurrence of backtick and take everything after
            description = content.split('`', 1)[1]
            # Remove the final backtick
            description = description.rsplit('`', 1)[0]
            return description.strip()
    return None

def update_swarm_description(swarm_id, full_description):
    """Update a swarm's description in Airtable"""
    try:
        # First find the record ID
        url = f'https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}'
        headers = {
            'Authorization': f'Bearer {AIRTABLE_API_KEY}'
        }
        params = {
            'filterByFormula': f'{{swarmId}}="{swarm_id}"'
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        records = response.json().get('records', [])
        if not records:
            print(f'No record found for swarmId: {swarm_id}')
            return
        
        record_id = records[0]['id']
        
        # Update the record
        update_url = f'{url}/{record_id}'
        payload = {
            'fields': {
                'description': full_description
            }
        }
        
        update_response = requests.patch(update_url, headers={**headers, 'Content-Type': 'application/json'}, json=payload)
        update_response.raise_for_status()
        
        print(f'Updated description for swarm: {swarm_id}')
        return update_response.json()
        
    except Exception as e:
        print(f'Error updating swarm {swarm_id}:', e)
        raise

def main():
    descriptions_dir = 'data/swarms/descriptions'
    
    # Map of filename (without extension) to swarm ID
    swarm_mappings = {
        'affiliate': 'h8i9j0k1-l2m3-1h2i-fj6k-7l8m9n0o1p2q',
        # Add more mappings as we add more description files
    }
    
    print('Starting description updates...')
    
    for filename, swarm_id in swarm_mappings.items():
        filepath = os.path.join(descriptions_dir, f'{filename}.ts')
        
        if not os.path.exists(filepath):
            print(f'Warning: Description file not found: {filepath}')
            continue
            
        description = read_description_file(filepath)
        if description:
            try:
                update_swarm_description(swarm_id, description)
                # Add a small delay between updates to avoid rate limits
                time.sleep(1)
            except Exception as e:
                print(f'Failed to update {filename}:', e)
        else:
            print(f'Warning: Could not extract description from {filepath}')
    
    print('Successfully completed description updates')

if __name__ == '__main__':
    main()
import os
from dotenv import load_dotenv
import requests
import time

# Load environment variables
load_dotenv()

AIRTABLE_API_KEY = os.getenv('AIRTABLE_API_KEY')
AIRTABLE_BASE_ID = os.getenv('AIRTABLE_BASE_ID')
AIRTABLE_TABLE_NAME = 'Swarms'

# Mapping of filename (without extension) to swarm ID
SWARM_ID_MAPPING = {
    'affiliate': 'profitbeeai',
    'alteredalley': 'aialley',
    'carehive': 'carehive', 
    'commercenest': 'commercenest',
    'digitalkin': 'digitalkin',
    'duoai': 'duoai',
    'educative': 'wealthhive',
    'gamebuddy': 'duoai',
    'grant': 'grantkin',
    'kinkong': 'kinkong',
    'kinos': 'kinos',
    'logicatlas': 'logicatlas',
    'mental-health': 'therapykin',
    'mentor': 'deskmate',
    'propertykin': 'propertykin',
    'publishing': 'publishkin',
    'resume': 'careerkin',
    'robinhood': 'robinhoodagent',
    'screenplay': 'studiokin',
    'slopfather': 'slopfather',
    'speaker': 'stumped',
    'swarmventures': 'swarmventures',
    'syntheticsouls': 'syntheticsouls',
    'talent': 'talentkin',
    'travel': 'travelaidai',
    'xforge': 'xforge',
}

if not AIRTABLE_API_KEY or not AIRTABLE_BASE_ID:
    print('Missing required environment variables. Please check your .env file')
    exit(1)

def read_description_file(filename):
    """Read the content of a markdown file"""
    with open(filename, 'r', encoding='utf-8') as f:
        return f.read().strip()

def update_swarm_description(swarm_id, full_description):
    """Update a swarm's description in Airtable"""
    try:
        # First find the record ID
        url = f'https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/{AIRTABLE_TABLE_NAME}'
        headers = {
            'Authorization': f'Bearer {AIRTABLE_API_KEY}'
        }
        params = {
            'filterByFormula': f'{{swarmId}}="{swarm_id}"'
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        records = response.json().get('records', [])
        if not records:
            print(f'No record found for swarmId: {swarm_id}')
            return
        
        record_id = records[0]['id']
        
        # Update the record
        update_url = f'{url}/{record_id}'
        payload = {
            'fields': {
                'description': full_description
            }
        }
        
        update_response = requests.patch(update_url, headers={**headers, 'Content-Type': 'application/json'}, json=payload)
        update_response.raise_for_status()
        
        print(f'Updated description for swarm: {swarm_id}')
        return update_response.json()
        
    except Exception as e:
        print(f'Error updating swarm {swarm_id}:', e)
        raise

def main():
    descriptions_dir = 'data/swarms/descriptions'
    
    print('Starting description updates...')
    
    # Get all .md files in the descriptions directory
    for filename in os.listdir(descriptions_dir):
        if filename.endswith('.md'):
            base_name = filename[:-3]  # Remove .md extension
            
            # Skip if no mapping exists
            if base_name not in SWARM_ID_MAPPING:
                print(f'Warning: No swarm ID mapping for {filename}')
                continue
                
            swarm_id = SWARM_ID_MAPPING[base_name]
            filepath = os.path.join(descriptions_dir, filename)
            
            description = read_description_file(filepath)
            if description:
                try:
                    update_swarm_description(swarm_id, description)
                    # Add a small delay between updates to avoid rate limits
                    time.sleep(1)
                except Exception as e:
                    print(f'Failed to update {filename}:', e)
            else:
                print(f'Warning: Could not read description from {filepath}')
    
    print('Successfully completed description updates')

if __name__ == '__main__':
    main()
