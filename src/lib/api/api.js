const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;




export const API = {

    // Auth api
    register: `${API_BASE_URL}/Auth/api/register`,
    login: `${API_BASE_URL}/Auth/api/login`,
    logout: `${API_BASE_URL}/Auth/api/logout`,
    forgotPassword: `${API_BASE_URL}/Auth/api/forgot-password`,
    resetPassword: `${API_BASE_URL}/Auth/api/reset-password`,
    verifyOtp: `${API_BASE_URL}/Auth/api/verify-otp`,
    resendForgotOtp: `${API_BASE_URL}/Auth/api/resend-forgot-otp`,





}





if (typeof window !== "undefined") {
    console.log("API OBJECT:", API);
}