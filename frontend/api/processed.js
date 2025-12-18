import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Load environment variables from .env file in development/local testing
// In Vercel production, environment variables are set automatically
let dotenvLoaded = false;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  try {
    const dotenv = await import('dotenv');
    dotenv.config();
    dotenvLoaded = true;
  } catch (error) {
    // dotenv not available, continue without it (will use Vercel env vars)
  }
}

export default async function handler(req, res) {
  // Load dotenv if not already loaded (fallback for edge cases)
  if (!dotenvLoaded && process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    try {
      const dotenv = await import('dotenv');
      dotenv.config();
    } catch (error) {
      // Ignore
    }
  }
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize the Analytics Data API client
    // For Vercel, you'll need to set these as environment variables:
    // - GOOGLE_APPLICATION_CREDENTIALS_JSON: JSON string of service account credentials
    // - GA4_PROPERTY_ID: Your GA4 property ID (numeric, not the G-XXXXXXXXXX measurement ID)
    
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const propertyId = process.env.GA4_PROPERTY_ID;

    if (!credentialsJson || !propertyId) {
      return res.status(500).json({ 
        error: 'Missing required environment variables',
        message: 'Please set GOOGLE_APPLICATION_CREDENTIALS_JSON and GA4_PROPERTY_ID. For local testing, create a .env file in the frontend directory. For Vercel, set these as environment variables in the Vercel dashboard.'
      });
    }

    // Parse credentials
    const credentials = JSON.parse(credentialsJson);
    
    // Initialize the client with credentials
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key.replace(/\\n/g, '\n'),
      },
    });

    // Query for file_upload_processed events
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2020-01-01', // Start from when you began tracking
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'eventName',
        },
      ],
      metrics: [
        {
          name: 'eventCount',
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            matchType: 'EXACT',
            value: 'file_upload_processed',
          },
        },
      },
    });

    // Extract the total count
    let count = 0;
    if (response.rows && response.rows.length > 0) {
      count = parseInt(response.rows[0].metricValues[0].value || '0', 10);
    }

    // Return the count
    return res.status(200).json({
      count: count,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch analytics data',
      message: error.message 
    });
  }
}

