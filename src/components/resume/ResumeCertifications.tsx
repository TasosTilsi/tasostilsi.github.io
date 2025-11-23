"use client";

import { PortfolioData, Certification } from "@/data/portfolio-main-data";
import { isValidUrl } from "@/lib/utils";
import {
  differenceInYears,
  format as formatDateFns,
  isValid as isValidDate,
  parse as parseDateFns,
} from "date-fns";

interface ResumeCertificationsProps {
  data: PortfolioData;
}

const ResumeCertifications: React.FC<ResumeCertificationsProps> = ({ data }) => {
  const parseCertDate = (dateString: string): Date | null => {
    try {
      if (!dateString) return null;

      let parsedDate = parseDateFns(dateString, "MMMM yyyy", new Date());
      if (isValidDate(parsedDate)) return parsedDate;

      parsedDate = parseDateFns(dateString, "MMM yyyy", new Date());
      if (isValidDate(parsedDate)) return parsedDate;

      parsedDate = parseDateFns(dateString, "yyyy", new Date());
      if (isValidDate(parsedDate)) return parsedDate;

      return null;
    } catch (e) {
      console.warn("Error parsing date:", dateString, e);
      return null;
    }
  };

  const now = new Date();

  // Safety check for data
  if (!data || !data.certifications || !Array.isArray(data.certifications)) {
    return null;
  }

  const filteredCertsForResume = (data.certifications as Certification[])
    .map((cert) => ({
      ...cert,
      parsedDate: parseCertDate(cert.date),
    }))
    .filter((cert) => {
      if (!cert.parsedDate) return false;
      const yearsDiff = differenceInYears(now, cert.parsedDate);
      return yearsDiff <= 7;
    })
    .sort(
      (a, b) => (b.parsedDate?.getTime() || 0) - (a.parsedDate?.getTime() || 0)
    )
    .slice(0, 10); // Limit to top 10 certifications

  if (filteredCertsForResume.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 print:mb-6" style={{ breakInside: "avoid" }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200 print:text-base print:mb-2">
        CERTIFICATIONS
      </h3>
      <div className="space-y-1 print:space-y-1">
        {filteredCertsForResume.map((cert, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:justify-between print:mb-1"
            style={{ breakInside: "avoid-page" }}
          >
            <div className="flex-1">
              <p className="text-sm text-gray-900 font-medium print:text-xs">
                {cert.name}
                {cert.link && cert.link.startsWith("Credential ID") && (
                  <span className="text-xs text-gray-600 ml-2">
                    ({cert.link})
                  </span>
                )}
                {cert.link && isValidUrl(cert.link) && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline ml-2 print:text-blue-700"
                  >
                    [Link]
                  </a>
                )}
              </p>
            </div>
            <div className="text-sm text-gray-600 print:text-xs">
              {cert.parsedDate
                ? formatDateFns(cert.parsedDate, "MMM yyyy")
                : cert.date}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeCertifications;