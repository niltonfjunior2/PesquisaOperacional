// src/app/page.tsx
"use client";
import { useState } from "react";
import { SimplexBuilder } from "@/components/SimplexBuilder";
import { TransportBuilder } from "@/components/TransportBuilder";

export default function Home() {
  const [mode, setMode] = useState<"SIMPLEX" | "TRANSPORT">("SIMPLEX");

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
        </nav>
      </div>
      
      {mode === "SIMPLEX" ? <SimplexBuilder /> : <TransportBuilder />}
    </main>
  );
}
