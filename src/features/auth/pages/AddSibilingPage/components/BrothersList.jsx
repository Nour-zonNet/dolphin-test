import React, { useMemo } from "react";
import BrotherCard from "./BrotherCard";

const BrothersList = ({ brothers, classes }) => {
  const brothersList = useMemo(() => {
    if (!brothers?.length) return null;
    
    return brothers.map((brother) => {
      const gradeName =
        classes?.find((c) => c.id === brother?.grade?.toString())?.name ||
        `الصف ${brother?.grade}`;

      return (
        <BrotherCard
          key={brother?.id}
          brother={brother}
          gradeName={gradeName}
        />
      );
    });
  }, [brothers, classes]);

  if (!brothersList) return null;

  return (
    <section className="w-full max-w-4xl space-y-4 mb-8 border-t border-gray-300 py-6 px-4 sm:px-6 md:px-8 md:mb-12">
      {brothersList}
    </section>
  );
};

export default BrothersList;
