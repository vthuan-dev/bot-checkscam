import fs from 'fs';

// Load admin mapping
let adminMapping = {};
try {
    const mappingData = fs.readFileSync('admin-facebook-mapping.json', 'utf8');
    adminMapping = JSON.parse(mappingData);
} catch (error) {
    console.error('Không thể load admin mapping:', error.message);
}

/**
 * Tìm admin từ Facebook URL
 * @param {string} facebookUrl - Facebook profile URL
 * @returns {object|null} - Admin info hoặc null nếu không tìm thấy
 */
export function findAdminByFacebookUrl(facebookUrl) {
    try {
        // Extract Facebook ID từ URL
        const idMatch = facebookUrl.match(/(?:profile\.php\?id=|facebook\.com\/)(\d+)/);
        if (!idMatch) {
            return null;
        }
        
        const facebookId = idMatch[1];
        
        // Tìm admin có Facebook ID tương ứng
        for (const [adminName, adminData] of Object.entries(adminMapping)) {
            if (adminData.facebookId === facebookId) {
                return {
                    name: adminData.name,
                    adminUrl: adminData.adminUrl,
                    facebookUrl: adminData.facebookUrl,
                    facebookId: adminData.facebookId
                };
            }
        }
        
        return null;
    } catch (error) {
        console.error('Lỗi khi tìm admin:', error.message);
        return null;
    }
}

/**
 * Tìm admin từ tên (fuzzy search)
 * @param {string} name - Tên admin cần tìm
 * @returns {array} - Danh sách admin phù hợp
 */
export function findAdminByName(name) {
    const results = [];
    const searchName = name.toLowerCase().trim();
    
    for (const [adminName, adminData] of Object.entries(adminMapping)) {
        const adminNameLower = adminName.toLowerCase();
        
        // Exact match
        if (adminNameLower === searchName) {
            results.unshift(adminData); // Đưa lên đầu
        }
        // Contains match
        else if (adminNameLower.includes(searchName) || searchName.includes(adminNameLower)) {
            results.push(adminData);
        }
    }
    
    return results.slice(0, 5); // Giới hạn 5 kết quả
}

/**
 * Lấy tất cả admin có Facebook
 * @returns {array} - Danh sách admin có Facebook
 */
export function getAllAdminsWithFacebook() {
    return Object.values(adminMapping).filter(admin => admin.facebookUrl);
}

/**
 * Format thông tin admin để hiển thị
 * @param {object} admin - Admin data
 * @returns {string} - Formatted string
 */
export function formatAdminInfo(admin) {
    let info = `👤 **${admin.name}**\n`;
    info += `🔗 Admin: ${admin.adminUrl}\n`;
    if (admin.facebookUrl) {
        info += `📘 Facebook: ${admin.facebookUrl}`;
    }
    return info;
}

// Test function
if (process.argv[1] && process.argv[1].endsWith('facebook-admin-lookup.js')) {
    // Test với URL có trong data
    const testUrl = 'https://www.facebook.com/profile.php?id=100013965611470'; // Khang Khang
    const result = findAdminByFacebookUrl(testUrl);
    
    if (result) {
        console.log('✅ Tìm thấy admin:');
        console.log(formatAdminInfo(result));
    } else {
        console.log('❌ Không tìm thấy admin với URL này');
    }
    
    // Test search by name
    console.log('\n--- Test search by name ---');
    const nameResults = findAdminByName('Khang');
    nameResults.forEach(admin => {
        console.log(formatAdminInfo(admin));
        console.log('---');
    });
}