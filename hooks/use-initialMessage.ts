import { UIMessage } from "ai";
import { useEffect, useState } from "react";

export const useInitialMessage = (chatId: string, messages: UIMessage[], handleInputChange: any, handleSubmit: any, setSubmitting: (submitting: boolean) => void) => {

   const [initialPromptSent, setInitialPromptSent] = useState<boolean>(false);

   useEffect(() => {
      if (chatId && !initialPromptSent) {
         const initialMessage = localStorage.getItem(`chat-${chatId}-initial`);
         if (initialMessage && messages.length === 0) {
            // Set input and then trigger submit
            handleInputChange({ target: { value: initialMessage } });
            setTimeout(() => {
               // Using setTimeout to ensure state is updated
               handleSubmit(new Event('submit') as any);
               setSubmitting(true);
               setInitialPromptSent(true);
               localStorage.removeItem(`chat-${chatId}-initial`);
            }, 100);
         }
      }
   }, [chatId, messages, handleInputChange, handleSubmit, initialPromptSent, setSubmitting]);
}