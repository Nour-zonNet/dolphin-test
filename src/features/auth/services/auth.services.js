import api from "@/services/api";

class AuthRepository {
  async checkPhone(credentials) {
    const { data } = await api.post("/student/check-phone", credentials); 
        console.log(data)
    // REQ  Body {"phone_number" : "201156235709" }  |  RES   {   "success": true,   "message": "تم التحقق من رقم الهاتف بنجاح"}
    return data;
  }
  async login(credentials) {
    const { data } = await api.post("/student/login", credentials);
    console.log(data)
    return data;
    // REQ Body  phoneNumber : 201156235709  pinCode : 111111
    // RES {
    //     "success": true,
    //     "message": "تم تسجيل الدخول بنجاح",
    //     "data": {
    //         "token": "u22gU9JVUQ1WDJUoPKeh3VD1pPzp9K2UPhQcH2NEYAxxhNNEhiJm0CgFAjthmeKG",
    //         "username": "201156235709",
    //         "referralCode": "Dolphin7258",
    //         "name": "mohamed gad test",
    //         "gradeName": "الصف الثاني الابتدائي",
    //         "brothers": [],
    //         "profilePicture": null
    //     }
    // }
  }

  async register(userData) {
    const { data } = await api.post("/student/register", userData);
    return data;

    //     phoneNumber:201156235739
    // name:mohamed gad
    // grade:3
    // pinCode:111111

    // {
    //     "success": true,
    //     "message": "تم التسجيل بنجاح",
    //     "data": {
    //         "token": "adDoZdM2UO9uWz5pA1EKhFSOSTKGXBFleXxW2F5Wzawd1fBg7pgzd2y2vItemE9e",
    //         "username": "201156235739",
    //         "referralCode": "Dolphin8388",
    //         "name": "mohamed gad",
    //         "gradeName": "الصف الثاني الابتدائي",
    //         "brothers": [],
    //         "profilePicture": null,
    //         "checkPackage": false
    //     }
    // }
  }
  async verifyOtp(credentials) {
    console.log(credentials);
    const { data } = await api.post("/student/verify", credentials);
    return data;
  }
  async getProfile() {
    const { data } = await api.get("/auth/me");
    return data;
  }

  async logout() {
    // if your backend has logout endpoint, call it
    await api.post("/auth/logout");
    return true;
  }
}

// Singleton instance
export const authRepository = new AuthRepository();
