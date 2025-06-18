import type { Certification, PortfolioData } from "@/data/portfolio-main-data";
import portfolioDataJson from "@/data/portfolio-main-data.json";
import { isValidUrl } from "@/lib/utils";
import {
  differenceInYears,
  format as formatDateFns,
  isValid as isValidDate,
  parse as parseDateFns,
} from "date-fns";

const portfolioData = portfolioDataJson as PortfolioData;

export const CertsOutput = () => {
  const now = new Date();

  const parseCertDate = (dateString: string): Date | null => {
    let parsedDate = parseDateFns(dateString, "MMMM yyyy", new Date());
    if (isValidDate(parsedDate)) return parsedDate;

    parsedDate = parseDateFns(dateString, "MMM yyyy", new Date());
    if (isValidDate(parsedDate)) return parsedDate;

    parsedDate = parseDateFns(dateString, "yyyy", new Date());
    if (isValidDate(parsedDate)) return parsedDate;

    return null;
  };

  const allCertsWithParsedDates = (
    portfolioData.certifications as Certification[]
  )
    .map((cert) => ({
      ...cert,
      parsedDate: parseCertDate(cert.date),
    }))
    .sort(
      (a, b) => (b.parsedDate?.getTime() || 0) - (a.parsedDate?.getTime() || 0)
    );

  const filteredCerts = allCertsWithParsedDates.filter((cert) => {
    if (!cert.parsedDate) return false;
    const yearsDiff = differenceInYears(now, cert.parsedDate);
    return yearsDiff <= 6;
  });

  if (filteredCerts.length === 0) {
    return (
      <p className="text-sm">
        {
          "No certifications from the last 6 years. Use 'certifications -a' or 'certifications --all' to view all."
        }
      </p>
    );
  }

  return (
    <>
      {allCertsWithParsedDates.length > filteredCerts.length && (
        <p className="text-sm text-muted-foreground mb-2">
          Showing certifications from the last 6 years. Use 'certifications -a'
          or 'certifications --all' to see all.
        </p>
      )}
      <div className="flex flex-col space-y-1">
        {filteredCerts.map(
          (
            cert: Certification & { parsedDate: Date | null },
            index: number
          ) => {
            const displayDate =
              cert.parsedDate && isValidDate(cert.parsedDate)
                ? formatDateFns(cert.parsedDate, "MMM yyyy")
                : cert.date;
            return (
              <div
                key={(cert.name || "cert") + index}
                className="flex items-baseline space-x-2 text-sm"
              >
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs mr-2 shrink-0">
                  {displayDate}
                </span>
                <span className="text-accent font-medium">{cert.name}</span>
                {isValidUrl(cert.link) && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs shrink-0"
                  >
                    [Link]
                  </a>
                )}
              </div>
            );
          }
        )}
      </div>
    </>
  );
};
