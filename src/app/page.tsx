// src/app/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { SimplexBuilder } from "@/components/SimplexBuilder";
import { TransportBuilder } from "@/components/TransportBuilder";
import { NetworkBuilder } from "@/components/NetworkBuilder";

export default function Home() {
  const [mode, setMode] = useState<"SIMPLEX" | "TRANSPORT" | "NETWORK">("SIMPLEX");

  return (
    <main className="min-h-screen bg-slate-100 py-10 font-sans text-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 md:px-8 mb-8 flex justify-center">
        <nav className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 inline-flex" aria-label="Abas de Módulos">
          <button 
            onClick={() => setMode("SIMPLEX")}
            aria-pressed={mode === "SIMPLEX"}
            className={`px-8 py-3 rounded-lg font-black tracking-wide text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-200 ${mode === "SIMPLEX" ? "bg-blue-600 text-white shadow-md scale-100" : "text-slate-500 hover:bg-slate-50 scale-95 hover:scale-100"}`}
          >
            Matemática (Simplex)
          </button>
          <button 
            onClick={() => setMode("TRANSPORT")}
            aria-pressed={mode === "TRANSPORT"}
            className={`px-8 py-3 rounded-lg font-black tracking-wide text-sm transition-all focus:outline-none focus:ring-4 focus:ring-indigo-200 ${mode === "TRANSPORT" ? "bg-indigo-600 text-white shadow-md scale-100" : "text-slate-500 hover:bg-slate-50 scale-95 hover:scale-100"}`}
          >
            Logística (Transporte)
          </button>
          <button 
            onClick={() => setMode("NETWORK")}
            aria-pressed={mode === "NETWORK"}
            className={`px-8 py-3 rounded-lg font-black tracking-wide text-sm transition-all focus:outline-none focus:ring-4 focus:ring-emerald-200 ${mode === "NETWORK" ? "bg-emerald-600 text-white shadow-md scale-100" : "text-slate-500 hover:bg-slate-50 scale-95 hover:scale-100"}`}
          >
            Redes (Grafos)
          </button>
        </nav>
        
        <Link 
          href="/manual" 
          className="ml-4 hidden sm:flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all focus:ring-4 focus:ring-blue-200"
          title="Manual do Aluno"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Ver Manual
        </Link>
      </div>
      
      {mode === "SIMPLEX" && <SimplexBuilder />}
      {mode === "TRANSPORT" && <TransportBuilder />}
      {mode === "NETWORK" && <NetworkBuilder />}
    </main>
  );
}
