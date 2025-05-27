'use client'

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import React from 'react'

const LoginPage = () => {
   const handleSignIn = () => {
      signIn("google", { callbackUrl: '/' });
   };

   return (
      <div className='h-screen w-screen flex items-center justify-center'>
         <div className='flex flex-col'>
            <h1 className='text-2xl mb-10'>To use manimorph, please sign in with google</h1>
            <Button 
               onClick={handleSignIn} 
               className='bg-white text-black hover:bg-zinc-200 h-10 rounded-sm'
            >
               Sign In
            </Button>
         </div>
      </div>
   )
}

export default LoginPage