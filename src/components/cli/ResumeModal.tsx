"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
}

// Smart defaults: always show core sections + intelligent optional sections

const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const resumeRef = useRef<HTMLDivElement>(null);

  if (!isOpen) {
    return null;
  }

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
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      if (!resumeRef.current) return;
      
      // Force the element to show all content for capture
      const originalHeight = resumeRef.current.style.height;
      const originalOverflow = resumeRef.current.style.overflow;
      resumeRef.current.style.height = 'auto';
      resumeRef.current.style.overflow = 'visible';
      
      // Wait for content to fully render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(resumeRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        height: null, // Let it capture full height
        windowWidth: 1200,
        windowHeight: window.innerHeight,
        scrollX: 0,
        scrollY: 0,
      } as any);
      
      // Restore original styles
      resumeRef.current.style.height = originalHeight;
      resumeRef.current.style.overflow = originalOverflow;
      
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

  // Smart defaults: always show these sections
  const shouldShowCertifications = true; // Last 7 years, max 10
  const shouldShowProjects = true; // Top 6 most relevant
  const shouldShowArticles = true; // Top 5 most recent

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl w-full h-[90vh] flex flex-col p-0 
                              print:static print:left-0 print:top-0 print:m-0 print:translate-x-0 print:translate-y-0 
                              print:w-full print:max-w-none print:h-auto print:max-h-none
                              print:shadow-none print:border-none print:p-0 print:overflow-visible"
      >
        <DialogHeader className="p-6 pb-2 print-hidden">
          <DialogTitle className="text-2xl">
            {data.about.name} - Resume
          </DialogTitle>
          <DialogDescription>
            Professional ATS-friendly resume with modern formatting
          </DialogDescription>
        </DialogHeader>

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
            <ResumeHeader data={data} />
            <ResumeSummary data={data} />
            <ResumeExperience data={data} />
            
            {/* Always show core sections */}
            <ResumeSkills data={data} />
            <ResumeEducation data={data} />
            
            {/* Smart optional sections */}
            {shouldShowCertifications && <ResumeCertifications data={data} />}
            {shouldShowProjects && <ResumeProjects data={data} limit={6} />}
            {shouldShowArticles && <ResumeArticles data={data} limit={5} />}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t print-hidden">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <i className="fas fa-download mr-2" aria-hidden="true"></i>Download PDF
          </Button>
          <Button onClick={handlePrint}>
            <i className="fas fa-print mr-2" aria-hidden="true"></i>Print Resume
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeModal;