"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Textarea from 'react-expanding-textarea';
import { createRiverRequest } from "@/lib/ai";
// import { getAudioVoice } from "@/app/api/ai/route";
import { useRouter } from "next/navigation";
import { PiWaveformBold, PiWaveform } from "react-icons/pi";
import Link from "next/link";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import ModalExceeded from "@/components/modals/exceededModal";
// import ActionTooltip from "@/components/actions/ActionTooltip";
import SupportModal from "@/components/modals/suportModal";
import { IoArrowDown } from "react-icons/io5";
import { IoVolumeMedium, IoVolumeMute } from "react-icons/io5";

function formatTimeDifference(created_at: string): string {
  const createdAtDate = new Date(created_at);
  const currentDate = new Date();


  const timeDifference = currentDate.getTime() - createdAtDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  

  if (seconds < 60) {
    return "less than 1 hour";
  } else if (hours < 1) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (days < 1) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (weeks < 1) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
}


interface CV {
  file: string;
}

interface Resume {
  id: string;
  history: any[];
  linkedin_url: string;
  certification: any[];
  portfolio: any[];
  cvs: CV[];
  insights: string;
}

interface Qualification {
  status: string;
  motivation: string;
  output: string | null;
}

interface Interview {
  user: User;
  candidate: User;
  scheduled_datetime: string;
  transcription: string;
  summary: string;
  insights: string;
  inotes: string;
}

interface Reply {
  name: string;
  candidate: User;
  insights: string;
}

interface Question {
  job: string;
  question: string;
  reasoning: string;
  replies: Reply[];
  category: string;
}

interface Candidate {
  user: User;
  qualification: Qualification;
  resumes: Resume[];
  interviews: Interview[];
  questions: Question[];
}

interface Recommendation {
  candidate: Candidate;
  similarity: number;
}

interface HistoryItem {
  userMessage: string;
  response: string;
}
interface ConversationData {
  id: string;
  prompt: string;
  response: string;
}

interface ThreadData {
  id: string;
  conversations: ConversationData[];
}

interface Job {
  id: string;
  role: string;
  created_at: string;
}

type User = {
  id: any;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
};

type CompanyData = {
  name: string;
  website?: string;
  address?: string;
  city?: string;
};

const Petie = () => {
  
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});

  let [userMessage, setUserMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isSectionVisible, setIsSectionVisible] = useState(false); // Estado para controlar la visibilidad
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isArrowButtonDisabled, setIsArrowButtonDisabled] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const [showSections, setShowSections] = useState(false);
  const [isEventExcess, setIsEventExcess] = useState(false);
  const [isFirstEver, setIsFirstEver] = useState(false);
  // const [editedJob, setEditedJob] = useState<JobData | null>(null);
  const [isErrorFix, setIsErrorFix] = useState(false);
  // const [isMediaView, setIsMediaView] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [lastResponse, setLastResponse] = useState("");
  const [isArtifact, setIsArtifact] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);

  const chatContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Check if the flag is set in local storage
    const isFirstVisit = localStorage.getItem("isFirstVisit");

    if (!isFirstVisit) {
      // If it's the first visit, show the onboarding modal
      setIsFirstEver(true);

      // Set the flag in local storage to indicate that the user has visited
      localStorage.setItem("isFirstVisit", "true");
    }
  }, []);

  useEffect(() => {
    const redirectIfFromSpecificCountries = () => {
      const browserLanguage = navigator.language.toLowerCase();
      const country = getCountryFromLanguage(browserLanguage);
      const allowedCountries = ["in", "pk", "cn"]; // ISO 3166-1 alpha-2 country codes for India, Pakistan, and China

      // Check if the country is one of the allowed countries
      if (allowedCountries.includes(country)) {
        // Redirect to the specified URL for users from these countries
        window.location.href = "https://www.clous.app";
      }
    };

    redirectIfFromSpecificCountries();
  }, []);

  const getCountryFromLanguage = (language: string): string => {
    // Extract the country code from the language (e.g., 'en-US' -> 'us')
    return language.split('-')[1]?.toLowerCase() || '';
  };


// useEffect(() => {
//   const handleKeyDown = (event: KeyboardEvent) => {
//     if (event.metaKey && (event.key === "f" || event.key === "p" || event.key === "b" || event.key === "r")) {
//       // Your action when Cmd + F or Cmd + K is pressed
//       // For example, you can navigate to different pages
//       if (event.key === "f") {
//         window.location.href = "/feedback";
//       } else if (event.key === "p") {
//         window.location.href = "/";
//       } else if (event.key === "b") {
//         window.location.href = "/boards";
//       } else if (event.key === "r") {
//         window.location.href = "/research";
//       }
//     }
//   };

