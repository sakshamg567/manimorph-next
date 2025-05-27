'use client'
import { useRef, useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea'
import AnimationIcon from '@mui/icons-material/Animation';
import { useRouter } from 'next/navigation';
import { v4 } from 'uuid'
import { useSession } from 'next-auth/react'
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef(null)
  const { data: session, status } = useSession();
  const router = useRouter();

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate the new height
    textarea.style.height = 'auto';
    // Set the height to scrollHeight
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Submit on Enter key (but not with Shift+Enter for new line)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputText.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (status === 'unauthenticated' || !session) {
        router.push('/login');
        setIsSubmitting(false)
        return
      }
      // Create a chatId for this new conversation
      const chatId = v4();

      localStorage.setItem(`chat-${chatId}-initial`, inputText.trim());

      // Navigate to the chat page with the initial prompt and chatId
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error('Auth error : ', error);
      setIsSubmitting(false);
    }
  }
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
      <div className="absolute inset-0 rounded-md bg-[#0F0F10] border border-zinc-800 text-white font-geist overflow-hidden text-sm m-2 flex flex-col">
        {/* Header positioned correctly at the top */}
        <header className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <SidebarTrigger />
          </div>
          {/* You can add profile or other elements here if needed */}
        </header>

        <div className="flex-1 flex justify-center overflow-hidden py-20 px-2">
          <div className="w-full max-w-3xl flex flex-col h-full">
            <div className="flex-1 overflow-y-auto overflow-x-hidden mb-4 scrollbar-hide">
              <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 pt-32">
                What can I help you visualize?
              </h1>

              <form onSubmit={handleSubmit} className="w-full max-w-3xl">
                <div className="relative justify-center">
                  <Textarea
                    ref={textareaRef}
                    className="resize-none max-w-3xl w-full pr-16 overflow-auto max-h-72 border-zinc-800"
                    placeholder="Ask Manimorph to visualize..."
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !inputText.trim()}
                    className="absolute right-3 bottom-3 p-2 rounded-md disabled:bg-[#1F1F22] bg-white hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Submit"
                  >
                    <AnimationIcon className={`${isSubmitting || !inputText.trim()
                      ? 'text-white opacity-45'
                      : 'text-black'
                      }`} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}