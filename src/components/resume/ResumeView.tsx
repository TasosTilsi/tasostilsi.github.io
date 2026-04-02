"use client";

import React from "react";
import type { PortfolioData } from "@/data/portfolio-main-data";
import ResumeHeader from "@/components/resume/ResumeHeader";
import ResumeSummary from "@/components/resume/ResumeSummary";
import ResumeExperience from "@/components/resume/ResumeExperience";
import ResumeSkills from "@/components/resume/ResumeSkills";
import ResumeEducation from "@/components/resume/ResumeEducation";
import ResumeCertifications from "@/components/resume/ResumeCertifications";
import ResumeProjects from "@/components/resume/ResumeProjects";
import ResumeArticles from "@/components/resume/ResumeArticles";

interface ResumeViewProps {
  data: PortfolioData;
  isDarkMode: boolean;
  showCertifications?: boolean;
  showProjects?: boolean;
  showArticles?: boolean;
}

const ResumeView: React.FC<ResumeViewProps> = ({
  data,
  isDarkMode,
  showCertifications = true,
  showProjects = true,
  showArticles = true,
}) => {
  const colors = {
    dark: {
      bg: "bg-[#0b1326]",
      text: "text-[#dae2fd]",
      sidebar: "bg-[#131b2e]",
    },
    light: {
      bg: "bg-white",
      text: "text-gray-900",
      sidebar: "bg-gray-50",
    }
  };

  const theme = isDarkMode ? colors.dark : colors.light;

  return (
    <div
      className={`${theme.bg} ${theme.text} resume-container max-w-5xl mx-auto print:max-w-none print:mx-0 print:bg-white min-h-full font-mono transition-colors duration-300`}
      style={{
        lineHeight: "1.6",
        minHeight: "fit-content",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 0mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: white !important;
          }
          .resume-container {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
          }
          .resume-wrapper {
            display: flex !important;
            flex-direction: row !important;
            width: 100% !important;
            min-height: 297mm !important;
          }
          .resume-sidebar {
            width: 33% !important;
            padding: 20px 15px !important;
            display: block !important;
            font-size: 0.75rem !important;
          }
          .resume-main {
            width: 67% !important;
            padding: 25px 30px !important;
            display: block !important;
            font-size: 0.8rem !important;
          }
          /* Tighten spacing for print */
          .print-tight {
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
          .print-no-spacing {
            gap: 0.5rem !important;
          }
          .print-hidden {
            display: none !important;
          }
          /* Ensure text fits */
          p, li, span {
            line-height: 1.3 !important;
          }
          h3 {
            margin-bottom: 0.5rem !important;
          }
          header {
            margin-bottom: 1rem !important;
          }
          .resume-section {
            margin-bottom: 1.5rem !important;
          }
          .space-y-12, .space-y-10, .space-y-8 {
            margin-top: 0.5rem !important;
          }
          ul {
            margin-top: 0.25rem !important;
          }
          li {
            margin-bottom: 0.125rem !important;
          }
        }
      `}} />

      <div className="flex flex-col md:flex-row min-h-screen resume-wrapper">
        {/* Sidebar Column */}
        <div className={`w-full md:w-[33%] p-8 resume-sidebar ${theme.sidebar} print:bg-white print:border-r print:border-gray-200`}>
          <ResumeHeader data={data} isDarkMode={isDarkMode} />
          
          <div className="mt-8 space-y-8 print:mt-4 print:space-y-4">
            <ResumeSkills data={data} isDarkMode={isDarkMode} />
            
            {showArticles && <ResumeArticles data={data} limit={6} isDarkMode={isDarkMode} isSidebar />}
            
            {showCertifications && <ResumeCertifications data={data} isDarkMode={isDarkMode} isSidebar />}
          </div>
        </div>

        {/* Main Content Column */}
        <div className="w-full md:w-[67%] p-8 md:p-12 space-y-10 resume-main print:space-y-6">
          <ResumeSummary data={data} isDarkMode={isDarkMode} />
          
          <div className="space-y-12 print:space-y-6">
            <ResumeExperience data={data} isDarkMode={isDarkMode} />
            <ResumeEducation data={data} isDarkMode={isDarkMode} />
            
            {showProjects && !showArticles && <ResumeProjects data={data} limit={6} isDarkMode={isDarkMode} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeView;
