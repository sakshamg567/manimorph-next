import { UIMessage } from "ai";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"

export const useChatHistory = () => {
   const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);

   const params = useParams();

   useEffect(() => {
      const fetchChatHistory = async () => {
         try {
            const response = await fetch(`/api/chat/${params.id}`);
            if (response.ok) {
               const chatHistory = await response.json();
               if (chatHistory.length) {
                  setInitialMessages(chatHistory);
               }
            }
         } catch (error) {
            console.error('Error fetching chat history:', error);
         } finally {
         }
      };

      if (params.id) {
         fetchChatHistory();
      }
   }, [params.id]);

   return {
      initialMessages,
   }
}

