import axios from 'axios';

const API_BASE_URL = 'https://nyc-taxi-dashboard-api.vercel.app';

export const fetchTrips = async (filters) => {
  try {
    let startDate = filters.dateRange?.[0]?.toISOString();
    let endDate = filters.dateRange?.[1]?.toISOString();

    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    if (filters.fareRange) {
      queryParams.append('minFare', filters.fareRange[0]);
      queryParams.append('maxFare', filters.fareRange[1]);
    }
    
    if (filters.distanceRange) {
      queryParams.append('minDistance', filters.distanceRange[0]);
      queryParams.append('maxDistance', filters.distanceRange[1]);
    }
    
    if (filters.paymentType && filters.paymentType !== 'all') {
      queryParams.append('paymentType', filters.paymentType);
    }

    console.log('Making request to:', `${API_BASE_URL}/api/trips`);
    console.log('With params:', Object.fromEntries(queryParams));

    const response = await axios({
      method: 'GET',
      url: `${API_BASE_URL}/api/trips`,
      params: Object.fromEntries(queryParams),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response:', response.data);

    return response.data;

  } catch (error) {
    console.error('API Error:', error.response || error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch trip data'
    );
  }
};