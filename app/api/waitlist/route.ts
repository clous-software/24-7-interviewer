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



export const submitContact = async (values: {
  email: string,
  first_name:string,
  last_name: string,
  tool_used: string,
  reason: string
  phone_number?: string,
}): Promise<any> => {
  try {
    // Obtener el token CSRF de las cookies

    const response = await axios.post(`${process.env.API_URL}/api/contact/`, values);
    console.log("Here's the response:", response);
    console.log("Here's the values passed:", values);

    return response.data;
  } catch (error) {
    console.error("Here's the error in the API call:", error)
    if (axios.isAxiosError(error)) {
      // Manejo de errores específicos de Axios
      console.error("Error when submitting the contact form:", error.response?.data);
      throw new Error('Error when submitting the contact form.');
    } else {
      // Manejo de otros tipos de errores
      console.error("Unexpected error:", error);
      throw new Error('Unexpected error while submitting the contact form.');
    }
  } 
}

export const submitRequest = async (requestData: {
  first_name:string,
  last_name: string,
  email: string,
  role: string,
  expectations: string,
}): Promise<any> => {
  try {
    // Obtener el token CSRF de las cookies

    const response = await axios.post(`${process.env.API_URL}/api/contact/`, requestData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Manejo de errores específicos de Axios
      console.error("Error when submitting the contact form:", error.response?.data);
      throw new Error('Error when submitting the contact form.');
    } else {
      // Manejo de otros tipos de errores
      console.error("Unexpected error:", error);
      throw new Error('Unexpected error while submitting the contact form.');
    }
  } 
}

export const submitFeedback = async (feedbackData: {
  message: string,
}): Promise<any> => {
  try {

    const response = await axios.post(`${process.env.API_URL}/api/feedback/`, feedbackData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error when submitting the contact form:", error.response?.data);
      throw new Error('Error when submitting the contact form.');
    } else {
      console.error("Unexpected error:", error);
      throw new Error('Unexpected error while submitting the feedback.');
    }
  } 
}
