import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Text Summarizer | Bookchaowalit",
  description: "Extractive summary without an LLM API.",
  keywords: ["text-summarizer", "tool"],
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  metadataBase: new URL("https://bookchaowalit.com"),
  openGraph: {
    type: "website",
    title: "Text Summarizer | Bookchaowalit",
    description: "Extractive summary without an LLM API.",
    siteName: "Bookchaowalit",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
