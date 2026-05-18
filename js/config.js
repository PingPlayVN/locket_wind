// [VIBECODE-PROJECT-NOTE]: MODULE CONFIG - Chứa các cấu hình hằng số, API Key, Token và Headers giả lập thiết bị iOS.
// Agent: Hãy cập nhật APP_CHECK_TOKEN tại đây nếu hệ thống báo lỗi 401/403.

const API_KEY = "AIzaSyCQngaaXQIfJaH0aS2l7REgIjD7nL431So";

// ⚠️ PASTE FULL CHUỖI APPCHECK VÀO ĐÂY:
const APP_CHECK_TOKEN = "eyJraWQiOiJrMnhhbUEiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxOjY0MTAyOTA3NjA4Mzppb3M6Y2M4ZWI0NjI5MGQ2OWIyMzRmYTYwNiIsImF1ZCI6WyJwcm9qZWN0cy82NDEwMjkwNzYwODMiLCJwcm9qZWN0cy9sb2NrZXQtNDI1MmEiXSwicHJvdmlkZXIiOiJkZXZpY2VfY2hlY2tfZGV2aWNlX2lkZW50aWZpY2F0aW9uIiwiaXNzIjoiaHR0cHM6Ly9maXJlYmFzZWFwcGNoZWNrLmdvb2dsZWFwaXMuY29tLzY0MTAyOTA3NjA4MyIsImV4cCI6MTc3OTA5NDEwNCwiaWF0IjoxNzc5MDkwNTA0LCJqdGkiOiJlQjh5UzNHb0c2VW1qRUp2bXFKa2VHRVVLa0lZbXJvX2ItNVQ5M09NZ1g4In0.4ITeSWHujyFVrQqeE4eODzjSjlyEykTwH9SVk_S2HbEwoeEOw3p0HtBje7QD4Fnyk-tymmCfY2sy5Oe1Etzsqeew3EfVyq3mMZyouGRQxbED8VKkn2Wse1idZb86h2LGGHoOy6JPom3mTI_5HtX8BBREeQLOjg5B0BPo7cHDDrHFjJcxTbiXgxYu3sZagwZp-hmj_qIN2iA7nDEc1vkB7p9KP48FuXL2TmOL-abAz9oZbwSBwqfHVbnGAUl50BPpHpyQbisKUcbzWJj-odMCDas6_7ab2xHg3O1AWSU_IuThqo6sQPz4omw-E4R5WlkxVvS_2m2g-O0LjLJqxoFVoYlMxpGg5eH1vj_yKzXHuTPACJHn8hgjhG6ih9x-FdtHym6CjOLdeLN584IlZqccT64OJo2t0z18FaOESXdJdpVRTHKtULCfZtFnpMoCYEyRp27GHiGXpu8m6pH1aBzEweTw_0pVefykdhyHJaAFjHnBXANwtRUYJnggD_1PP_kn"; 

const IOS_HEADERS = {
    'User-Agent': 'FirebaseAuth.iOS/12.9.0 com.locket.Locket/2.41.1 iPhone/15.8.7 hw/iPhone9_4',
    'X-Client-Version': 'iOS/FirebaseSDK/12.9.0/FirebaseCore-iOS',
    'X-Firebase-AppCheck': APP_CHECK_TOKEN,
    'X-Firebase-GMPID': '1:641029076083:ios:cc8eb46290d69b234fa606',
    'X-Ios-Bundle-Identifier': 'com.locket.Locket',
    'Content-Type': 'application/json'
};

// Device ID ảo
const DEVICE_ID = "AEFA24D5-26BA-4E1D-8346-60EF7F4576D0";

module.exports = {
    API_KEY,
    IOS_HEADERS,
    DEVICE_ID
};