export const getNext7Days = () => {
  const days = [];
  const optionsAR = { weekday: "long" };
  const optionsEN = { weekday: "long" };

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      label: date.toLocaleDateString("ar-EG", optionsAR), // Arabic day
      dayEn: date.toLocaleDateString("en-US", optionsEN).toLowerCase(), // "sunday"
      date: date.toISOString().split("T")[0], // YYYY-MM-DD
    });
  }
  return days;
};
