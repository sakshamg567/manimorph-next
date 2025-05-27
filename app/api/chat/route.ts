import { google } from '@ai-sdk/google'
import { smoothStream, streamText } from 'ai'
import { ANALYSER_SYSTEM_PROMPT } from '@/config'
// import { auth } from '@/auth';

export const POST = async(req: Request) => {
   
   // if no session, return 401 forbidden
   // if(!req.auth) {
      // return new Response(`Unauthorized`, {status: 401});
   // }
   
   const { messages } = await req.json();

   const response = streamText({
      model: google('gemini-2.5-pro-preview-05-06'),
      messages,
      providerOptions: {
         google: {
            thinkingConfig: {
               includeThoughts: true,
            },
         },
      },
      system: ANALYSER_SYSTEM_PROMPT,
      experimental_transform: smoothStream(),
   })
   return response.toDataStreamResponse({
      sendReasoning: true
   });
};


