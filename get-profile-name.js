const axios = require('axios');
require('dotenv').config();

async function getFacebookProfileName(profileId) {
    // Cần access token từ Facebook App
    const accessToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
    
    try {
        const response = await axios.get(`https://graph.facebook.com/v18.0/${profileId}`, {
            params: {
                fields: 'name',
                access_token: accessToken
            }
        });
        
        console.log(`Profile ID: ${profileId}`);
        console.log(`Name: ${response.data.name}`);
        return response.data.name;
        
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        
        // Nếu không có quyền truy cập, thử cách khác
        if (error.response?.data?.error?.code === 803) {
            console.log('Profile này có thể đã ẩn thông tin hoặc cần quyền truy cập đặc biệt');
        }
        
        return null;
    }
}

// Test với ID bạn đưa
const profileId = '100055769731582';
getFacebookProfileName(profileId);