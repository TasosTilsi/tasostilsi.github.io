
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';
import { isValidUrl } from '@/lib/utils';

const portfolioData = portfolioDataJson as PortfolioData;

export const ContactOutput = () => {
  const professionalContacts = [
    { platform: "Email", handle: portfolioData.about.email, url: `mailto:${portfolioData.about.email}`, icon: "📧" },
    { platform: "LinkedIn", handle: portfolioData.about.contact.linkedin, url: portfolioData.about.contact.linkedin, icon: "💼" },
    { platform: "GitHub", handle: portfolioData.about.contact.github, url: portfolioData.about.contact.github, icon: "💻" },
    { platform: "Medium", handle: portfolioData.about.contact.medium, url: portfolioData.about.contact.medium, icon: "✍️" },
  ].filter(contact => (contact.handle || contact.url) && isValidUrl(contact.url));

  const socialContacts = [
    { platform: "Facebook", handle: portfolioData.about.contact.facebook, url: portfolioData.about.contact.facebook, icon: "📘" },
    { platform: "Instagram", handle: portfolioData.about.contact.instagram, url: portfolioData.about.contact.instagram, icon: "📸" },
    { platform: "Twitter", handle: portfolioData.about.contact.twitter, url: portfolioData.about.contact.twitter, icon: "🐦" },
    { platform: "Twitch", handle: portfolioData.about.contact.twitch, url: portfolioData.about.contact.twitch, icon: "🎮" },
  ].filter(contact => (contact.handle || contact.url) && isValidUrl(contact.url));

  const formatHandle = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/^\//, '') || urlObj.hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="flex flex-col gap-3 my-2">
      {/* Professional Contacts */}
      <div>
        <p className="text-accent font-bold mb-2">PROFESSIONAL CONTACT</p>
        <div className="border-b border-accent/30 mb-2"></div>
        <div className="space-y-1">
          {professionalContacts.map((contact, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-primary min-w-[120px]">
                {contact.icon} {contact.platform}
              </span>
              <span className="text-muted-foreground">→</span>
              {contact.platform === "Email" ? (
                <a href={contact.url} className="text-accent hover:underline break-all">
                  {contact.handle}
                </a>
              ) : (
                <a href={contact.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                  {formatHandle(contact.url)}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Social Contacts */}
      {socialContacts.length > 0 && (
        <div>
          <p className="text-accent font-bold mb-2">SOCIAL & COMMUNITY</p>
          <div className="border-b border-accent/30 mb-2"></div>
          <div className="space-y-1">
            {socialContacts.map((contact, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-primary min-w-[120px]">
                  {contact.icon} {contact.platform}
                </span>
                <span className="text-muted-foreground">→</span>
                <a href={contact.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                  {formatHandle(contact.url)}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
