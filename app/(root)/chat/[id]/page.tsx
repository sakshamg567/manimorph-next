'use client';

import { Editor } from '@monaco-editor/react';
import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { LoadingMessage } from '@/components/chat/LoadingMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChatHistory } from '@/hooks/use-chatHistory';
import { useInitialMessage } from '@/hooks/use-initialMessage';
import { VideoPreview } from '@/components/chat/VideoPreview';
import RenderMessage from '@/lib/utils/renderMessage';
import {MoonLoader} from 'react-spinners'
import { useVideoSSE } from '@/hooks/use-videoSSE';
import axios from 'axios';


export default function Chat() {
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const params = useParams();
   const [uiState, setUiState] = useState<"code" | "video" | "chat">("chat");
   const [submitting, setSubmitting] = useState(false);
   const [code, setCode] = useState<string | null>(null);
   const [currentJobId, setCurrentJobId] = useState<string | null>(null);
   const {status: jobStatus, videoUrl, error, isConnected} = useVideoSSE(currentJobId)

   const { initialMessages } = useChatHistory();

   const { messages, input, handleInputChange, handleSubmit, status } = useChat({
      id: `${params.id}`,
      initialMessages: initialMessages,
      onFinish() {
         setSubmitting(false);
      }
   });

   const handleGenerateVideo = async() => {
      if(code) {
         const response = await axios.post('/api/video', {code: code.replace(/```python\s*/g, '').replace(/```/g, '')
         });         
         setCurrentJobId(response.data.jobId);
      }
   }


   // Use useEffect to submit the initial message after component mounts
   useInitialMessage(params.id as string, messages, handleInputChange, handleSubmit, setSubmitting);

   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Enter key (but not with Shift+Enter for new line)
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(e);
         setSubmitting(true);
      }
   };

   const autoResize = () => {
      const textarea: HTMLTextAreaElement | null = textareaRef.current;
      if (!textarea) return;

      // Reset height to calculate the new height
      textarea.style.height = 'auto';
      // Set the height to scrollHeight
      textarea.style.height = `${textarea.scrollHeight}px`;
   };

   useEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const handleInput = () => {
         autoResize();
      };

      textarea.addEventListener('input', handleInput);
      autoResize();

      return () => {
         textarea.removeEventListener('input', handleInput);
      };
   }, []);

   return (
      <>
         <div className={`absolute inset-0 rounded-md w-full bg-black text-white flex justify-center overflow-hidden text-sm py-8 px-2 transition-all duration-1000`}>
            <div className={`transition-all duration-1000 max-w-3xl flex flex-col h-full ${uiState === "code" || uiState === "video" ? 'w-1/3' : 'w-full'}`}>
               <div className="flex-1 overflow-y-auto overflow-x-hidden mb-4 scrollbar-hide">
                  {messages.map(message => (
                     <ChatMessage
                        key={message.id}
                        message={message}
                        renderMessage={RenderMessage}
                        setUiState={setUiState}
                        setCode={setCode}
                     />
                  ))}
                  {status !== "ready" && (<LoadingMessage />)}
               </div>
               <ChatInput
                  input={input}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  handleKeyDown={handleKeyDown}
                  submitting={submitting}
                  textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
                  messages={messages}
               />
            </div>
            {uiState !== "chat" && (

               <div className="w-2/3 aspect-video mx-2 h-full">
                  <div className="bg-[#121214] border border-[#2A2A2C] rounded-lg p-4 shadow-lg animate-fadeIn transition-all duration-1000 h-full">
                     {uiState === 'code' && (
                        <>
                           <div className="whitespace-pre-wrap overflow-wrap-anywhere">
                              <Editor
                                 value={code?.replace(/```python\s*/g, '').replace(/```/g, '')
                                    || ""}
                                 language="python"
                                 theme="vs-dark"
                                 options={{
                                    minimap: { enabled: true },
                                    wordWrap: 'on',
                                    readOnly: true,
                                    cursorBlinking: 'smooth',
                                    scrollBeyondLastLine: false
                                 }}
                                 height="70vh"
                                 width="100"
                              />
                           </div>
                           <Button
                              className="w-full mt-4"
                              onClick={() => {
                                 handleGenerateVideo() 
                                 setUiState('video')
                              }}
                           >
                              {isConnected ? `${MoonLoader({loading: true})} ` : "Generate video"}
                           </Button>
                        </>
                     )}
                     {uiState === 'video' && currentJobId && (
                        <VideoPreview
                           status={jobStatus}
                           videoUrl={videoUrl}
                           error={error}
                           isConnected={isConnected}
                           jobId={currentJobId}
                        />
                     )}
                  </div>
               </div>
            )}
         </div>
      </>
   );
}