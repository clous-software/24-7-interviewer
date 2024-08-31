import axios, { AxiosResponse } from 'axios';

export const createRiverRequest = async (audio: FormData) => {
    const userToken = localStorage.getItem('userToken');
    try {
      console.log('API_URL:', process.env.API_URL);  // Debugging line

      const response = await axios.post(
        `${process.env.API_URL}/api/petie/`,
        audio,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          responseType: 'json'
        }
      );
      const audioBase64 = response.data.audio_response;
      // Decode Base64 string directly to Uint8Array
      const audioBuffer = Buffer.from(audioBase64, 'base64');
      const audioArray = new Uint8Array(audioBuffer);
      
      console.log('First 16 bytes of audio:', audioArray.slice(0, 16));
      
      // Create a Blob from the Uint8Array
      // const audioBlob = createWavFile(audioArray);
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
  