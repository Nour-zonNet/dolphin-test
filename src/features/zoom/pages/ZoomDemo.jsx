import { Header } from "../../../components/layout";
import ZoomMeeting from "../components/ZoomMeeting";

function ZoomDemo() {
  return (
    <div className="w-full h-screen flex flex-col ">
      <Header onBack={"/schedule"} title="الحصة مباشر" />

      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">الحصة مباشر</h2>
            <p className="text-sm text-gray-600">
              Meeting ID:{" "}
              {import.meta.env.VITE_ZOOM_MEETING_NUMBER || "123456789"}
            </p>
          </div>

          <div className="relative" style={{ height: "500px" }}>
            <ZoomMeeting />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ZoomDemo;
