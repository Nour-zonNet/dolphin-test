import { Header } from "../../../components/layout";
import ZoomMeeting from "../components/ZoomMeeting";

function ZoomDemo() {
  return (
    <div className="w-full h-screen flex flex-col ">
      <Header onBack={"/schedule"} title="الحصة مباشر" />

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg overflow-hidden">
         

          <div className="relative" style={{ height: "500px" }}>
            <ZoomMeeting />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ZoomDemo;
