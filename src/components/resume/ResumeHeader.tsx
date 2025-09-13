"use client";

import { PortfolioData } from "@/data/portfolio-main-data";
import { isValidUrl } from "@/lib/utils";

interface ResumeHeaderProps {
  data: PortfolioData;
}

const ResumeHeader: React.FC<ResumeHeaderProps> = ({ data }) => {
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
      type: "medium",
      value: "Medium",
      icon: "fab fa-medium",
      href: data.about.contact.medium,
    },
    {
      type: "portfolio",
      value: "Portfolio",
      icon: "fas fa-globe",
      href: "https://tasostilsi.github.io/",
    },
  ].filter(
    (item) => isValidUrl(item.href) || (item.type === "email" && item.value)
  );

  return (
    <header className="mb-8 pb-6 border-b border-gray-200 print:border-gray-400 print:mb-6 print:pb-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 print:text-3xl print:mb-1">
          {data.about.name}
        </h1>
        <h2 className="text-xl text-gray-600 mb-4 print:text-lg print:mb-3">
          {data.about.title}
        </h2>
        <div className="text-sm text-gray-600 mb-2 print:text-xs">
          {data.about.location}
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm print:gap-3 print:text-xs">
          {contactItems.map((item) => (
            <a
              key={item.type}
              href={item.href || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors print:text-gray-700"
            >
              <i
                className={`${item.icon} mr-1.5 print:mr-1`}
                aria-hidden="true"
              ></i>
              <span>{item.value}</span>
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default ResumeHeader;