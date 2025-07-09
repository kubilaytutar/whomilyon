import React from 'react';

const PRIZE_AMOUNTS = [
  100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000,
  250000, 500000, 1000000,
];

const GUARANTEED_LEVELS = [5, 10];

interface HorizontalPrizeLadderProps {
  currentLevel: number;
}

const HorizontalPrizeLadder: React.FC<HorizontalPrizeLadderProps> = ({ currentLevel }) => {
  return (
    <div className="horizontal-prize-ladder">
      <div className="prize-track">
        {PRIZE_AMOUNTS.map((amount, index) => {
          const level = index + 1;
          const isCurrent = level === currentLevel;
          const isGuaranteed = GUARANTEED_LEVELS.includes(level);
          const isAchieved = level < currentLevel;

          let itemClass = 'prize-item';
          if (isCurrent) itemClass += ' current';
          if (isGuaranteed) itemClass += ' guaranteed';
          if (isAchieved) itemClass += ' achieved';

          return (
            <div key={level} className={itemClass}>
              <div className="prize-amount">${amount.toLocaleString()}</div>
              <div className="prize-level-dot"></div>
              <div className="prize-level-number">{level}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalPrizeLadder; 