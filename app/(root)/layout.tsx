import { auth } from "@/auth";
import Modal from "@/components/login-modal";
import { AppSidebar } from "@/components/ui/app-sidebar";
import Navbar from "@/components/ui/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider} from "next-auth/react";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
   const session = await auth();
   return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#212121]">
         <SessionProvider>
         <SidebarProvider>
         <div className="flex flex-row flex-1">
            {session && session.user && (<AppSidebar userId={session.user.email as string} />)}
            <main className="relative w-full flex-1 rounded-lg">
               <div className="absolute inset-0 overflow-auto">
                  <Navbar/>
                  {children}
               </div>
            </main>
         </div>
         <Modal/>
      </SidebarProvider>
         </SessionProvider>
      </div>
   );
}