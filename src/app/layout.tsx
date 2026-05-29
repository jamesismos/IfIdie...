import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "If I Die - continuidade digital criptografada",
  description:
    "SaaS open source para check-ins, cofres cifrados client-side e entrega gradual de instrucoes privadas.",
  applicationName: "If I Die",
  keywords: [
    "continuidade digital",
    "dead man switch",
    "legacy vault",
    "criptografia client-side",
    "zero knowledge",
    "open source",
  ],
  metadataBase: new URL("https://ifidie.dev"),
  openGraph: {
    title: "If I Die",
    description:
      "Orquestrador open source de continuidade digital com cofre criptografado no cliente.",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3090285265842642"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
