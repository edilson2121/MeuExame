import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeuExame",
  description: "A sua plataforma completa de preparação para exames nacionais.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}