import FooterDraw from "@/assets/authentication/draw.svg"; 

const FooterIllustration = () => {
  return (
    <div className="absolute bottom-0 left-0">
      <img src={FooterDraw} alt="draw" className="w-32 sm:w-38md:w-40 lg:w-40" />
    </div>
  );
};

export default FooterIllustration;
  