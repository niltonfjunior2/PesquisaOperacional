import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Simplex Builder - Pesquisa Operacional",
  description: "Plataforma Educacional para Resolução de Problemas de Pesquisa Operacional (Método Simplex e Gráfico).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50/30">
        <main className="flex-1">
          {children}
        </main>
        
        <footer className="w-full py-8 bg-white border-t border-slate-200 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-5 md:px-16 gap-6">
            <div className="flex items-center gap-3">
              {/* Logo from public/po.png */}
              <img src="/po.png" alt="Simplex Builder" className="h-10 w-auto object-contain opacity-90 grayscale hover:grayscale-0 transition-all" />
              <div className="font-bold text-lg text-slate-700 tracking-tight">Simplex Builder</div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold text-slate-500">
              <a href="/sobre" className="hover:text-emerald-600 transition-colors">Sobre</a>
              <a href="/termos" className="hover:text-emerald-600 transition-colors">Termos</a>
              <a href="/privacidade" className="hover:text-emerald-600 transition-colors">Privacidade</a>
            </div>
            
            <div className="text-xs font-medium text-slate-400 text-center md:text-right">
              © {new Date().getFullYear()} Nilton F. Junior.<br/>
              Licença Educacional.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
