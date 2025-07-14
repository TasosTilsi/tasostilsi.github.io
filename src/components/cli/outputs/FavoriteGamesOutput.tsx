import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';

const portfolioData = portfolioDataJson as PortfolioData;

function formatCategoryName(key: string) {
  // Convert snake_case to Title Case (e.g., "single_player_games" → "Single Player Games")
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export const FavoriteGamesOutput = () => {
  const { favorite_games } = portfolioData;
  if (!favorite_games || Object.values(favorite_games).every(arr => !arr?.length)) {
    return <p className="text-sm">No favorite games listed yet!</p>;
  }

  return (
    <>
      <p className="text-accent font-bold mb-2">Favorite Games:</p>
      {Object.entries(favorite_games).map(([category, games]) =>
        Array.isArray(games) && games.length > 0 ? (
          <div className="mb-3" key={category}>
            <p className="text-primary font-semibold">{formatCategoryName(category)}:</p>
            <ul className="list-disc list-inside pl-2 text-sm">
              {games.map((game, idx) => (
                <li key={`${category}-${idx}`}>{game}</li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </>
  );
};
