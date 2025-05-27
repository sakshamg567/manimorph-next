import { UIMessage } from "ai"
import { Dispatch, SetStateAction } from "react"

interface ChatMessageProps {
   message: UIMessage;
   renderMessage: (content: string, role: string, setUiState?: Dispatch<SetStateAction<"code" | "video" | "chat">>, reasoning?: string | undefined, setCode?: Dispatch<SetStateAction<string | null>>) => React.JSX.Element;
   setUiState?: Dispatch<SetStateAction<"code" | "video" | "chat">>;
   setCode?: Dispatch<SetStateAction<string | null>>;
}

export const ChatMessage = ({ message, renderMessage, setUiState, setCode }: ChatMessageProps) => {
   return (
      <div className="whitespace-pre-wrap">
         {renderMessage(message.content, message.role, setUiState, message.reasoning, setCode)}
      </div>
   )
}