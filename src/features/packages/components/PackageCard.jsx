const PackageCard = ({ item }) => {
  return (
    <div className="relative w-full max-w-[550px] mx-auto">
      <div
        className={`relative rounded-[10.45px] border border-cardBorder min-h-[200px] w-full overflow-hidden transform skew-x-[0.6deg]`}
      >
        {/* Header */}
        <div
          className={`flex flex-col xs:flex-row xs:items-center gap-2 relative z-10 h-auto xs:h-[75px] text-white px-4 py-3 ${item.color}`}
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="w-[40px] h-[40px] xs:w-[50px] xs:h-[50px]"
            />
          )}
          <div>
            <h2 className="text-lg xs:text-xl font-semibold">{item.title}</h2>
            <h2 className="text-base xs:text-lg font-medium">{item.description}</h2>
          </div>
        </div>

        {/* Status & Group */}
        <div className="flex flex-wrap items-center gap-3 mt-4 px-4 relative z-10">
          <div className="bg-[#FCF0E0] min-w-[100px] h-[36px] font-semibold rounded-3xl px-3 flex items-center justify-center">
            <span className="text-status text-xs xs:text-base">{item.status}</span>
          </div>
          <p className="text-navyteal font-semibold text-xs xs:text-base">{item.group}</p>
        </div>

        {/* Schedule & Social */}
        <div className="flex flex-col xs:flex-row items-center justify-between gap-4 px-4 py-4 relative z-10">
          <button className="w-full xs:w-[280px] h-[50px] text-navyteal text-[16px] xs:text-[18px] flex items-center justify-center gap-3 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked cursor-pointer rounded-3xl px-4">
            معاينة الجدول الأسبوعي
          </button>

          <div className="flex items-center justify-center gap-6 h-[52px] w-full xs:w-[131px] border border-navyteal rounded-4xl">
            {/* <img src={whatsapp} alt="whatsapp" className="cursor-pointer" /> */}
            {/* <img src={telegram} alt="telegram" className="cursor-pointer" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
