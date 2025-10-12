// import "./style.css";
// import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";

function ZoomMeting() {
  const client = ZoomMtgEmbedded.createClient();

  const authEndpoint = "http://localhost:4000";
  const meetingNumber = "97372526003"; // real meeting ID
  const passWord = "j9WTJAoybL9lQPaP9VrjDXhQbHbbWa"; // exact meeting passcode
  const role = 1; // 0 = participant, 1 = host
  const userName = "mahmoud";
  const userEmail = "mahmoud@example.com";
  const registrantToken = "";
  const zakToken = "";

  const getSignature = async () => {
    try {
      const req = await fetch(authEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingNumber: meetingNumber,
          role: role,
          videoWebRtcMode: 1,
        }),
      });
      const res = await req.json();
      const signature = res.signature;
      startMeeting(signature);
    } catch (e) {
      console.log(e);
    }
  };

  async function startMeeting() {
    const meetingSDKElement = document.getElementById("meetingSDKElement");
    try {
      await client.init({
        zoomAppRoot: meetingSDKElement,
        language: "en-US",
        patchJsMedia: true,
        leaveOnPageUnload: true,
      });
      await client.join({
        signature:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiJZT1VSX1NES19LRVkiLCJtbiI6IjEyMzQ1Njc4OSIsInJvbGUiOjAsImlhdCI6MTc2MDE4NzY2OSwiZXhwIjoxNzYwMTk0ODY5LCJhcHBLZXkiOiJZT1VSX1NES19LRVkiLCJ0b2tlbkV4cCI6MTc2MDE5NDg2OX0.58QZR2s6XBvqRlMryMv2yfFOT58Yv3Ytir8pTwuRRpQ",
        meetingNumber: meetingNumber,
        password: passWord,
        userName: userName,
        userEmail: userEmail,
        tk: registrantToken,
        zak: zakToken,
      });
      console.log("تم الانضمام الى الحصة بنجاح");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className=" flex justify-center items-center text-center">
      <main>
        <h1>اجتماع مباشر</h1>
        {/* For Component View */}
        <div id="meetingSDKElement" className="min-h-[300px]">
          {/* Zoom Meeting SDK Component View Rendered Here */}
        </div>
        <button className="bg-orangedeep mx-auto text-white px-4 py-2 rounded-full hover:cursor-pointer" onClick={()=>startMeeting()}>الانضمام الى الحصة</button>
      </main>
    </div>
  );
}

export default ZoomMeting;
