import FooterDraw from "@/assets/authentication/draw.svg"; 

const FooterIllustration = () => {
  return (
    <div className="absolute bottom-0 left-0 -z-10">
      <img src={FooterDraw} alt="draw" className="w-28 sm:w-38 md:w-40 lg:w-40" />
    </div>
  );
};

export default FooterIllustration;
  