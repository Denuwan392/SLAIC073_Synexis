import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get bus and train schedules
export const getSchedules = async (query: string) => {
  try {
    const response = await apiClient.get(`/schedules?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching schedules: ' + error.message);
  }
};

// Function to send a message to the assistant
export const sendMessage = async (message: string) => {
  try {
    const response = await apiClient.post('/ask', {
      query: message
    });
    // The response will have: original_query, detected_language, travel_legs, final_answer, errors
    return {
      response: response.data.final_answer || response.data.message || 'No response'
    };
  } catch (error: any) {
    console.error('API Error:', error);
    throw new Error('Error sending message: Network Error');
  }
};

// Function to get real-time train tracking information
export const getTrainTracking = async (trainId: string) => {
  try {
    const response = await apiClient.get(`/train-tracking/${trainId}`);
    return response.data;
  } catch (error: any) {
    throw new Error('Error fetching train tracking: ' + error.message);
  }
};

// Function to fetch message history
export const fetchMessages = async () => {
  try {
    // For now, return empty array since we don't have a message history endpoint
    // You can add actual API call when backend supports it
    return [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};