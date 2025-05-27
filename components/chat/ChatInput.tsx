import AnimationIcon from '@mui/icons-material/Animation'
import { Textarea } from '../ui/textarea'
import { ChatRequestOptions } from 'ai';
import { UIMessage } from 'ai'

export const ChatInput = ({ input, handleInputChange, handleSubmit, handleKeyDown, submitting, textareaRef, messages }: {
   input: string, handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void, handleSubmit: (event?: {
      preventDefault?: () => void;
   }, chatRequestOptions?: ChatRequestOptions) => void, handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void, submitting: boolean, textareaRef: React.RefObject<HTMLTextAreaElement>, messages: UIMessage[]
}) => {
   return (
      <div className="w-full">
         <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
               <Textarea
                  ref={textareaRef}
                  className="resize-none w-full pr-16 overflow-auto max-h-72 bg-[#1A1A1C] px-4 py-3 rounded-md"
                  placeholder={messages.length >= 1 ? "Ask a follow up.." : "Ask Manimorph.."}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={submitting}
               />
               <button
                  type="submit"
                  disabled={submitting || !input.trim()}
                  className="absolute right-3 bottom-3 p-2 rounded-md disabled:bg-[#1F1F22] bg-white hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Submit"
               >
                  <AnimationIcon className={`${submitting || !input.trim()
                     ? 'text-white opacity-45'
                     : 'text-black'
                     }`} />
               </button>
            </div>
         </form>
      </div>
   )
}