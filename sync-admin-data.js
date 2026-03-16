import fs from 'fs';
import axios from 'axios';

/**
 * Sync admin data từ CheckScam API hoặc CSV
 */
async function syncAdminData() {
    try {
        console.log('🔄 Đang sync admin data...');
        
        // Option 1: Từ CSV file (hiện tại)
        if (fs.existsSync('data.txt')) {
            console.log('📄 Đọc từ data.txt...');
            
            const dataContent = fs.readFileSync('data.txt', 'utf8');
            const lines = dataContent.split('\n').filter(line => line.trim());
            
            const adminMapping = {};
            
            // Parse data (giống logic trong parse-admin-data.js)
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const match = line.match(/^(\d+),"([^"]+)","([^"]+)"(.*)$/);
                if (!match) continue;
                
                const [, stt, name, adminUrl, facebookPart] = match;
                
                let facebookUrl = null;
                if (facebookPart && facebookPart.includes('facebook.com')) {
                    const fbMatch = facebookPart.match(/https:\/\/www\.facebook\.com\/profile\.php\?id=(\d+)/);
                    if (fbMatch) {
                        facebookUrl = `https://www.facebook.com/profile.php?id=${fbMatch[1]}`;
                    }
                }
                
                adminMapping[name] = {
                    name: name,
                    adminUrl: adminUrl,
                    facebookUrl: facebookUrl,
                    facebookId: facebookUrl ? facebookUrl.match(/id=(\d+)/)?.[1] : null,
                    lastUpdated: new Date().toISOString()
                };
            }
            
            // Ghi file mapping
            fs.writeFileSync('admin-facebook-mapping.json', JSON.stringify(adminMapping, null, 2));
            
            const totalAdmins = Object.keys(adminMapping).length;
            const adminsWithFacebook = Object.values(adminMapping).filter(admin => admin.facebookUrl).length;
            
            console.log(`✅ Sync thành công!`);
            console.log(`📊 Tổng admin: ${totalAdmins}`);
            console.log(`📘 Có Facebook: ${adminsWithFacebook}`);
            console.log(`📅 Cập nhật: ${new Date().toLocaleString('vi-VN')}`);
            
            return { totalAdmins, adminsWithFacebook };
        }
        
        // Option 2: Từ API (nếu có)
        // TODO: Implement API sync nếu CheckScam có API endpoint
        
    } catch (error) {
        console.error('❌ Lỗi sync data:', error.message);
        throw error;
    }
}

// Auto-run nếu gọi trực tiếp
if (process.argv[1] && process.argv[1].endsWith('sync-admin-data.js')) {
    syncAdminData();
}

export { syncAdminData };