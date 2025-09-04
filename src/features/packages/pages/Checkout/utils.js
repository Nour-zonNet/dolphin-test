export const getPackageIcon = (subjects) => {
  if (!subjects || subjects.length === 0)
    return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file-2.png";
  const subjectName = subjects[0].name;
  switch (subjectName) {
    case "البرمجة":
      return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file--1--1.png";
    case "الرياضيات":
      return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file-2.png";
    case "العلوم":
      return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file--3--1.png";
    case "اللغة العربية":
      return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file--3--1.png";
    case "اللغة الإنجليزية":
      return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file--1--1.png";
    default:
      return "https://c.animaapp.com/mf3u5boioWZVpp/img/adobe-express---file-2.png";
  }
};


