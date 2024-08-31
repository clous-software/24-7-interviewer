"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Textarea from 'react-expanding-textarea';
import { createRiverRequest } from "@/app/api/ai/route";
// import { getAudioVoice } from "@/app/api/ai/route";
import { useRouter } from "next/navigation";
import { PiWaveformBold, PiWaveform } from "react-icons/pi";
import Link from "next/link";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import ModalExceeded from "@/components/modals/exceededModal";
// import ActionTooltip from "@/components/actions/ActionTooltip";
import SupportModal from "@/components/modals/suportModal";
import { IoArrowDown } from "react-icons/io5";

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

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const [threadData, setThreadData] = useState<{ [key: string]: ConversationData[] }>({});

  
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});

  let [userMessage, setUserMessage] = useState("");
  let [userThreadMessage, setUserThreadMessage] = useState("");
  const [response, setResponse] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [chatOpened, setChatOpened] = useState(false);
  const router = useRouter();
  const [isSectionVisible, setIsSectionVisible] = useState(false); // Estado para controlar la visibilidad
  const [shouldGenerate, setShouldGenerate] = useState(true);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isFirstTypingComplete, setIsFirstTypingComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [isArrowButtonDisabled, setIsArrowButtonDisabled] = useState(true);
  const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const [showSections, setShowSections] = useState(false);
  const [responses, setResponses] = useState<HistoryItem[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [stopTyping, setStopTyping] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isEventExcess, setIsEventExcess] = useState(false);
  const [isFirstEver, setIsFirstEver] = useState(false);
  const [isAuthRequired, setIsAuthRequired] = useState(false);
  const [isExcessFeedback, setIsExcessFeedback] = useState(false);
  const [isExcessFeedbackReplied, setIsExcessFeedbackReplied] = useState(false);
  const [isPMFFeedbackReplied, setIsPMFFeedbackReplied] = useState(false);
  const [isPMFFeedback, setIsPMFFeedback] = useState(false);
  // const [isPersonaSaved, setPersonaSaved] = useState(false);
  // const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  // const [isReportSaved, setReportSaved] = useState(false);
  // const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPlanSaved, setPlanSaved] = useState(false);
  const [isPlan, setIsPlan] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(false);
  // const [editedJob, setEditedJob] = useState<JobData | null>(null);
  const [isErrorFix, setIsErrorFix] = useState(false);
  // const [isMediaView, setIsMediaView] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isNotificationsMode, setIsNotificationsMode] = useState(false);
  const [isFormattedResponse, setIsFormattedResponse] = useState(false);
  const [isAuthToken, setIsAuthToken] = useState(false);
  const [jobData, setJobData] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(undefined);
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | undefined>(undefined);
  const [lastResponse, setLastResponse] = useState("");
  const [streamingResponse, setStreamingResponse] = useState(null);
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [isThreadActive, setIsThreadActive] = useState(false);
  const [isConversationReload, setIsConversationReload] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [teamMentions, setTeamMentions] = useState([]);
  const [isDataGeneration, setIsDataGeneration] = useState(false);
  const [candidateData, setCandidateData] = useState([]);
  const [feedback, setFeedback] = useState(true);
  const [isAssistance, setIsAssistance] = useState(true); // used for pre-defined prompts and 'smart actions'

  const [showArrow, setShowArrow] = useState(false);
  const [isArtifact, setIsArtifact] = useState(false);
  const [isHubMode, setIsHubMode] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  const chatContainerRef = useRef<HTMLElement | null>(null);
  const lastUserMessageRef = useRef<HTMLElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<string>('12vh');
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastScrollTop = useRef(0);

  const [isCandidateSearch, setIsCandidateSearch] = useState(false);
  const [isJobSearch, setIsJobSearch] = useState(false);
  const [isJobIdOpen, setIsJobIdOpen] = useState(false);
  const [isCandidateIdOpen, setIsCandidateIdOpen] = useState(false);

  const [resetTime, setResetTime] = useState('');

  const [initialUserResponse, setInitialUserResponse] = useState("");
  const [isInitialUserResponse, setIsInitialUserResponse] = useState(false);

  const [isCandidateSearchOpen, setIsCandidateSearchOpen] = useState(false);

  // useEffect(() => {
  //   if (chatHistory.length > 0) {
  //     setLastResponse(chatHistory[chatHistory.length - 1]);
  //   }
  // }, [chatHistory]);

  // const handleUserMentionClick = (user) => {
  //   const newMessage = userMessage.replace(/@\w*$/, `@${user.user.name}`);
  //   setUserMessage(newMessage);
  //   setShowSuggestions(false);
  // };

  const toggleReplies = (questionId: string) => {
    setShowReplies((prevState) => ({
      ...prevState,
      [questionId]: !prevState[questionId],
    }));
  };

  function getOnboardingData() {
    const data = localStorage.getItem('onboardingData');
    return data ? JSON.parse(data) : null;
  }
  
  function constructAIPrompt() {
    const onboardingData = getOnboardingData();
    
    if (!onboardingData) {
      return "No onboarding data available.";
    }
  
    const { role, careerPriority, learningPriority } = onboardingData;
  
    let prompt = `I am currently a ${role || 'professional'}`;
  
    if (careerPriority) {
      prompt += ` looking to ${careerPriority.toLowerCase()}`;
    }
  
    if (learningPriority) {
      prompt += `. I'm interested in improving my ${learningPriority.toLowerCase()}`;
    }
  
    prompt += `. Can you provide tailored advice and resources for my career development?`;
  
    return prompt;
  }

  

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log("the auth token in refresh is:", refreshToken);
    if (refreshToken) {
      setIsAuthToken(true);
    }
  
  }, []);

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

