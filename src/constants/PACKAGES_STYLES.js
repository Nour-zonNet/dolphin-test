import quran from "@/assets/packages/quran.svg";
import english from "@/assets/packages/english.svg";
import tooth from "@/assets/packages/tooth.svg";
import game from "@/assets/packages/game.svg";
import math from "@/assets/packages/math.svg";
import talent from "@/assets/packages/talent.svg";
import skratch from "@/assets/packages/skratch.svg";
import special from "@/assets/packages/special.svg";
import science from "@/assets/packages/science.svg";
import arabic from "@/assets/packages/arabic.svg";
const groups = [
  {
    ids: [75, 154, 155, 156, 73, 157, 158, 102, 162, 163, 164, 159, 160, 161],
    style: { bgColor: "#2E7D32", image: quran },
  },

  {
    ids: [198, 123, 188, 189, 190, 191, 192, 193, 194, 195, 196],
    style: { bgColor: "#0077B6", image: tooth },
  },
  {
    ids: [
      145, 147, 150, 152, 149, 186, 117, 171, 174, 175, 172, 118, 165, 167, 168,
      169, 170,
    ],
    style: { bgColor: "#BCA7F5", image: english },
  },
  {
    ids: [174, 173, 185, 186, 187, 146, 148, 153, 122],
    style: { bgColor: "#8441BF", image: english },
  },
  {
    ids: [127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138],
    style: { bgColor: "#DFBE37", image: math },
  },
  {
    ids: [120, 121],
    style: { bgColor: "#F5EAD7", image: talent },
  },
  {
    ids: [114, 119],
    style: { bgColor: "#D8D8EB", image: game },
  },
  {
    ids: [113],
    style: { bgColor: "#D47C7C", image: skratch },
  },
  {
    ids: [179, 178, 177, 176, 180, 181, 182, 183, 184],
    style: { bgColor: "#CD6036", image: special },
  },
  {
    ids: [197, 206],
    style: { bgColor: "#F99E54", image: science },
  },
  {
    ids: [139, 140, 141, 142, 143, 144, 195, 196],
    style: { bgColor: "#C51162", image: arabic },
  },
];

export const packageStyles = groups.reduce((acc, group) => {
  group.ids.forEach((id) => {
    acc[id] = group.style;
  });
  return acc;
}, {});
