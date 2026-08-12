import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { CartDrawer } from "@/components/sections/cart-drawer";
import { AppStoreProvider } from "@/store/app-store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const themeScript = `
  (function () {
    try {
      const savedTheme = localStorage.getItem("luma-theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldUseDark = savedTheme ? savedTheme === "dark" : systemPrefersDark;
      document.documentElement.classList.toggle("dark", shouldUseDark);
      document.documentElement.style.colorScheme = shouldUseDark ? "dark" : "light";
    } catch (error) {
      console.error(error);
    }
  })();
`;

export const metadata: Metadata = {
  title: "KTU E-bookshop | Tertiary Education E-Books",
  description: "Your premier online bookshop for tertiary education e-books in Ghana. Quality reading materials for university students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_30%),linear-gradient(180deg,#f8fafc,white_35%,#f5f3ff)] text-zinc-950 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),transparent_30%),linear-gradient(180deg,#020617,#0f172a_35%,#111827)] dark:text-white">
        <AppStoreProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CartDrawer />
        </AppStoreProvider>
      </body>
    </html>
  );
}
