"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PortfolioData } from "@/data/portfolio-main-data";
import React from "react";
import UniversalModal from "./UniversalModal";
import ResumeView from "@/components/resume/ResumeView";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
}

const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [showCertifications, setShowCertifications] = React.useState(true);
  const [showProjects, setShowProjects] = React.useState(true);
  const [showArticles, setShowArticles] = React.useState(true);
  const [showSettings, setShowSettings] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  if (!isOpen || !data) return null;

  const handleOpenPrintView = () => {
    // Open the static, high-fidelity standalone HTML page in a new tab
    // This bypasses React/Next.js for perfect A4 print fidelity
    const url = `/resume-export.html`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${data.about.name} - Resume`}
      description="Personal Intelligent Archive Portfolio - Digital Curator Aesthetic"
      iframeUrl=""
      externalUrl=""
      contentClassName="print:hidden" // We hide the modal during print and use the standalone page
      footerButtons={
        <>
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)} className="w-full sm:w-auto min-h-[44px]">
            <i className={`fas fa-cog mr-2 ${showSettings ? "text-accent" : ""}`} aria-hidden="true"></i>Customize
          </Button>
          <Button onClick={handleOpenPrintView} className="w-full sm:w-auto min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white">
            <i className="fas fa-print mr-2" aria-hidden="true"></i>Print / Save PDF (Clickable Links)
          </Button>
        </>
      }
    >
      <ScrollArea className="flex-grow overflow-y-auto">
        <div className="min-h-full transition-colors duration-300">
          {showSettings && (
            <div className={`p-6 border-b ${isDarkMode ? "bg-[#131b2e] border-[#2d3449]" : "bg-gray-100 border-gray-200"}`}>
              <h4 className="font-bold mb-4 flex items-center">
                <i className="fas fa-sliders-h mr-2 opacity-70"></i>
                SYSTEM CONFIGURATION
              </h4>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                   <span className="text-xs font-bold opacity-70 uppercase tracking-wider">Visual Protocol:</span>
                   <div className="flex bg-black/20 p-1 rounded-md">
                      <button 
                        onClick={() => setIsDarkMode(true)}
                        className={`px-3 py-1 text-xs rounded transition-all ${isDarkMode ? "bg-[#8fdb00] text-black font-bold" : "hover:text-white"}`}
                      >
                        OBSIDIAN
                      </button>
                      <button 
                        onClick={() => setIsDarkMode(false)}
                        className={`px-3 py-1 text-xs rounded transition-all ${!isDarkMode ? "bg-blue-600 text-white font-bold" : "hover:text-white"}`}
                      >
                        PRINTER
                      </button>
                   </div>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="text-xs font-bold opacity-70 uppercase tracking-wider">Module Display:</span>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                    <input
                      type="checkbox"
                      checked={showCertifications}
                      onChange={(e) => setShowCertifications(e.target.checked)}
                      className="w-4 h-4 text-accent rounded focus:ring-accent"
                    />
                    <span>CERTIFICATIONS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                    <input
                      type="checkbox"
                      checked={showProjects}
                      onChange={(e) => setShowProjects(e.target.checked)}
                      className="w-4 h-4 text-accent rounded focus:ring-accent"
                    />
                    <span>PROJECTS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
                    <input
                      type="checkbox"
                      checked={showArticles}
                      onChange={(e) => setShowArticles(e.target.checked)}
                      className="w-4 h-4 text-accent rounded focus:ring-accent"
                    />
                    <span>PUBLICATIONS</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <ResumeView 
            data={data}
            isDarkMode={isDarkMode}
            showCertifications={showCertifications}
            showProjects={showProjects}
            showArticles={showArticles}
          />
        </div>
      </ScrollArea>
    </UniversalModal>
  );
};

export default ResumeModal;