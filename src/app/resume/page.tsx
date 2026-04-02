"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ResumeView from "@/components/resume/ResumeView";
import portfolioData from "@/data/portfolio-main-data.json";
import { Button } from "@/components/ui/button";

const ResumePageContent = () => {
  const searchParams = useSearchParams();
  const shouldPrint = searchParams.get("print") === "true";
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to PRINTER mode for standalone

  useEffect(() => {
    if (shouldPrint) {
      // Small delay to ensure all monospaced fonts and transitions are finished
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldPrint]);

  return (
    <main className="min-h-screen bg-white">
      <div className="fixed top-4 right-4 z-50 flex gap-2 print:hidden">
        <Button 
          variant="outline" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="bg-white/80 backdrop-blur"
        >
          <i className={`fas ${isDarkMode ? "fa-sun" : "fa-moon"} mr-2`}></i>
          {isDarkMode ? "Printer Protocol" : "Obsidian Protocol"}
        </Button>
        <Button 
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <i className="fas fa-print mr-2"></i>
          Print / Save PDF
        </Button>
      </div>

      <ResumeView 
        data={portfolioData as any} 
        isDarkMode={isDarkMode} 
      />
    </main>
  );
};

export default function ResumePage() {
  return (
    <Suspense fallback={<div className="p-8 font-mono">LOADING ARCHIVE...</div>}>
      <ResumePageContent />
    </Suspense>
  );
}
