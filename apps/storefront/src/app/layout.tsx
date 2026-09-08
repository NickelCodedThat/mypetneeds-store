import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Spline_Sans } from "next/font/google"
import "styles/globals.css"

// Gate 2B.1: single approved Gate 2 type family, loaded through
// next/font/google (self-hosted at build time, no external <link> tag, no
// added dependency). `display: "swap"` avoids invisible-text flash; the
// fallback stack in tailwind.config.js keeps layout stable while it loads.
const splineSans = Spline_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-spline-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={splineSans.variable}>
      <body className="font-sans">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
