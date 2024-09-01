# This README file is not finished

### Here is the backend in Django

```python
class PetieCreateView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        audio_file = request.FILES.get('audio')
        print(f"Received files: {request.FILES}")
        if not audio_file:
            return Response({'error': 'No audio file provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            file_content = audio_file.read()
            print(f"File size: {len(file_content)} bytes")
            if not file_content:
                raise ValueError('The uploaded file is empty')

            # Audio to Text (using Whisper)
            transcription = groq.audio.transcriptions.create(
                file=(audio_file.name, file_content, audio_file.content_type),
                model="whisper-large-v3",
                temperature=0.0
            )
            transcript = transcription.text if hasattr(
                transcription, 'text') else str(transcription)
            print(f"Transcription result: {transcript}")

            # Text to Text (using LLaMA)
            response = openai.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {
                        "role": "system",
                        "content": """
                        You are an AI model designed to conduct realistic mock job interviews. Your primary role is to assist candidates in improving their interview skills by simulating a professional recruiter. Assume the user wants to participate in a mock interview. Your key responsibilities include:

                        ## Interview Functionalities

                        ### Conduct Structured Mock Interviews
                        - Progress in a logical sequence through brief opening, core questions, and closing stages with candidate questions.
                        - Adapt the interview flow based on candidate responses and conversation dynamics.
                        - Tailor questions to the specific industry, job role, and seniority level.
                        - Use industry-relevant terminology when needed

                        ### Provide Comprehensive Feedback
                        - Deliver constructive feedback at the end of the interview, rather than during the conversation.
                        - Higlight key strengths and areas for improvement post-interview.
                        - Focus on communication clarity, example specificity, and industry knowledge application.
                        - Offer specific examples from the interview to illustrate feedback points.

                        ## Behavioral Guidelines

                        ### Persona Consistency
                        - Develop and maintain a coherent interviewer persona reflecting professionalism and industry knowledge.
                        - Adapt the persona based on the specific role and industry context provided.

                        ### Interview Realism
                        - Recognize cues to move between interview stages.

                        ### Ethical Considerations
                        - Maintain ethical standards: avoid false information and decline discussions of illegal activities.
                        - Keep a professional boundary, avoiding personal conversations.

                        ### Adaptability
                        - Adjust question complexity based on candidate performance.
                        - Allow for deeper exploration of relevant topics while ensuring all critical areas are covered.

                        ### Language and Communication
                        - Use natural, conversational language. Avoid overly formal or rigid phrasing.
                        - Gently redirect off-topic responses while acknowledging the candidate's point.

                        ## Error Handling and Limitations
                        - Clearly communicate any limitations in industry-specific knowledge when applicable.
                        - Seek clarification when user input is ambiguous or unclear.
                        """,
                    },
                    {
                        "role": "user",
                        "content": transcript,
                    },
                ],
                max_tokens=2440,
                temperature=0.4,
            )
            respuesta_content = response.choices[0].message.content.strip()
            print(f"Text-to-Text response: {respuesta_content}")

            # # Text to Audio (using Cartesia Sonic)
            # cartesia_response = self.text_to_speech(respuesta_content)
            # if 'error' in cartesia_response:
            #     raise ValueError(cartesia_response['error'])

            # audio_response = cartesia_response['audio']

            openai_response = self.text_to_speech_openai(respuesta_content)
            if 'error' in openai_response:
                raise ValueError(openai_response['error'])

            audio_response = openai_response['audio']

            audio_base64 = base64.b64encode(audio_response).decode('utf-8')

            return JsonResponse(
                {'text_response': respuesta_content,
                    'audio_response': audio_base64},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            logger.error(f"Error during transcription: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def text_to_speech_openai(self, text):
        try:
            response = openai.audio.speech.create(
                model="tts-1",
                input=text,
                voice="alloy",
                response_format="mp3"
            )

            # if response.status != "succeeded":
            #     return {"error": "OpenAI TTS API call failed"}

            # The response is likely a binary stream, so we'll handle it accordingly
            audio_data = response.content  # Extract the binary content directly

            return {"audio": audio_data}

        except Exception as e:
            logger.error(f"Error during transcription: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```
