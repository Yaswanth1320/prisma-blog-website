import type { Metadata } from "next";
import { Architects_Daughter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Provider from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

// Initialize the Architects Daughter font
// Note: This font only has one weight (400) available
const architectsDaughter = Architects_Daughter({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-architects-daughter",
});

export const metadata: Metadata = {
  title: "Blogs",
  description: "A platform to share blogs and learn from each other",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${architectsDaughter.className}`}>
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Toaster
              toastOptions={{
                classNames: {
                  toast: `${architectsDaughter.className} font-normal`,
                  description: `${architectsDaughter.className}`,
                  actionButton: `${architectsDaughter.className}`,
                  cancelButton: `${architectsDaughter.className}`,
                },
              }}
            />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