const handleCandidateSearch = () => {
  setIsHubMode(true);
  setIsCandidateSearch(true);
};

useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey && (event.key === "f" || event.key === "p" || event.key === "b" || event.key === "r")) {
      // Your action when Cmd + F or Cmd + K is pressed
      // For example, you can navigate to different pages
      if (event.key === "f") {
        window.location.href = "/feedback";
      } else if (event.key === "p") {
        window.location.href = "/";
      } else if (event.key === "b") {
        window.location.href = "/boards";
      } else if (event.key === "r") {
        window.location.href = "/research";
      }
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, []);

  const formatResponseText = (response: string) => {
    console.log("Here's the response of the role:", response);
    const candidateIdMatch = response.match(/candidateId:\s*([^\s>]+)/);
    if (candidateIdMatch) {
      const candidateId = candidateIdMatch[1];
      setSelectedCandidateId(candidateId);
      setIsCandidateIdOpen(true);
    }

    // Regex to match < search candidates >
    const searchCandidatesMatch = response.match(/<\s*search candidates\s*>/i);
    if (searchCandidatesMatch) {
      handleCandidateSearch();
      setIsCandidateSearchOpen(true);
    }

    if (response.trim().substring(0, 4).toLowerCase() === "role") {
         // Remove content between "Title:" and "Share:"

         // Remove content between "Share:" and "Salary:"
         const withoutTitleToSalary = response.replace(/Title:.*?USD/s, '');
 
         // Remove "Description"
         const withoutDescription = withoutTitleToSalary.replace(/Description:/g, '\n');
 
         // Replace "Role:" with "###"
         const roleFormatted = withoutDescription.replace(/^Role:/, '###');

          // Replace other titles with bold formatting
          const formattedWithBold = roleFormatted.replace(/^(\w+):/gm, '**$1**');

        // Add line breaks after each section
        const finalText = formattedWithBold.replace(/(\n\n)(\s*-\s)/g, '\n$2');

        console.log("This is the first formatting!", finalText);

        return finalText;
    } else {
        let formattedResponse = response;

        formattedResponse = response.replace(/### Subject:/, '###');

        formattedResponse = formattedResponse.replace(
            /(^|[^#])#+ (.*?)(?=\n#+|$)/gm,
            (match: string, p1: string, p2: string) => {
                console.log("Match:", match);
                console.log("Heading level:", p1.length);
                console.log("Heading text:", p2);
                let headerLevel: string;
                switch (p1.length) {
                    case 1:
                        headerLevel = "1rem";
                        break;
                    case 2:
                        headerLevel = "1.125rem";
                        break;
                    case 3:
                        headerLevel = "1.25rem";
                        break;
                    case 4:
                        headerLevel = "1.5rem";
                        break;
                    default:
                        headerLevel = "1.5rem";
                }
                return `<strong style="font-size: ${headerLevel};">${p2}</strong>`;
            });
            // .replace(
        //   /\*\*(.*?)\*\*/gm,
        //   '<strong style="font-size: 1rem;">$1</strong>'
        // );
            
        // Format bold and italic text
        formattedResponse = formattedResponse.replace(
          /\*\*\*(.*?)\*\*\*/gm,
          '<br/><strong style="font-size: 1rem; font-style: italic;">$1</strong>'
        ).replace(
          /(^|\n)(?!(?:\d+\.\s))\*\*(.*?)\*\*/gm, 
          '<br/><strong>$2</strong>'
        ).replace(
          /(\d+\.\s)\*\*(.*?)\*\*/gm, 
          '$1<strong>$2</strong>'
        ).replace(
          /(^|\n)\*\*(.*?)\*\*/gm, 
          '<br/><strong>$2</strong>'
        ).replace(
          /^(\d+)/gm,
          '<br/>$1'
        ).replace(
          /([^\n])\*\*(.*?)\*\*/gm,
          '$1<strong>$2</strong>'
        );

        // Format sentences starting with "-"
        formattedResponse = formattedResponse.replace(
          /(\n|^)([-*]) (.*?)(?=\n[-*] |$)/gm,
          (match: string, p1: string, p2: string, p3: string) => {
            // Replace the "-" or "* " with a bullet point
            const bulletPoint = '&bull;';
            // Add a line break after each bullet point
            return `<li>${p3}</li>`;
          }
        );

        // Format tables
        formattedResponse = formattedResponse.replace(
            /((?:\|.*?\|)(?:\n\|.*?\|)+)/gm,
            (match: string) => {
                let tableContent = match.replace(/\|/g, '</td><td>').replace(/\n/g, '</td></tr><tr>').replace(/<\/td><td>$/, '');
                return `<table><tr>${tableContent}</tr></table>`;
            }
        );

        setIsFormattedResponse(true);

        return formattedResponse;
      }
    // Remove "Subject:" from lines starting with "###"

};



  useEffect(() => {
    if (shouldGenerate) {
      setShouldGenerate(false); // Restablece el indicador
      // Realiza la lógica de generación de texto aquí
      handleGenerateClick();
    }
  }, [shouldGenerate]);

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

  const handleGenerateClick = async () => {
    if (isArrowButtonDisabled) return;
    localStorage.removeItem('threadId');
    setIsNotificationsMode(false);
    setIsErrorFix(false);
    setIsPlan(false);
    setShowMore(false);
    setShowCTA(false);
    setShowSections(false);
    setIsTyping(true);
    setIsWaitingForResponse(true);
    const stopWaitingCursor = showWaitingCursor();

    const currentTimestamp = new Date().getTime();
  
    // Get stored click count and last click timestamp from session storage
    let storedClickCount: number = parseInt(sessionStorage.getItem('clickCount') || '0');
    let lastClickTimestamp: number = parseInt(sessionStorage.getItem('lastClickTimestamp') || '0');
    let isPMFFeedbackReplied: boolean = sessionStorage.getItem('isPMFFeedbackReplied') === 'true';
    let isExcessFeedbackReplied: boolean = sessionStorage.getItem('isExcessFeedbackReplied') === 'true';
    let nextResetTime = parseInt(sessionStorage.getItem('nextResetTime') || '0');

    // If stored values are null, initialize them
    if (!storedClickCount || !lastClickTimestamp) {
      storedClickCount = 0;
      lastClickTimestamp = currentTimestamp;
      nextResetTime = currentTimestamp + 6 * 60 * 60 * 1000; // 6 hours from now
    }
  
    // Check if it's been more than an hour since the last click
    const sixHours = 6 * 60 * 60 * 1000;

    // Check if it's been more than 6 hours since the last click
    if (currentTimestamp - lastClickTimestamp >= sixHours) {
    // Reset the click count for a new 6-hour period
    storedClickCount = 0;
    lastClickTimestamp = currentTimestamp;
    }

    // Increment the click count
    storedClickCount++;

    if (currentTimestamp >= nextResetTime) {
      // Reset the click count for a new 6-hour period
      storedClickCount = 0;
      lastClickTimestamp = currentTimestamp;
      nextResetTime = currentTimestamp + sixHours; // Set the next reset time
    }

    if (storedClickCount > 3) {
    // Only if AuthToken is none!
    setIsAuthRequired(true);
    console.log("You have exceeded the limit of 3 clicks per 6 hours.");
    
    }

    // Check if the click count exceeds the limit for an hour (111 clicks per hour)
    if (storedClickCount > 12) {
    // Display a message or disable the button to indicate the limit is exceeded
    setIsEventExcess(false);
    console.log("You have exceeded the limit of 111 clicks per hour.");
    }

    // Check if it's been more than a week since the last click
    if (currentTimestamp - lastClickTimestamp >= 7 * 24 * 60 * 60 * 1000) {
      // Reset the click count for a new week
      storedClickCount = 0;
      lastClickTimestamp = currentTimestamp;
    }

    // Update session storage with the new click count and timestamp
    sessionStorage.setItem('clickCount', storedClickCount.toString());
    sessionStorage.setItem('lastClickTimestamp', lastClickTimestamp.toString());
    sessionStorage.setItem('isPMFFeedbackReplied', isPMFFeedbackReplied.toString());
    sessionStorage.setItem('isExcessFeedbackReplied', isExcessFeedbackReplied.toString());
    sessionStorage.setItem('nextResetTime', nextResetTime.toString());
 
    console.log("Here's the userThreadMessage",userThreadMessage)
    let reFormattedResponse = "";
    let newResponse = "";

    try {
      userMessage = userMessage;
      // if (isAuthRequired && !isAuthToken) {
      //    return;
      // }
      const chatResponse = await createRiverRequest(userMessage);
      setUserMessage("");
      setLastResponse(chatResponse.response);
      // if (chatResponse.response_candidate) {
      //   setCandidateData(chatResponse.response_candidate);
      // }
      
      localStorage.setItem('chatResponse', chatResponse.response);
      newResponse = formatResponseText(chatResponse.response);
      reFormattedResponse = formatResponseText(newResponse);

        setIsFormattedResponse(false);
        console.log("This is the chat response:", chatResponse);
        console.log("This is the new response:", newResponse);
        console.log("This is the reformatted response:", reFormattedResponse);
        setResponses((prevResponses) => [
          ...prevResponses,
          { userMessage, response: chatResponse.response },
        ]);

      
    } catch (error) {
      console.error(error);
      console.log("Here's the chatResponse", response);
      setIsErrorFix(true);
      
    } finally {
      stopWaitingCursor();
      setIsWaitingForResponse(false);
      
    }
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
  
  
  const handleClick = (cardTitle: string) => {
    setUserMessage(cardTitle);
    setShouldGenerate(true); // Activa la generación automática
    setIsArrowButtonDisabled(false); // Habilita manualmente el botón de enviar
  };

  const handleReset = () => {
    try {
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };


  const handleStopClick = () => {
    router.push(`https://petie.clous.app`);
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
      setUserMessage("");
      setLastResponse(chatResponse.response);

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
      const audio = new Audio(audioUrl);
      await audio.play().catch(error => console.error('Audio playback error:', error));

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
  
          try {
            console.log('Sending audio data to API...');
            const chatResponse = await createRiverRequest(formData);
            console.log('API response:', chatResponse);
            setUserMessage("");
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
    <main className="relative h-full w-full items-center justify-center">
    <head>
                 <title>Petie, 24/7 interview assistant</title>
       
       <meta
         name="description"
         content="Built for hiring teams, with industry knowledge to assist in daily tasks. Clous Peer is the latest AI model released by the Clous team."
       />
               <meta name="robots" content="index, follow" />
   <meta name='image' content='https://clous.s3.eu-west-3.amazonaws.com/images/Intelligent+Application+Clous.webp' />
       <meta property="og:url" content="https://www.clous.app" />
       <meta property="og:type" content="website" />
       <meta
         property="og:title"
         content="Peer, your hiring AI"
       />
       <meta
         property="og:description"
         content="Built for hiring teams, with industry knowledge to assist in daily tasks. Clous Peer is the latest AI model released by the Clous team."
       />
      </head>
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
              <p className="text-base bg-primary text-secondary cursor-pointer hover:opacity-90 font-semibold py-1.5 px-4 rounded-full mx-auto mt-2" onClick={handleGenerateClick}>
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
