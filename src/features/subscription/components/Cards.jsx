import React, { useState } from "react";
import Card from "./Card";

export const Cards = React.memo(({ subscriptions }) => {
  const [openCardId, setOpenCardId] = useState(null);

  const handleCardToggle = (cardId) => {
    setOpenCardId(prevId => prevId === cardId ? null : cardId);
  };

  return (
    <div className="w-full columns-1 md:columns-1 lg:columns-2 gap-6 mt-6 lg:mt-10">
      {subscriptions.map((sub) => {
        return (
          <div key={sub.id} className="mb-6 break-inside-avoid">
            <Card 
              item={sub} 
              isOpen={openCardId === sub.id}
              onToggle={() => handleCardToggle(sub.id)}
            />
          </div>
        );
      })}
    </div>
  );
});

export default Cards;
