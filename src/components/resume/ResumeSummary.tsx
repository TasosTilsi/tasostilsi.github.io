import { PortfolioData } from "@/data/portfolio-main-data";

interface ResumeSummaryProps {
  data: PortfolioData;
  isDarkMode?: boolean;
}

const ResumeSummary: React.FC<ResumeSummaryProps> = ({ data, isDarkMode = true }) => {
  const accentColor = isDarkMode ? "text-[#8fdb00]" : "text-blue-600";
  const textColor = isDarkMode ? "text-[#dae2fd]" : "text-gray-800";

  return (
    <section className="resume-section mb-10 overflow-hidden" style={{ breakInside: "avoid" }}>
      <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center ${accentColor}`}>
        <span className="mr-2 opacity-50">//</span> SUMMARY.EXE
      </h3>
      <p className={`text-[11.5px] leading-relaxed font-mono ${textColor} opacity-90 print:text-black print:text-[10px]`}>
        {data.about.description}
      </p>
    </section>
  );
};

export default ResumeSummary;