import { Lock } from "@/utils/icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Book } from "../../../utils/Illustrations";

const LoginCard = () => {
  const { t } = useTranslation();

  return (
    // Login Card
    <div className=" w-full md:min-w-lg lg:min-w-xl relative border-2 border-dashed border-[#0C78B9] rounded-full px-6 py-4 mt-8 flex flex-row items-center justify-center ">

          <Book  className="absolute bottom-10 right-8"/>

        <div className="flex flex-col items-center text-nowrap">
          <h2 className="text-base md:text-[32px]  lg:text-[40px] font-bold text-subtext">
            {t('home.loginToPlatform')}
          </h2>
          <p className="text-subtext mt-1 text-[14px]  md:text-[20px]  lg:text-[24px]">{t('home.forNewAndExistingUsers')}</p>
          <Link
            to="/login"
            className="mt-4 flex items-center gap-2 bg-orangedeep hover:bg-btnClicked focus:bg-btnClicked cursor-pointer text-[#0C2D40] px-6 py-2 rounded-full"
          >
            <Lock size={18} />
            {t('home.loginNow')}
          </Link>
        </div>

        <div className="absolute top-10 left-8">
          <svg
            width="65"
            height="65"
            viewBox="0 0 65 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_404_1454)">
              <path
                d="M36.0548 53.1468L31.7053 55.4465L15.3875 40.6771C15.0833 40.4019 14.7018 40.2269 14.2948 40.1758C13.8878 40.1247 13.4749 40.2 13.1121 40.3915L10.2832 41.8872L8.41352 38.3511L11.2424 36.8554C12.3318 36.2819 13.5709 36.0565 14.7924 36.2097C16.0139 36.3629 17.1589 36.8872 18.0729 37.712L31.18 49.5752L24.4889 18.9922C24.2102 17.7105 24.3578 16.3729 24.9092 15.1829C25.4606 13.9929 26.3858 13.0156 27.5438 12.3998L44.3033 3.53841L46.173 7.07455L29.4135 15.9359C29.0268 16.1401 28.7177 16.4653 28.5335 16.8617C28.3493 17.2582 28.3 17.7042 28.3933 18.1313L36.0548 53.1468ZM52.4789 33.151L53.6517 21.2191L49.4349 23.4487L48.6869 31.0837L41.9559 27.4031L37.7391 29.6327L48.2603 35.3815L47.0875 47.3134L51.3044 45.0838L52.0523 37.4488L58.7833 41.1294L63.0001 38.8998L52.4789 33.151Z"
                fill="#8180BD"
              />
            </g>
            <defs>
              <clipPath id="clip0_404_1454">
                <rect
                  width="48"
                  height="48"
                  fill="white"
                  transform="translate(0 22.4375) rotate(-27.867)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
  );
};

export default LoginCard;
