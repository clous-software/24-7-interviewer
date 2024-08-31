import axios, { AxiosError } from "axios";
import Cookie from 'js-cookie';

export const joinWaitlist = async (email: string): Promise<any> => {
  try {
    // Get the CSRF token from cookies
    const csrfToken = Cookie.get('csrftoken');

    const response = await axios.post(`${process.env.API_URL}/api/waitlist/`, {
      email: email
    }, {
      headers: {
        // Include the CSRF token in the headers
        'X-CSRFToken': csrfToken
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handling specific Axios errors
      console.error("Error joining the waitlist:");
      throw new Error('Error joining the waitlist.');
    } else {
      // Handling other types of errors
      console.error("Unexpected error:");
      throw new Error('Unexpected error while joining the waitlist.');
    }
  } 
}