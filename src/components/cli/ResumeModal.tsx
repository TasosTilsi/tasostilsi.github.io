"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PortfolioData } from "@/data/portfolio-main-data";
import React, { useRef } from "react";
import ResumeHeader from "@/components/resume/ResumeHeader";
import ResumeSummary from "@/components/resume/ResumeSummary";
import ResumeExperience from "@/components/resume/ResumeExperience";
import ResumeSkills from "@/components/resume/ResumeSkills";
import ResumeEducation from "@/components/resume/ResumeEducation";
import ResumeCertifications from "@/components/resume/ResumeCertifications";
import ResumeProjects from "@/components/resume/ResumeProjects";
import ResumeArticles from "@/components/resume/ResumeArticles";
import UniversalModal from "./UniversalModal";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  autoDownload?: boolean;
}

// Smart defaults: always show core sections + intelligent optional sections

const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  data,
  autoDownload = false,
}) => {
  // Smart defaults: always show these sections initially
  const [showCertifications, setShowCertifications] = React.useState(true);
  const [showProjects, setShowProjects] = React.useState(true);
  const [showArticles, setShowArticles] = React.useState(true);
  const [showSettings, setShowSettings] = React.useState(false);

  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    console.log("Print button clicked, attempting to call window.print()");
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        console.error("Error during window.print():", e);
      }
    }, 100);
  };

  const handleDownloadPDF = async () => {
    try {
      const jspdfModule = await import('jspdf');
      const jsPDF = jspdfModule.default || (jspdfModule as any).jsPDF;
      const html2canvas = (await import('html2canvas')).default;

      if (!jsPDF) {
        throw new Error("Failed to load jsPDF library");
      }

      if (!resumeRef.current) return;

      // Clone the element to avoid messing with the visible one and to capture full height
      const element = resumeRef.current;
      const clone = element.cloneNode(true) as HTMLElement;

      // Style the clone to ensure it captures everything
      // Use fixed position to ensure it's rendered by the browser but off-screen
      clone.style.position = 'fixed';
      clone.style.left = '-10000px';
      clone.style.top = '0';
      clone.style.width = '1000px'; // Fixed width for consistent PDF
      clone.style.height = 'auto';
      clone.style.overflow = 'visible';
      clone.style.zIndex = '-1000';
      clone.style.backgroundColor = '#ffffff'; // Ensure background is white

      document.body.appendChild(clone);

      // Wait for content to render in the clone
      await new Promise(resolve => setTimeout(resolve, 1000)); // Increased wait time

      const canvas = await html2canvas(clone, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scale: 2, // Better quality
        logging: false,
      } as any);

      // Remove clone
      document.body.removeChild(clone);

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error("Canvas capture failed (empty canvas)");
      }

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${data.about.name.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try the print option instead.');
    }
  };

  // Auto-download effect
  React.useEffect(() => {
    if (isOpen && autoDownload) {
      // Small delay to ensure render
      const timer = setTimeout(() => {
        handleDownloadPDF();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoDownload]);

  if (!isOpen || !data) {
    return null;
  }

  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${data.about.name} - Resume`}
      description="Professional ATS-friendly resume with modern formatting"
      iframeUrl=""
      externalUrl=""
      contentClassName="print:static print:left-0 print:top-0 print:m-0 print:translate-x-0 print:translate-y-0 print:w-full print:max-w-none print:h-auto print:max-h-none print:shadow-none print:border-none print:p-0 print:overflow-visible print:bg-white"
      footerButtons={
        <>
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)} className="w-full sm:w-auto min-h-[44px]">
            <i className={`fas fa-cog mr-2 ${showSettings ? "text-accent" : ""}`} aria-hidden="true"></i>Customize
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF} className="w-full sm:w-auto min-h-[44px]">
            <i className="fas fa-download mr-2" aria-hidden="true"></i>Download PDF
          </Button>
          <Button onClick={handlePrint} className="w-full sm:w-auto min-h-[44px]">
            <i className="fas fa-print mr-2" aria-hidden="true"></i>Print Resume
          </Button>
        </>
      }
    >
      <ScrollArea className="flex-grow overflow-y-auto print:overflow-visible print:h-auto">
        <div
          ref={resumeRef}
          className="bg-white text-gray-900 max-w-4xl mx-auto p-8 print:p-6 print:max-w-none print:mx-0 print:bg-white min-h-full"
          style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            lineHeight: '1.5',
            minHeight: 'fit-content',
          }}
        >
          {showSettings && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-200 print:hidden">
              <h4 className="font-bold mb-3 text-gray-700">Customize Sections</h4>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showCertifications}
                    onChange={(e) => setShowCertifications(e.target.checked)}
                    className="w-4 h-4 text-accent rounded focus:ring-accent"
                  />
                  <span>Certifications</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showProjects}
                    onChange={(e) => setShowProjects(e.target.checked)}
                    className="w-4 h-4 text-accent rounded focus:ring-accent"
                  />
                  <span>Projects</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showArticles}
                    onChange={(e) => setShowArticles(e.target.checked)}
                    className="w-4 h-4 text-accent rounded focus:ring-accent"
                  />
                  <span>Articles</span>
                </label>
              </div>
            </div>
          )}

          <ResumeHeader data={data} />
          <ResumeSummary data={data} />
          <ResumeExperience data={data} />

          {/* Always show core sections */}
          <ResumeSkills data={data} />
          <ResumeEducation data={data} />

          {/* Smart optional sections */}
          {showCertifications && <ResumeCertifications data={data} />}
          {showProjects && <ResumeProjects data={data} limit={6} />}
          {showArticles && <ResumeArticles data={data} limit={5} />}
        </div>
      </ScrollArea>
    </UniversalModal>
  );
};

export default ResumeModal;