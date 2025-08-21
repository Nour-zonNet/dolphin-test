export const getNext7Days = () => {
  const days = [];
  const options = { weekday: "long" };
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      label: date.toLocaleDateString("ar-EG", options),
      date: date.toISOString().split("T")[0],
    });
  }
  return days;
};
