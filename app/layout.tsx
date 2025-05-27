import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
export const metadata = {
  title: "Manimorph",
  description: "Text to Manim visualizations",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`${GeistSans.className} dark`}>
      <body className="bg-[#0F0F10] text-white h-screen overflow-hidden">
        <SidebarProvider>
          <main className="fixed inset-0 flex flex-col">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}