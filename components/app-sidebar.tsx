'use client'

import { ChevronDown, ChevronRight } from "lucide-react"
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubItem,
} from "./ui/sidebar"
import Link from "next/link"
import { Button } from "./ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { useEffect, useState } from "react"
import axios from "axios"

export function AppSidebar({ userId }: { userId: string }) {
   const [chats, setChats] = useState([]);
   const [isOpen, setIsOpen] = useState(true);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      async function fetchChats() {
         try {
            // Fetch chats from API endpoint
            const response = await axios.get(`/api/chats?userId=${userId}`);
            if (response.status === 500 || response.status === 401){
               throw new Error('Failed to fetch chats');
            }
            setChats(response.data);
         } catch (error) {
            console.error("Error fetching chats:", error);
         } finally {
            setIsLoading(false);
         }
      }
      if (userId) {
         fetchChats();
      }
   }, [userId]);
   
   return (
      <Sidebar side="left" variant="inset">
         <SidebarHeader className="">
            <Link href={'/'} className="text-center">
               <p className='text-lg font-bold'>Manimorph</p>
            </Link>
            <Link href={"/"}>
               <Button className="w-full">
                  New chat
               </Button>
            </Link>
         </SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                        <SidebarMenuItem>
                           <CollapsibleTrigger className="flex w-full items-center justify-between">
                              <span>Your Chats</span>
                              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                           </CollapsibleTrigger>
                           <CollapsibleContent>
                              <SidebarMenuSub>
                                 {isLoading ? (
                                    <SidebarMenuSubItem>Loading chats...</SidebarMenuSubItem>
                                 ) : chats.length > 0 ? (
                                    chats.map((chat) => (
                                       <SidebarMenuSubItem key={chat.id}>
                                          <Link href={`/chat/${chat.id}`} className="w-full truncate block">
                                             <span>{chat.title || 'Untitled Chat'}</span>
                                          </Link>
                                       </SidebarMenuSubItem>
                                    ))
                                 ) : (
                                    <SidebarMenuSubItem>No chats found</SidebarMenuSubItem>
                                 )}
                              </SidebarMenuSub>
                           </CollapsibleContent>
                        </SidebarMenuItem>
                     </Collapsible>
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   )
}