"use client";

import { PortfolioData } from "@/data/portfolio-main-data";
import { isValidUrl } from "@/lib/utils";

interface ResumeHeaderProps {
  data: PortfolioData;
  isDarkMode?: boolean;
}

const ResumeHeader: React.FC<ResumeHeaderProps> = ({ data, isDarkMode = true }) => {
  const contactItems = [
    {
      type: "email",
      value: data.about.contact.email,
      icon: "fas fa-envelope",
      href: `mailto:${data.about.contact.email}`,
    },
    {
      type: "linkedin",
      value: "LinkedIn",
      icon: "fab fa-linkedin",
      href: data.about.contact.linkedin,
    },
    {
      type: "github",
      value: "GitHub",
      icon: "fab fa-github",
      href: data.about.contact.github,
    },
    {
      type: "portfolio",
      value: "Portfolio",
      icon: "fas fa-globe",
      href: data.about.contact.portfolio || "https://tasostilsi.github.io/",
    },
  ].filter(
    (item) => isValidUrl(item.href) || (item.type === "email" && item.value)
  );

  const accentColor = isDarkMode ? "text-[#8fdb00]" : "text-blue-600";
  const mutedColor = isDarkMode ? "text-[#c6c6cb]" : "text-gray-600";
  const titleColor = isDarkMode ? "text-white" : "text-gray-900";

  return (
    <header className="mb-8 print:mb-6">
      <div className="space-y-4">
        <div>
          <h1 className={`text-3xl font-black leading-tight tracking-tighter uppercase ${titleColor} print:text-black print:text-2xl`}>
            {data.about.name}
          </h1>
          <h2 className={`text-xs font-bold uppercase tracking-[0.2em] mt-1 ${accentColor} print:text-blue-700`}>
            {data.about.title}
          </h2>
        </div>

        <div className={`text-[10px] leading-relaxed uppercase tracking-widest font-bold opacity-60 ${mutedColor} print:text-gray-500`}>
          {data.about.location}
        </div>

        <div className="space-y-2 pt-4">
          {contactItems.map((item) => (
            <a
              key={item.type}
              href={item.href || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center text-[11px] group transition-all ${mutedColor} hover:translate-x-1 print:text-black print:hover:translate-x-0`}
            >
              <i
                className={`${item.icon} w-5 ${accentColor} opacity-70 group-hover:opacity-100 transition-opacity print:text-gray-700`}
                aria-hidden="true"
              ></i>
              <span className="border-b border-transparent group-hover:border-current transition-all">
                {item.value}
              </span>
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default ResumeHeader;