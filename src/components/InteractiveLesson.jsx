import FirstBuyGame from "./minigames/FirstBuyGame.jsx";
import HeadlineQuizGame from "./minigames/HeadlineQuizGame.jsx";
import PortfolioBuilderGame from "./minigames/PortfolioBuilderGame.jsx";

const MINI_GAMES = {
  "first-buy": FirstBuyGame,
  "headline-quiz": HeadlineQuizGame,
  "portfolio-builder": PortfolioBuilderGame,
};

export default function InteractiveLesson({ miniGame, onComplete }) {
  const GameComponent = MINI_GAMES[miniGame.type];
  if (!GameComponent) return null;
  return <GameComponent config={miniGame.config} onComplete={onComplete} />;
}
