import React from "react";

const PageHeader = () => {
  return (
    <div className="max-w-md flex flex-row items-center justify-between gap-4 mb-6 md:mb-8">
      <header className="flex flex-col items-center gap-2">
        <h1 className="font-bold text-status text-xl sm:text-2xl text-right [font-family:'Cairo',Helvetica]">
          اضف اخوة
        </h1>
        <img
          className="w-36 sm:w-44 mt-2"
          alt="Decorative vector"
          src="https://c.animaapp.com/mfavn83xeP6Ws5/img/vector-1.svg"
        />
      </header>
      <img
        className="w-12 h-12 sm:w-16 sm:h-16"
        alt="Layer logo"
        src="https://c.animaapp.com/mfavn83xeP6Ws5/img/layer-1.svg"
      />
    </div>
  );
};

export default PageHeader;
