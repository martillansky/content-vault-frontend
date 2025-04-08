import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { headers } from "next/headers";
import ContextProvider from "./context";

export const metadata: Metadata = {
  title: "AppKit Example App",
  description: "Powered by WalletConnect",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookies = headersList.get("cookie");

  return (
    <html lang="en">
      <body>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
