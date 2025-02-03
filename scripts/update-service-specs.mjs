#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

async function updateServiceSpecs(serviceId) {
  try {
    console.log(`Updating specs for service ${serviceId}...`);
    
    // First get the current service data
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Services?filterByFormula={serviceId}="${serviceId}"`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch service: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.records || data.records.length === 0) {
      console.log(`No service found with ID ${serviceId}`);
      return;
    }

    const record = data.records[0];
    
    // Check if specs already exist
    if (record.fields.specifications) {
      console.log(`Specs already exist for ${serviceId}, skipping...`);
      return;
    }

    // Update the service with empty arrays if no specs exist
    const updateResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Services/${record.id}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            specifications: '[]',
            deliverables: '[]',
            validation: '[]'
          }
        })
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Failed to update service: ${updateResponse.statusText}`);
    }

    console.log(`Successfully initialized specs for ${serviceId}`);
  } catch (error) {
    console.error(`Error updating service ${serviceId}:`, error);
  }
}

async function main() {
  try {
    // Fetch all services
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Services`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Update each service
    for (const record of data.records) {
      await updateServiceSpecs(record.fields.serviceId);
      // Add a small delay between updates
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Finished initializing service specifications');
  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

main();
