const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API = {
  // Auth api
  register: `${API_BASE_URL}/Auth/api/register`,
  login: `${API_BASE_URL}/Auth/api/login`,
  logout: `${API_BASE_URL}/Auth/api/logout`,
  verifyOtpRegister: `${API_BASE_URL}/Auth/api/verify-otp-register`,
  forgotPassword: `${API_BASE_URL}/Auth/api/forgot-password`,
  resetPassword: `${API_BASE_URL}/Auth/api/reset-password`,
  verifyOtp: `${API_BASE_URL}/Auth/api/verify-otp`,
  resendForgotOtp: `${API_BASE_URL}/Auth/api/resend-forgot-otp`,

  adminApi: `${API_BASE_URL}/api/admin/admin-login`,
  getAllUsers: `${API_BASE_URL}/Auth/api/users`,
  updateUser: (id) => `${API_BASE_URL}/Auth/api/update-user/${id}`,
  deleteUser: (id) => `${API_BASE_URL}/Auth/api/delete-user/${id}`,
  getProfile: `${API_BASE_URL}/Auth/api/me`,
  updateProfile: `${API_BASE_URL}/Auth/api/update-profile`,

  // rooms api
  GetAllRooms: `${API_BASE_URL}/Rooms/api/rooms`,
  // getRoomById: `${API_BASE_URL}/Rooms/api/room`,
  getRoomById: (roomId) => `${API_BASE_URL}/Rooms/api/room/${roomId}`,

  // create rooms
  CreateRoom: `${API_BASE_URL}/Rooms/api/create-room`,
  UpdateRoom: (roomId) => `${API_BASE_URL}/Rooms/api/update-room/${roomId}`,
  DeleteRoom: (roomId) => `${API_BASE_URL}/Rooms/api/delete-room/${roomId}`,

  // video photo delete
  DeleteRoomImage: (roomId, imageId) =>
    `${API_BASE_URL}/Rooms/api/room/${roomId}/image/${imageId}`,
  DeleteRoomVideo: (roomId, videoId) =>
    `${API_BASE_URL}/Rooms/api/room/${roomId}/video/${videoId}`,

  // contactus
  ContactUsPost: `${API_BASE_URL}/Contact/api/create-contact`,
  ContactUsGet: `${API_BASE_URL}/Contact/api/contacts`,
  replyToContact: `${API_BASE_URL}/Contact/api/reply-contact`,

  // booking api
  CreateBooking: `${API_BASE_URL}/Booking/api/create-booking`,
  GetBooking: `${API_BASE_URL}/Booking/api/bookings`,
  GetUserHistory: (email) => `${API_BASE_URL}/Booking/api/user-history/${email}`,

  GetBookingById: (bookingId) =>
    `${API_BASE_URL}/Booking/api/booking/${bookingId}`,
  CancelBooking: (bookingId) =>
    `${API_BASE_URL}/Booking/api/cancel-booking/${bookingId}`,
  UpdateBookingStatus: (bookingId) =>
    `${API_BASE_URL}/Booking/api/update-status/${bookingId}`,
  UpdateBooking: (bookingId) =>
    `${API_BASE_URL}/Booking/api/update-booking/${bookingId}`,
  DeleteBooking: (bookingId) =>
    `${API_BASE_URL}/Booking/api/delete-booking/${bookingId}`,

  // forgate password api
  forgotPassword: `${API_BASE_URL}/Auth/api/forgot-password`,
  verifyOtp: `${API_BASE_URL}/Auth/api/verify-otp`,
  resetPassword: `${API_BASE_URL}/Auth/api/reset-password`,
  resendOtp: `${API_BASE_URL}/Auth/api/resend-forgot-otp`,
  newsletteremail: `${API_BASE_URL}/api/newsletter/newsletteremail`,
  getnewsletter: `${API_BASE_URL}/api/newsletter/getnewsletter`,
  sendnewsletter: `${API_BASE_URL}/api/newsletter/send`,

  // welcome popup api
  GetWelcomePopup: `${API_BASE_URL}/api/welcome-popup`,
  UpdateWelcomePopup: `${API_BASE_URL}/api/welcome-popup`,
};

if (typeof window !== "undefined") {
  console.log("API OBJECT:", API);
}