//   document.addEventListener("keydown", handleKeyDown);

//   return () => {
//     document.removeEventListener("keydown", handleKeyDown);
//   };
// }, []);

  useEffect(() => {
    // Función para mostrar la sección después de 750ms
    const timeout = setTimeout(() => {
      setShowSections(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, []); // Se ejecuta solo una vez al montar el componente


  const showWaitingCursor = () => {
    let isCursorVisible = true;
    const cursorInterval = setInterval(() => {
      setLastResponse(isCursorVisible ? '<span class="cursorRound"></span>' : '<span class="cursorNone"></span>');
      isCursorVisible = !isCursorVisible;
    }, 500); // Ajusta la velocidad del parpadeo aquí

    return () => clearInterval(cursorInterval);
  };
  const handleMuteVoice = () => {
    console.log("Clicked to mute voice");
  };

  useEffect(() => {
    // Check if user token exists in local storage
    const userToken = localStorage.getItem('userToken');
    console.log("Here's the user token:", userToken);
    if (!userToken) {
      // Initialize user token if it doesn't exist
      initializeUserToken();
    }
  }, []);

  const initializeUserToken = () => {
    // Generate a random user token
    const userToken = generateRandomToken();
    console.log("New user token created!", userToken);
    // Store the user token in local storage
    localStorage.setItem('userToken', userToken);
  };

  const generateRandomToken = () => {
    // Generate a random token using a library like `uuid` or a custom function
    // Example using `uuid`:
    const { v4: uuidv4 } = require('uuid');
    console.log("Here's the uuid", uuidv4)
    return uuidv4();
  };

  const isNewDay = (currentCreatedAt: any, nextCreatedAt: any) => {
    const currentDate = new Date(currentCreatedAt).toDateString();
    const nextDate = new Date(nextCreatedAt).toDateString();
    return currentDate !== nextDate;
  };

  const simulateTyping = (textToType: string) => {
    const decodeHTMLEntities = (text: any) => {
      const textArea = document.createElement('textarea');
      textArea.innerHTML = text;
      return textArea.value;
    };
  
    const words = decodeHTMLEntities(textToType).split(" ");
    let currentIndex = 0;
  
    const animateTyping = () => {
      if (currentIndex < words.length) {
        const partialText = words.slice(0, currentIndex + 1).join(" ");
        
        // Update the response with the partially typed text
        setLastResponse(
          partialText +
          '<span class="fade-in"></span>' +
          (currentIndex === words.length - 1 ? "" : '<span class="cursorRound ml-1"></span>')
        );
  
        currentIndex++;
        requestAnimationFrame(animateTyping);  // Use requestAnimationFrame for smoother updates
      } else {
        setIsTypingComplete(true);
        setIsArrowButtonDisabled(false);
      }
    };
  
    // Start the animation
    requestAnimationFrame(animateTyping);
    setIsTyping(false);
  };

  const stripHtmlTags = (html: string) => {
    if (typeof document === 'undefined') {
      // On the server-side, return the HTML without stripping tags
      return html;
    }
  
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };
  

  let cleanedResponse = stripHtmlTags(response);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [previousInputs, setPreviousInputs] = useState(""); 

  useEffect(() => {
    const handleVoiceMode = async () => {
      if (isVoiceMode) {
        try {
          await startRecording();
        } catch (error) {
          console.error('Error in voice mode:', error);
        }
      } else {
        stopRecording();
      }
    };
  
    handleVoiceMode();
  }, [isVoiceMode]);

  const handleAudioResponse = async (chatResponse: any) => {
    try {
      console.log('API response:', chatResponse);
      setLastResponse(chatResponse.response);
      setUserMessage(chatResponse.userResponse);

      // Update previous inputs with new Q&A
      setPreviousInputs(prev => 
        `${prev ? prev : ''}The previous response from the candidate:\n${chatResponse.userResponse}\n\nThe last AI response:\n${chatResponse.response}`
      );
  
      
      // simulateTyping(lastResponse);
      // setIsTyping(false);
      console.log(chatResponse.audioBlob.type);
      console.log("Here's the text response:", chatResponse.response);
  
      const audioUrl = URL.createObjectURL(chatResponse.audioBlob);
      console.log("Here's the audio url:", audioUrl);
      console.log('Audio Blob:', chatResponse.audioBlob);
      console.log('Blob Size:', chatResponse.audioBlob.size);
      console.log('Blob Type:', chatResponse.audioBlob.type);
  
      // Create a new Audio object and play

      // Create the audio URL and play it
      const audio = new Audio(audioUrl);
      await audio.play().catch(error => console.error('Audio playback error:', error));

      // Update audio reference for stopping if needed
      audioRef.current = audio;

      // Reset input fields
 
      // Restart recording after response ends
      audio.onended = () => {
        // Restart recording when AI response ends
        if (isVoiceMode) startRecording();
      };

      // Clean up the object URL after the audio has loaded
      audio.oncanplaythrough = () => URL.revokeObjectURL(audioUrl);


    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };

  const startRecording = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        let chunks: Blob[] = [];
        let silenceTimer: NodeJS.Timeout | null = null;
        const silenceThreshold = -22; // db
        const silenceDuration = 960; // ms
  
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
  
        const checkSilence = () => {
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);
  
          const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
          const dB = 20 * Math.log10(average / 255);

          setAudioLevel(Math.max(0, Math.min(1, (dB + 50) / 50))); // Normalize to 0-1 range
          console.log('Audio Level:', audioLevel);
 
          if (dB < silenceThreshold) {
            if (!silenceTimer) {
              silenceTimer = setTimeout(() => {
                console.log('Silence detected, stopping recording');
                mediaRecorder.stop();
              }, silenceDuration);
            }
          } else {
            if (silenceTimer) {
              clearTimeout(silenceTimer);
              silenceTimer = null;
            }
          }
        };
  
        const silenceInterval = setInterval(checkSilence, 80);
  
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
  
        mediaRecorder.onstop = async () => {
          clearInterval(silenceInterval);
          if (silenceTimer) clearTimeout(silenceTimer);
  
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          setAudioChunks([]);
          const formData = new FormData();
          formData.append('audio', audioBlob, 'audio.webm');
          formData.append('responses', previousInputs);
 
          try {
            console.log('Sending audio data to API...', formData);
            console.log('Here is the previous inputs:', formData.get('responses'));
            const chatResponse = await createRiverRequest(formData);
            console.log('API response:', chatResponse);
            console.log(chatResponse.audioBlob.type);

            await handleAudioResponse(chatResponse);
            // resolve(chatResponse);

          } catch (error) {
            console.error('Error processing audio:', error);
            reject(error);
          } finally {
            stream.getTracks().forEach(track => track.stop());
            audioContext.close();
          }
        };
  
        mediaRecorder.start();
        setIsRecording(true);
      }).catch(error => {
        console.error('Error accessing microphone:', error);
        reject(error);
      });
    });
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(error => console.error('Audio playback error:', error));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && (event.key === "i" || event.key === "p" || event.key === "b" || event.key === "r")) {
        // Your action when Cmd + F or Cmd + K is pressed
        // For example, you can navigate to different pages
        if (event.key === "i") {
          startRecording();
        }
      }
    };
  
    document.addEventListener("keydown", handleKeyDown);
  
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const stopAIResponse = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      startRecording();
    }
  };

  return (
    <main className="relative h-full w-full items-center justify-center  bg-[#FAFAFA] bg-pattern bg-gradient-to-br from-gray-50 to-gray-100">

    <head>
                 <title>Petie, 24/7 interview practice</title>
       
       <meta
         name="description"
         content="Built to help candidates practice real-world interviews with an AI."
       />
               <meta name="robots" content="index, follow" />
   <meta name='image' content='https://clous.s3.eu-west-3.amazonaws.com/images/Intelligent+Application+Clous.webp' />
       <meta property="og:url" content="https://www.clous.app" />
       <meta property="og:type" content="website" />
       <meta
         property="og:title"
         content="Petie, 24/7 interview practice"
       />
       <meta
         property="og:description"
         content="Built to help candidates practice real-world interviews with an AI."
       />
      <link rel="icon" type="image/x-icon" href="https://clous.s3.eu-west-3.amazonaws.com/favicon.ico" />
     </head>
     <div className="fixed flex gap-3 items-center justify-center lg:absolute top-2 lg:top-6 right-2 lg:right-6 bottom-5 lg:bottom-auto">
     <p
          onClick={() => handleMuteVoice()}
          className={`rounded-full max-h-[2rem] cursor-not-allowed flex items-center justify-center z-40 p-1 cursor-pointer min-h-[2rem] min-w-[2rem] lg:bottom-auto`}
        >
      {!isVoiceMuted ? (<IoVolumeMedium className="w-6 h-6 text-gray-foreground"/>) : (<IoVolumeMute className="w-6 h-6 text-primary"/>)}

        </p>
        <p
          onClick={() => {
            if (audioRef.current && !audioRef.current.paused) {
              stopAIResponse();
            } else {
              toggleVoiceMode();
            }
          }}
          className={`rounded-full max-h-[2rem] flex items-center justify-center z-40 text-secondary p-1 cursor-pointer min-h-[2rem] min-w-[2rem] ${isVoiceMode ? "bg-gray-foreground/10 text-gray-foreground" : "bg-primary"}`}
        >

            <PiWaveformBold className="w-4 h-4"/>
        </p>
     </div>

     <section className={`flex flex-col h-full w-full mx-auto my-auto  ${isFirstEver ? "overflow-hidden" : "lg:overflow-auto"} ${isArtifact ? "" : "lg:px-12"}`}>
          {isEventExcess && (<Dialog defaultOpen>
            <DialogTrigger asChild >
              
            </DialogTrigger>
            <DialogContent className="px-8 py-5 z-50">
              <ModalExceeded />
              {/* This Should be to Modal Exceeded with Additional Usage they claim if they input their email */}
            </DialogContent>
          </Dialog>)}
          <SupportModal />
          
      <section className={`relative pt-72 items-end lg:items-start flex flex-col z-40 gap-2  w-[90vw] lg:w-[52rem] transition-transform duration-300 ease-in-out mx-auto`}>
      
    <div className="relative h-full w-full mx-auto  max-w-[95vw] lg:max-w-[52rem]">
    <div
      className="absolute inset-0 rounded-3xl pointer-events-none w-[12rem] h-[12rem] mx-auto -translate-y-16"
      style={{
        background: `radial-gradient(circle, rgba(242,108,33, ${0.05 + audioLevel * 0.2}) ${audioLevel * 50 + 20}%, transparent ${audioLevel * 50 + 50}%)`,
        transition: 'background 0.1s ease-out',
      }}
    />
      <Textarea
        placeholder="Tap to start the interview..."
        className="h-auto min-h-12 max-h-24 border z-30 fixed top-auto bottom-auto mx-auto bg-[#FAFAFA] w-full max-w-[80vw] lg:max-w-[52rem] rounded-3xl overflow-hidden whitespace-normal pt-3.5 pl-4 pr-0 lg:pr-12 text-sm focus:border-orange focus:outline-primary cursor-pointer"
        value={userMessage}
        readOnly
        onClick={() => {
          if (audioRef.current && !audioRef.current.paused) {
            stopAIResponse();
          } else {
            toggleVoiceMode();
          }
        }}
        ref={textareaRef}
      />
        
        <p
          className={`rounded-full fixed lg:absolute right-6 lg:right-2 max-h-[2rem] flex items-center justify-center z-40 text-secondary p-1 cursor-pointer min-h-[2rem] min-w-[2rem] lg:top-2 bottom-5 lg:bottom-auto ${isVoiceMode ? "bg-gray-foreground/10 text-gray-foreground" : "bg-primary"}`}
        >

            <PiWaveformBold className="w-4 h-4"/>
        </p>
        </div>
        
        
      </section>

      {lastResponse && (
        <>
        
          <section className={`mt-16 text-center response relative z-10 bg-transparent rounded-lg w-[90vw] lg:w-[42rem] mx-auto`} ref={chatContainerRef} >
                  <div className="text-sm text-gray-foreground mt-3 leading-4 whitespace-pre-line w-[90vw] lg:w-[42rem]">
                    <div dangerouslySetInnerHTML={{ __html: lastResponse }}></div>
                  {/* {hiringData && hiringData.length > 0 && (
                  <div dangerouslySetInnerHTML={{ __html: dataResponse }} ref={lastUserMessageRef}></div>
                  )} */}
                </div>
        {isErrorFix && (
            <aside className={`rounded-2xl flex flex-col`}>
              <h2 className="text-center text-sm font-semibold text-[#333333]">There was an error with the response. Try again.</h2>
              <p className="text-base bg-primary text-secondary cursor-pointer hover:opacity-90 font-semibold py-1.5 px-4 rounded-full mx-auto mt-2" onClick={startRecording}>
                Retry
              </p>
              
              
            </aside>
          )}
           
          </section>
          {/* <div className="relative w-full z-10 h-[4rem] -mt-16 bg-gradient-to-t from-[#FAFAFA] to-transparent mx-auto px-36 w-[90vw] lg:w-[64rem]"></div> */}

        </>
      )}
     
    <aside className="fixed flex flex-col z-0 bottom-2 right-0 left-0 mx-auto text-gray-foreground font-medium text-xs">

      {showSections && (
        <div className="flex justify-center gap-4 mx-auto">
          <Link href="/getintouch" className="">Get in touch</Link>
          {/* <Link href="/library" className="">Library</Link> */}
          {/* <Link href="/feedback" className="">Feedback</Link> */}
          {/* <Link href="/resources" className="">Resources</Link> */}
          <Link target="_blank" href="https://www.clous.app/terms" className="">Terms of Use</Link>
      </div>
    
      )}       
            <p className="text-center hidden lg:flex no-underline mt-2 font-normal mx-auto">Petie can make mistakes. Always check important information.</p>

        </aside>


    </section>
    </main>

  );
};

export default Petie;
