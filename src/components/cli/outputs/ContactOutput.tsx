
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';
import { isValidUrl } from '@/lib/utils';

const portfolioData = portfolioDataJson as PortfolioData;

export const ContactOutput = () => {
  const contacts = [
    { platform: "Email", handle: portfolioData.about.email, url: `mailto:${portfolioData.about.email}` },
    { platform: "LinkedIn", handle: portfolioData.about.contact.linkedin, url: portfolioData.about.contact.linkedin },
    { platform: "GitHub", handle: portfolioData.about.contact.github, url: portfolioData.about.contact.github },
    { platform: "Medium", handle: portfolioData.about.contact.medium, url: portfolioData.about.contact.medium },
    { platform: "Facebook", handle: portfolioData.about.contact.facebook, url: portfolioData.about.contact.facebook },
    { platform: "Instagram", handle: portfolioData.about.contact.instagram, url: portfolioData.about.contact.instagram },
    { platform: "Twitter", handle: portfolioData.about.contact.twitter, url: portfolioData.about.contact.twitter },
    { platform: "Twitch", handle: portfolioData.about.contact.twitch, url: portfolioData.about.contact.twitch },
  ].filter(contact => (contact.handle || contact.url));

  return (
    <div className="overflow-x-auto my-2">
      <table className="table-ascii">
        <thead>
          <tr>
            <th className="th-ascii">Platform</th>
            <th className="th-ascii">Link/Handle</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={index}>
              <td className="td-ascii text-primary">{contact.platform}</td>
              <td className="td-ascii">
                {isValidUrl(contact.url) ? (
                  <a href={contact.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                    {contact.handle || contact.url}
                  </a>
                ) : (
                  <span className="break-all">{contact.handle}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
