import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Latihan Soal ASAJ",
  description: "Aplikasi latihan soal untuk murid SDN 01 KALISALAK",
  icons: {
    icon: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Shield_of_Tegal_Regency.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
