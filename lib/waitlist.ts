import axios, { AxiosError } from "axios";

export const joinWaitlist = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(`${process.env.API_URL}/api/waitlist/`, {
      email: email, is_candidate: true,
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