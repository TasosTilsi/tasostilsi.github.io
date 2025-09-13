"use client";

import { PortfolioData } from "@/data/portfolio-main-data";

interface ResumeEducationProps {
  data: PortfolioData;
}

const ResumeEducation: React.FC<ResumeEducationProps> = ({ data }) => {
  const educationForResume = data.education.filter(
    (edu) => edu.degree !== "High School Degree"
  );

  return (
    <section className="mb-8 print:mb-6" style={{ breakInside: "avoid" }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-1 border-b border-gray-200 print:text-base print:mb-2">
        EDUCATION
      </h3>
      <div className="space-y-4 print:space-y-3">
        {educationForResume.map((edu, index) => (
          <div
            key={index}
            className="print:mb-3"
            style={{ breakInside: "avoid-page" }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-gray-900 print:text-sm">
                  {edu.degree}
                </h4>
                <p className="text-sm text-gray-700 print:text-xs">
                  {edu.institution}
                  {edu.location && `, ${edu.location}`}
                </p>
                {edu.specialization && (
                  <p className="text-xs text-gray-600 print:text-xs">
                    Specialization: {edu.specialization}
                  </p>
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1 sm:mt-0 print:text-xs">
                {edu.duration}
              </div>
            </div>
            {edu.courses && (
              <div className="text-xs text-gray-600 mt-1 print:text-xs">
                {Array.isArray(edu.courses) && edu.courses.length > 0 && (
                  <p>
                    <span className="font-medium">Key Courses:</span>{" "}
                    {edu.courses.join(", ")}
                  </p>
                )}
                {typeof edu.courses === "object" &&
                  !Array.isArray(edu.courses) &&
                  Object.keys(edu.courses).length > 0 && (
                    <div>
                      <p className="font-medium mb-1">Key Courses:</p>
                      {Object.entries(edu.courses).map(([category, courseList]) => (
                        <p key={category} className="ml-2">
                          <span className="font-medium">
                            {category.charAt(0).toUpperCase() + category.slice(1)}:
                          </span>{" "}
                          {(courseList as string[]).join(", ")}
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResumeEducation;