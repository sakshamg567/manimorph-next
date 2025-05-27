'use client';

import { useCompletion } from '@ai-sdk/react';
import { useState } from 'react';

export function CodeGenerator({userRequest, breakdown, chatId}) {

   const [code, setCode] = useState('');


   const { completion, handleSubmit } = useCompletion({
      api: '/api/code',
      body: {
         userRequest: userRequest,
         breakdown: breakdown,
         chatId: chatId,
      },
      onFinish(message) {
         setCode(message);
      }
   })

   return (
      <div>
         <div>{code}</div>
      </div>
   )
}