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
import { Separator } from "@/components/ui/separator";
import type {
  Article,
  Certification,
  PortfolioData,
} from "@/data/portfolio-main-data";
import { isValidUrl } from "@/lib/utils";
import {
  differenceInYears,
  format as formatDateFns,
  isValid as isValidDate,
  parse as parseDateFns,
} from "date-fns";
import React from "react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  sectionsToDisplay?: string[];
}

const ALL_OPTIONAL_SECTIONS = [
  "education",
  "skills",
  "projects",
  "certifications",
  "articles",
  "interests",
];

const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  data,
  sectionsToDisplay,
}) => {
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
    }, 0);
  };

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

  const parseCertDate = (dateString: string): Date | null => {
    let parsedDate = parseDateFns(dateString, "MMMM yyyy", new Date());
    if (isValidDate(parsedDate)) return parsedDate;

    parsedDate = parseDateFns(dateString, "MMM yyyy", new Date());
    if (isValidDate(parsedDate)) return parsedDate;

    parsedDate = parseDateFns(dateString, "yyyy", new Date());
    if (isValidDate(parsedDate)) return parsedDate;

    return null;
  };

  const now = new Date();
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
    );

  const educationForResume = data.education.filter(
    (edu) => edu.degree !== "High School Degree"
  );
  const experienceForResume = data.experience.filter(
    (exp) => exp.isTechRelated
  );

  const sectionsToRender =
    sectionsToDisplay && sectionsToDisplay.length > 0
      ? sectionsToDisplay
      : ALL_OPTIONAL_SECTIONS;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl w-full h-[90vh] flex flex-col p-0 
                              print:static print:left-0 print:top-0 print:m-0 print:translate-x-0 print:translate-y-0 
                              print:w-full print:max-w-none print:h-auto print:max-h-none
                              print:shadow-none print:border-none print:p-0 print:overflow-visible"
      >
        <DialogHeader className="p-6 pb-2 print:hidden">
          <DialogTitle className="text-2xl">
            {data.about.name} - Resume
          </DialogTitle>
          <DialogDescription>
            A summary of professional experience and skills.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow overflow-y-auto print:overflow-visible print:h-auto">
          <div className="p-6 space-y-6 print:m-0 print:p-6 print:space-y-4">
            {/* --- ALWAYS DISPLAYED SECTIONS --- */}
            <header className="bg-background text-foreground p-6 rounded-lg shadow-sm print:shadow-none print:p-0 print:bg-transparent print:mb-4">
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-1 print:text-3xl">
                  {data.about.name}
                </h1>
                <h2 className="text-xl sm:text-2xl text-secondary-foreground font-light mb-3 print:text-xl">
                  {data.about.title}
                </h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground print:gap-x-4">
                  {contactItems.map((item) => (
                    <a
                      key={item.type}
                      href={item.href || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-primary transition-colors"
                    >
                      <i
                        className={`${item.icon} mr-2 w-4 h-4`}
                        aria-hidden="true"
                      ></i>
                      <span>{item.value}</span>
                    </a>
                  ))}
                </div>
              </div>
            </header>
            <Separator className="print:hidden" />

            <section className="print:mb-3" style={{ breakInside: "avoid" }}>
              <h3 className="text-xl font-semibold text-primary mb-3 flex items-center print:text-lg">
                <i
                  className="fas fa-user-circle mr-3 text-secondary w-5 h-5"
                  aria-hidden="true"
                ></i>
                Professional Summary
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap print:text-xs">
                {data.about.description}
              </p>
            </section>
            <Separator className="print:hidden" />

            <section className="print:mb-3" style={{ breakInside: "avoid" }}>
              <h3 className="text-xl font-semibold text-primary mb-3 flex items-center print:text-lg">
                <i
                  className="fas fa-briefcase mr-3 text-secondary w-5 h-5"
                  aria-hidden="true"
                ></i>
                Experience
              </h3>
              <div className="space-y-4">
                {experienceForResume.map((exp, index) => (
                  <div
                    key={index}
                    className="print:mb-3"
                    style={{ breakInside: "avoid-page" }}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                      <div>
                        <h4 className="text-md font-semibold text-primary print:text-sm">
                          {exp.title}
                        </h4>
                        <p className="text-sm text-secondary-foreground print:text-xs">
                          {exp.company} {exp.location && ` - ${exp.location}`}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 sm:mt-0 print:text-xs">
                        {exp.duration}
                      </p>
                    </div>
                    {exp.responsibilities &&
                      exp.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside pl-4 space-y-1 text-sm text-muted-foreground print:text-xs print:pl-3">
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i} className="whitespace-pre-wrap">
                              {resp}
                            </li>
                          ))}
                        </ul>
                      )}
                    {index < experienceForResume.length - 1 && (
                      <Separator className="my-4 print:hidden" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* --- OPTIONAL SECTIONS --- */}
            {sectionsToRender.includes("skills") && (
              <>
                <Separator className="print:hidden" />
                <section
                  className="print:mb-3"
                  style={{ breakInside: "avoid" }}
                >
                  <h3 className="text-xl font-semibold text-primary mb-3 flex items-center print:text-lg">
                    <i
                      className="fas fa-cogs mr-3 text-secondary w-5 h-5"
                      aria-hidden="true"
                    ></i>
                    Skills
                  </h3>
                  <div className="space-y-3">
                    {data.skills.soft_skills &&
                      data.skills.soft_skills.length > 0 && (
                        <div>
                          <h4 className="text-md font-medium text-primary mb-1 print:text-sm">
                            Soft Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {data.skills.soft_skills.map((skill) => (
                              <span
                                key={skill}
                                className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs print:bg-primary print:text-primary-foreground print:px-1.5 print:py-0.5 print:rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    {Object.entries(data.skills.hard_skills).map(
                      ([category, items]) => (
                        <div key={category}>
                          <h4 className="text-md font-medium text-primary mb-1 print:text-sm">
                            {category
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {(items as string[]).map((skill) => (
                              <span
                                key={skill}
                                className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs print:bg-primary print:text-primary-foreground print:px-1.5 print:py-0.5 print:rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                    {data.skills.languages &&
                      data.skills.languages.length > 0 && (
                        <div>
                          <h4 className="text-md font-medium text-primary mb-1 mt-2 print:text-sm">
                            Languages
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {data.skills.languages.map((lang) => (
                              <span
                                key={lang}
                                className="bg-accent/10 text-accent-foreground px-2 py-1 rounded-full text-xs print:bg-accent print:text-accent-foreground print:px-1.5 print:py-0.5 print:rounded-full"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </section>
              </>
            )}

            {sectionsToRender.includes("education") && (
              <>
                <Separator className="print:hidden" />
                <section
                  className="print:mb-3"
                  style={{ breakInside: "avoid" }}
                >
                  <h3 className="text-xl font-semibold text-primary mb-3 flex items-center print:text-lg">
                    <i
                      className="fas fa-graduation-cap mr-3 text-secondary w-5 h-5"
                      aria-hidden="true"
                    ></i>
                    Education
                  </h3>
                  <div className="space-y-4">
                    {educationForResume.map((edu, index) => (
                      <div
                        key={index}
                        className="print:mb-3"
                        style={{ breakInside: "avoid-page" }}
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                          <div>
                            <h4 className="text-md font-semibold text-primary print:text-sm">
                              {edu.degree}
                            </h4>
                            <p className="text-sm text-secondary-foreground print:text-xs">
                              {edu.institution}
                              {edu.location && `, ${edu.location}`}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 sm:mt-0 print:text-xs">
                            {edu.duration}
                          </p>
                        </div>
                        {edu.specialization && (
                          <p className="text-xs text-muted-foreground print:text-xs">
                            Specialization: {edu.specialization}
                          </p>
                        )}
                        {edu.courses && (
                          <div className="text-xs text-muted-foreground mt-1 print:text-xs">
                            {Array.isArray(edu.courses) &&
                              edu.courses.length > 0 && (
                                <p>Key Courses: {edu.courses.join(", ")}</p>
                              )}
                            {typeof edu.courses === "object" &&
                              !Array.isArray(edu.courses) &&
                              Object.keys(edu.courses).length > 0 && (
                                <>
                                  <p>Key Courses/Details:</p>
                                  <ul className="list-none pl-2">
                                    {Object.entries(edu.courses).map(
                                      ([category, courseList]) => (
                                        <li key={category}>
                                          <span className="font-medium">
                                            {category.charAt(0).toUpperCase() +
                                              category.slice(1)}
                                            :
                                          </span>{" "}
                                          {(courseList as string[]).join(", ")}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </>
                              )}
                          </div>
                        )}
                        {index < educationForResume.length - 1 && (
                          <Separator className="my-4 print:hidden" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {sectionsToRender.includes("projects") &&
              data.projects &&
              data.projects.length > 0 && (
                <>
                  <Separator className="print:hidden" />
                  <section
                    className="print:mb-3"
                    style={{ breakInside: "avoid" }}
                  >
                    <h3 className="text-xl font-semibold text-primary mb-3 flex items-center print:text-lg">
                      <i
                        className="fas fa-project-diagram mr-3 text-secondary w-5 h-5"
                        aria-hidden="true"
                      ></i>
                      Projects
                    </h3>
                    <div className="space-y-4">
                      {data.projects.map((project, index) => (
                        <div
                          key={index}
                          className="print:mb-3"
                          style={{ breakInside: "avoid-page" }}
                        >
                          <h4 className="text-md font-semibold text-primary print:text-sm">
                            {project.name}
                          </h4>
                          {project.date && (
                            <p className="text-xs text-muted-foreground print:text-xs">
                              Date: {project.date}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground my-1 print:text-xs whitespace-pre-wrap">
                            {project.description}
                          </p>
                          {isValidUrl(project.link) && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-accent hover:underline print:text-accent"
                            >
                              View Project
                            </a>
                          )}
                          {isValidUrl(project.sourceUrl) && (
                            <a
                              href={project.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-accent hover:underline ml-2 print:text-accent"
                            >
                              Source Code
                            </a>
                          )}
                          {index < data.projects.length - 1 && (
                            <Separator className="my-4 print:hidden" />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

            {sectionsToRender.includes("certifications") &&
              filteredCertsForResume &&
              filteredCertsForResume.length > 0 && (
                <>
                  <Separator className="print:hidden" />
                  <section
                    className="print:mb-3"
                    style={{ breakInside: "avoid" }}
                  >
                    <h3 className="text-xl font-semibold text-primary mb-3 flex items-center print:text-lg">
                      <i
                        className="fas fa-certificate mr-3 text-secondary w-5 h-5"
                        aria-hidden="true"
                      ></i>
                      Certifications (Last 7 Years)
                    </h3>
                    <div className="space-y-2">
                      {filteredCertsForResume.map((cert, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:justify-between print:mb-1"
                          style={{ breakInside: "avoid-page" }}
                        >
                          <p className="text-sm text-primary print:text-xs">
                            <i
                              className="fas fa-award text-secondary mr-2"
                              aria-hidden="true"
                            ></i>
                            {cert.name}
                            {isValidUrl(cert.link) && (
                              <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-accent hover:underline ml-2 print:text-accent"
                              >
                                [Link]
                              </a>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground print:text-xs">
                            {cert.parsedDate
                              ? formatDateFns(cert.parsedDate, "MMM yyyy")
                              : cert.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

            {sectionsToRender.includes("articles") &&
              data.articles &&
              data.articles.length > 0 && (
                <>
                  <Separator className="print:hidden" />
                  <section
                    className="print:mb-3"
                    style={{ breakInside: "avoid" }}
                  >
                    <h3 className="text-xl font-semibold text-primary mb-3 flex items-center print:text-lg">
                      <i
                        className="fas fa-newspaper mr-3 text-secondary w-5 h-5"
                        aria-hidden="true"
                      ></i>
                      Articles
                    </h3>
                    <div className="space-y-4">
                      {data.articles.map((article: Article, index: number) => (
                        <div
                          key={(article.name?.toString() || "article") + index}
                          className="print:mb-3"
                          style={{ breakInside: "avoid-page" }}
                        >
                          <h4 className="text-md font-semibold text-primary print:text-sm">
                            {article.name}
                          </h4>
                          <p className="text-xs text-muted-foreground print:text-xs">
                            Platform: {article.platform} | Date: {article.date}
                          </p>
                          {article.summary && (
                            <p className="text-sm text-muted-foreground my-1 print:text-xs whitespace-pre-wrap">
                              {article.summary}
                            </p>
                          )}
                          {isValidUrl(article.link) && (
                            <a
                              href={article.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-accent hover:underline print:text-accent"
                            >
                              Read Article
                            </a>
                          )}
                          {index < data.articles.length - 1 && (
                            <Separator className="my-4 print:hidden" />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

            {sectionsToRender.includes("interests") &&
              data.interests &&
              data.interests.length > 0 && (
                <>
                  <Separator className="print:hidden" />
                  <section
                    className="print:mb-3"
                    style={{ breakInside: "avoid" }}
                  >
                    <h3 className="text-xl font-semibold text-primary mb-3 flex items-center print:text-lg">
                      <i
                        className="fas fa-heart mr-3 text-secondary w-5 h-5"
                        aria-hidden="true"
                      ></i>
                      Interests
                    </h3>
                    <ul className="list-disc list-inside pl-4 space-y-1 text-sm text-muted-foreground print:text-xs print:pl-3">
                      {data.interests.map((interest, index) => (
                        <li key={index}>{interest}</li>
                      ))}
                    </ul>
                  </section>
                </>
              )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t print:hidden">
          <Button variant="outline" onClick={onClose}>
            Close
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
