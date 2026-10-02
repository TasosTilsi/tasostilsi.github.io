"use client";

import React from "react";
import type { PortfolioData } from "@/data/portfolio-main-data";
import ResumeHeader from "@/components/resume/ResumeHeader";
import ResumeSummary from "@/components/resume/ResumeSummary";
import ResumeCoreCompetencies from "@/components/resume/ResumeCoreCompetencies";
import ResumeExperience from "@/components/resume/ResumeExperience";
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

// Single-column docx-order document flow (D-08, UI-SPEC §7.2/§7.3):
// Header → SUMMARY → CORE COMPETENCIES → PROFESSIONAL EXPERIENCE → PROJECTS →
// EDUCATION → CERTIFICATIONS → SELECTED WRITING. The 33/67 sidebar grid is
// gone (§7.2); PROJECTS and PUBLICATIONS render independently of each other
// (E-16). The CLI ResumeModal renders this same component and inherits the
// docx layout and featured curation (§7.5) — its props contract is unchanged.
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
    },
    light: {
      bg: "bg-white",
      text: "text-gray-900",
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
            display: block !important;
            width: 100% !important;
            padding: 25px 30px !important;
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

      <div className="flex flex-col min-h-screen resume-wrapper px-8 py-10 md:px-12">
        <ResumeHeader data={data} isDarkMode={isDarkMode} />

        <div className="space-y-12 print:space-y-6">
          <ResumeSummary data={data} isDarkMode={isDarkMode} />

          <ResumeCoreCompetencies data={data} isDarkMode={isDarkMode} />

          <ResumeExperience data={data} isDarkMode={isDarkMode} />

          {showProjects && <ResumeProjects data={data} isDarkMode={isDarkMode} featuredOnly />}

          <ResumeEducation data={data} isDarkMode={isDarkMode} featuredOnly />

          {showCertifications && <ResumeCertifications data={data} isDarkMode={isDarkMode} featuredOnly />}

          {showArticles && <ResumeArticles data={data} isDarkMode={isDarkMode} featuredOnly />}
        </div>
      </div>
    </div>
  );
};

export default ResumeView;