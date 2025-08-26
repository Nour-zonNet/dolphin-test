import FooterDraw from "@/assets/authentication/draw.svg"; 

const FooterIllustration = () => {
  return (
    <div className="absolute bottom-0 left-0">
      <img src={FooterDraw} alt="draw" className="w-40 sm:w-56 md:w-72 lg:w-60" />
    </div>
  );
};

export default FooterIllustration;
