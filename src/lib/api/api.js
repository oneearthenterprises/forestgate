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

  adminApi: `${API_BASE_URL}/api/admin/admin-login`,

  // rooms api
  GetAllRooms: `${API_BASE_URL}/Rooms/api/rooms`,
  getRoomById: `${API_BASE_URL}/Rooms/api/room`,

  // create rooms
  CreateRoom: `${API_BASE_URL}/Rooms/api/create-room`,
  UpdateRoom: (roomId) => `${API_BASE_URL}/Rooms/api/update-room/${roomId}`,
  DeleteRoom: (roomId) => `${API_BASE_URL}/Rooms/api/delete-room/${roomId}`,

  // video photo delete
  DeleteRoomImage: (roomId, imageId) =>
    `${API_BASE_URL}/Rooms/api/room/${roomId}/image/${imageId}`,
  DeleteRoomVideo: (roomId, videoId) =>
    `${API_BASE_URL}/Rooms/api/room/${roomId}/video/${videoId}`,
};

if (typeof window !== "undefined") {
  console.log("API OBJECT:", API);
}
