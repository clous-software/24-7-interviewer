// lib/ai.ts
import axios from 'axios';

export const createRiverRequest = async (formData: FormData) => {
  try {
    console.log('API_URL:', process.env.API_URL);  // Debugging line

    const response = await axios.post(
      `${process.env.API_URL}/api/petie/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'json'
      }
    );

    const audioBase64 = response.data.audio_response;
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const audioArray = new Uint8Array(audioBuffer);

    console.log('First 16 bytes of audio:', audioArray.slice(0, 16));

    const audioBlob = new Blob([audioArray], { type: 'audio/mp3' });

    console.log('Here is the audioBlob:', audioBlob);
    return {
      response: response.data.text_response,
      audioBlob: audioBlob
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};
