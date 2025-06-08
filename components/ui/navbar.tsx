"use client"
import React from 'react'
import { Button } from './button'
import { signIn, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './dropdown-menu'
import { LogOut } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'
import { SidebarTrigger, useSidebar } from './sidebar'

const Navbar = () => {
   const {state} = useSidebar();
   const { data: session } = useSession();

   return (
      <header className='bg-transparent text-white px-4 pt-4 pb-2 z-50 relative pointer-events-auto border-b'>
         <nav className='flex flex-row justify-between items-center h-8 pointer-events-auto'>
            {session && session?.user ? (
               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <SidebarTrigger />

                     </TooltipTrigger>
                     <TooltipContent>
                        <span>{state === 'collapsed' ? 'Open sidebar' : 'Close sidebar'}</span>
                     </TooltipContent>
                  </Tooltip>

                  <div className="pointer-events-auto">
                     <DropdownMenu>
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                                 <Image
                                    src={session.user.image as string}
                                    alt="profile"
                                    width={30}
                                    height={30}
                                    className="rounded-full cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                                 />
                              </DropdownMenuTrigger>
                           </TooltipTrigger>
                           <TooltipContent side='bottom'>
                              <span>Profile</span>
                           </TooltipContent>
                        </Tooltip>

                        <DropdownMenuContent className='border-0 w-52 z-50'>
                           <DropdownMenuItem>
                              <span className='text-xs'>{session.user.email}</span>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem>
                              <Button
                                 onClick={() => signOut({ callbackUrl: "/" })}
                                 variant="ghost"
                                 size="sm"
                                 className="w-full justify-start p-0 h-auto"
                              >
                                 <LogOut className="mr-2 h-4 w-4" />
                                 <span>Log out</span>
                              </Button>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               </TooltipProvider>
            ) : (
               <div className='flex flex-row pointer-events-auto'>
                  <Button
                     onClick={() => signIn("google")}
                     className='bg-white text-black hover:bg-zinc-200 h-7 rounded-sm'
                  >
                     Sign In
                  </Button>
               </div>
            )}
         </nav>
      </header>
   )
}

export default Navbar