import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import Script from "next/script";
import clsx from "clsx";



import { siteConfig } from "@/config/site";



export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/logo.png",
  },
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@muftipay",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <Script
          defer
          src="http://umami-huoyjim34sag3814eqsuen28.72.61.201.50.sslip.io/script.js"
          data-website-id="2a046a95-ddcc-4e9a-ae19-58dd5788a8fe"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={clsx(

        )}
      >


        {children}

      </body>
    </html>
  );
}
