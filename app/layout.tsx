import type { Metadata } from "next";
import { Geist, Geist_Mono, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeManager } from "@/components/theme/theme-manager";
import { NO_FLASH_THEME_SCRIPT } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-hanken-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "MatriClick — Matrículas Virtuales",
  description:
    "Gestiona matrículas, estudiantes y grupos de tu institución educativa en un solo lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`dark ${geistSans.variable} ${geistMono.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Fija `dark` en <html> antes del primer paint — ver lib/theme.ts.
            El resto del sitio sigue forzado a oscuro (className de arriba);
            esto solo corrige a claro si la ruta es /dashboard y así se
            guardó. suppressHydrationWarning en <html> porque este script
            puede mutar la clase antes de que React hidrate. */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeManager />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
