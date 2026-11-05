import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { AppIntro } from "@/components/AppIntro";
import "./globals.css";
import "./proximus-os.css";

const themeInitializer = `
  (function () {
    try {
      var savedTheme = window.localStorage.getItem("ps-theme");
      var preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
      document.documentElement.dataset.theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : preferredTheme;
    } catch (error) {
      document.documentElement.dataset.theme = "dark";
    }
    try {
      document.documentElement.dataset.psBoot =
        new URLSearchParams(window.location.search).get("intro") !== "replay" &&
        window.sessionStorage.getItem("ps-os-boot") === "seen" ? "skip" : "play";
    } catch (error) {
      document.documentElement.dataset.psBoot = "play";
    }
    try {
      document.documentElement.dataset.psWorkspace =
        window.sessionStorage.getItem("ps-workspace-unlocked") === "true"
          ? "unlocked"
          : "locked";
    } catch (error) {
      document.documentElement.dataset.psWorkspace = "locked";
    }
  })();
`;

const homeScrollInitializer = `
  (function () {
    function resetHomeScroll() {
      if (window.location.pathname !== "/") {
        return;
      }

      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    resetHomeScroll();

    window.addEventListener("pageshow", function () {
      window.requestAnimationFrame(resetHomeScroll);
    });
  })();
`;

const geistSans = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  display: "swap",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://proximus-shev-portfolio.vercel.app"),
  title: "John Amoako Appiah | Proximus Shev",
  description:
    "Explore the interactive portfolio of John Amoako Appiah. Discover frontend, full-stack, Python, and AI projects, skills, and contact information.",
  openGraph: {
    title: "John Amoako Appiah | Interactive Portfolio",
    description:
      "Ambitious ideas shaped into memorable digital products. Explore the Proximus Shev developer workspace.",
    type: "website",
    siteName: "Proximus Shev",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Proximus Shev, the portfolio of John Amoako Appiah" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "John Amoako Appiah | Interactive Portfolio",
    description:
      "Explore polished digital products, projects, and skills inside the Proximus Shev developer workspace.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppIntro />
        {children}
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitializer }}
        />
        <Script
          id="home-scroll-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: homeScrollInitializer }}
        />
      </body>
    </html>
  );
}
