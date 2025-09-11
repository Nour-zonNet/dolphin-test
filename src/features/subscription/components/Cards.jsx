import React from "react";
import Card from "./Card";

export const Cards = React.memo(({ subscriptions }) => {

  return (
    // <div className="w-full grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-6 items-start mt-6 lg:mt-10">
    <div className="w-full columns-1 md:columns-1 lg:columns-2 gap-6 mt-6 lg:mt-10">
      {subscriptions.map((sub) => {
        return (
          <div key={sub.id} className="mb-6 break-inside-avoid">
            <Card item={sub} />
            {/* Add dashed line after each card except the last one */}
            {/* {index !== subscriptions.length - 1  && (
              <div className="my-8">
                <DashedLine className="w-full" />
              </div>
            )} */}
          </div>
        );
      })}
    </div>
  );
});

export default Cards;
