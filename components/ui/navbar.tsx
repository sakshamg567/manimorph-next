import React from 'react'
import { Button } from './button'
import { auth, signIn, signOut } from '@/auth'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu'
import { LogOut } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
const Navbar = async () => {

   const session = await auth();

   return (
      <header className=' bg-transparent text-white pt-2 px-2 bg-gradient-to-b from-[#121214] to-transparent'>
         <nav className='flex flex-row place-content-end max-h-8'>
            {session && session?.user ? (
               <>
                  <div>
                  <DropdownMenu>
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                                 <Image
                                    src={session.user.image}
                                    alt="profile"
                                    width={30}
                                    height={30}
                                    className="rounded-full cursor-pointer"
                                 />
                              </DropdownMenuTrigger>
                           </TooltipTrigger>
                           <TooltipContent side='right'>
                              <span>Profile</span>
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>

                     <DropdownMenuContent className='border-0 w-52'>
                        <DropdownMenuItem className=''>
                           <span className='text-xs'>{session.user.email}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem >
                           <form action={async () => {
                              "use server";
                              await signOut({ redirectTo: "/" });
                           }}>
                              <Button>
                                 <LogOut />
                                 <span>Log out</span>
                              </Button>

                           </form>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
                  </div>   
               </>

            ) : (
               <div className='flex flex-row'>
                  <form action={async () => {
                     "use server";

                     await signIn("google");
                  }}>
                     <Button type='submit' className='bg-white text-black hover:bg-zinc-200 h-7 rounded-sm'>
                        Sign In
                     </Button>
                  </form>
               </div>

            )}
         </nav>
      </header>
   )
}

export default Navbar
