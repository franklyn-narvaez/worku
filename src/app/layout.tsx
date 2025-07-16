import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SessionProviderClientComponent from "@/components/providers/sessionProvider";
import "./globals.css";
import SessionGuard from "@/components/SessionGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorkU",
  description: "Gestión de ofertas universitarias",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {!session && <Navbar />}
        <div className="flex">
          {session && <Sidebar />}
          <main className="flex-1 p-6 min-h-[calc(100vh-4rem)] overflow-auto">
            <SessionProviderClientComponent session={session}>
              <SessionGuard>
                {children}
              </SessionGuard>
            </SessionProviderClientComponent>
          </main>
        </div>
      </body>
    </html>
  );
}
