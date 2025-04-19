// const BASE_URL = 'https://rental-website-backend.onrender.com';
const BASE_URL = 'https://rental-website-backend-1.onrender.com';
// const BASE_URL = 'http://localhost:5000'
// 
// Export all API endpoints as constants
const API_URLS = {
  FETCH_GAME: `${BASE_URL}/fetch/game`,
  LEND_GAME: `${BASE_URL}/games/lend`,
  FETCH_ALL_GAMES: `${BASE_URL}/games/all-games`,
  FETCH_USER_LENDED_GAMES: `${BASE_URL}/games/user-lended-games`,
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  UPDATE_GAME: `${BASE_URL}/games/update`,
  UPLOADS: `${BASE_URL}/uploads`,
  VERIFY_EMAIL: `${BASE_URL}/verifyEmail`,
  VERIFY_OTP: `${BASE_URL}/verifyOtp`,
  DELETE_ACCOUNT: `${BASE_URL}/deleteAccount`,
  UPDATE_INFO: `${BASE_URL}/user/settings`,
  UPDATE_PASSWORD: `${BASE_URL}/changepassword`,
  FETCH_USER_INFO: `${BASE_URL}/getUser`,
  FETCH_USER_RATING: `${BASE_URL}/user/ratings`,
  GOOGLE_OAUTH_EMAIL: `${BASE_URL}/auth/google/checkemail`,
  GOOGLE_OAUTH_REGISTER: `${BASE_URL}/auth/google/register`,
  FETCH_LENDER_DATA: `${BASE_URL}/games/lender-data`,
  FETCH_USER_DATA: `${BASE_URL}/user/userinfo`,
  RENT_GAME: `${BASE_URL}/rent`,
  FETCH_RENTED_GAMES: `${BASE_URL}/all-rented-games`,
  RATE_USER: `${BASE_URL}/rate-user`,
};

export default API_URLS;
