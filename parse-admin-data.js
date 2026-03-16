import fs from 'fs';
import path from 'path';

function parseAdminData() {
    try {
        // Đọc file data.txt
        const dataContent = fs.readFileSync('data.txt', 'utf8');
        const lines = dataContent.split('\n').filter(line => line.trim());
        
        const adminMapping = {};
        const facebookLinks = [];
        
        // Bỏ qua header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Parse CSV line - format: STT,"Name","Admin URL""Facebook URL"
            const match = line.match(/^(\d+),"([^"]+)","([^"]+)"(.*)$/);
            if (!match) {
                console.log(`Không parse được dòng ${i + 1}: ${line}`);
                continue;
            }
            
            const [, stt, name, adminUrl, facebookPart] = match;
            
            // Extract Facebook URL nếu có
            let facebookUrl = null;
            if (facebookPart && facebookPart.includes('facebook.com')) {
                const fbMatch = facebookPart.match(/https:\/\/www\.facebook\.com\/profile\.php\?id=(\d+)/);
                if (fbMatch) {
                    facebookUrl = `https://www.facebook.com/profile.php?id=${fbMatch[1]}`;
                }
            }
            
            // Tạo mapping
            const adminData = {
                name: name,
                adminUrl: adminUrl,
                facebookUrl: facebookUrl,
                facebookId: facebookUrl ? facebookUrl.match(/id=(\d+)/)?.[1] : null
            };
            
            adminMapping[name] = adminData;
            
            if (facebookUrl) {
                facebookLinks.push({
                    name: name,
                    url: facebookUrl,
                    id: adminData.facebookId
                });
            }
        }
        
        // Ghi ra file mapping
        fs.writeFileSync('admin-facebook-mapping.json', JSON.stringify(adminMapping, null, 2));
        fs.writeFileSync('facebook-links-extracted.json', JSON.stringify(facebookLinks, null, 2));
        
        console.log(`✅ Đã parse ${Object.keys(adminMapping).length} admin`);
        console.log(`✅ Tìm thấy ${facebookLinks.length} Facebook links`);
        console.log(`✅ Đã tạo file: admin-facebook-mapping.json`);
        console.log(`✅ Đã tạo file: facebook-links-extracted.json`);
        
        return { adminMapping, facebookLinks };
        
    } catch (error) {
        console.error('❌ Lỗi:', error.message);
    }
}

// Chạy script
parseAdminData();