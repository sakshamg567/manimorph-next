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
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Button } from "./button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
import { useEffect, useState } from "react"

export function AppSidebar({ userId }: {userId: string}) {
   type Chat = { id: string; title?: string };
   const [chats, setChats] = useState<Chat[]>([]);
   const [isOpen, setIsOpen] = useState(true);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      async function fetchChats() {
         try {
            const response = await fetch(`/api/chats?userId=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch chats');
            const data = await response.json();
            setChats(data);
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
      <Sidebar side="left" variant="sidebar" className="">
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