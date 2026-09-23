"use client";

import { PortfolioData, Certification } from "@/data/portfolio-main-data";

interface ResumeCertificationsProps {
  data: PortfolioData;
  isDarkMode?: boolean;
  isSidebar?: boolean;
  featuredOnly?: boolean;
}

const ResumeCertifications: React.FC<ResumeCertificationsProps> = ({ data, isDarkMode = true, isSidebar = false, featuredOnly = false }) => {
  const accentColor = isDarkMode ? "text-[#8fdb00]" : "text-blue-600";
  const textColor = isDarkMode ? "text-[#dae2fd]" : "text-gray-900";
  const mutedColor = isDarkMode ? "text-[#c6c6cb]" : "text-gray-600";

  // featuredOnly (/resume + modal, §7.3.7): the docx's five featured
  // certifications (ISTQB + 4 Anthropic Academy); the other 40 stay
  // CLI-reachable. Unset → the legacy top-8 slice.
  const topCerts = featuredOnly
    ? data.certifications.filter((cert) => cert.featured)
    : data.certifications.slice(0, 8);

  return (
    <section className="resume-section" style={{ breakInside: "avoid" }}>
      <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center ${accentColor}`}>
        <span className="mr-2 opacity-50">//</span> CERTIFICATIONS
      </h3>
      <div className="space-y-4">
        {topCerts.map((cert, index) => (
          <div key={index} className="group cursor-default" style={{ breakInside: "avoid" }}>
            <div className={`text-[11px] font-bold leading-tight ${textColor} mb-1 group-hover:${accentColor} transition-colors`}>
              {cert.name}
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className={`text-[9px] font-bold uppercase tracking-widest ${mutedColor} opacity-70`}>
                {cert.date}
              </span>
              {cert.link && cert.link.startsWith("ID:") && (
                <span className={`text-[8px] font-mono ${mutedColor} opacity-40 uppercase`}>
                  {cert.link}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeCertifications;