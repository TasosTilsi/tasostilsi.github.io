
import React from 'react';
import portfolioDataJson from '@/data/portfolio-main-data.json';
import type { PortfolioData } from '@/data/portfolio-main-data';

const portfolioData = portfolioDataJson as PortfolioData;

export const FavoriteGamesOutput = () => {
  const { favorite_games } = portfolioData;
  if (!favorite_games || (!favorite_games.simulation_games?.length && !favorite_games.strategy_games?.length)) {
    return <p className="text-sm">No favorite games listed yet!</p>;
  }

  return (
    <>
      <p className="text-accent font-bold mb-2">Favorite Games:</p>
      {favorite_games.simulation_games && favorite_games.simulation_games.length > 0 && (
        <div className="mb-3">
          <p className="text-primary font-semibold">Simulation Games:</p>
          <ul className="list-disc list-inside pl-2 text-sm">
            {favorite_games.simulation_games.map((game, index) => (
              <li key={`sim-${index}`}>{game}</li>
            ))}
          </ul>
        </div>
      )}
      {favorite_games.strategy_games && favorite_games.strategy_games.length > 0 && (
        <div>
          <p className="text-primary font-semibold">Strategy Games:</p>
          <ul className="list-disc list-inside pl-2 text-sm">
            {favorite_games.strategy_games.map((game, index) => (
              <li key={`strat-${index}`}>{game}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
