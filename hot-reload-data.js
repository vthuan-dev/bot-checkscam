import fs from 'fs';
import path from 'path';

/**
 * Hot reload admin mapping data
 */
export function reloadAdminMapping() {
    try {
        const mappingPath = path.join(process.cwd(), 'admin-facebook-mapping.json');
        
        if (!fs.existsSync(mappingPath)) {
            console.error('❌ Không tìm thấy file admin-facebook-mapping.json');
            return null;
        }
        
        // Clear require cache để force reload
        delete require.cache[mappingPath];
        
        const mappingData = fs.readFileSync(mappingPath, 'utf8');
        const adminMapping = JSON.parse(mappingData);
        
        console.log(`✅ Đã reload ${Object.keys(adminMapping).length} admin`);
        return adminMapping;
        
    } catch (error) {
        console.error('❌ Lỗi reload admin mapping:', error.message);
        return null;
    }
}

/**
 * Watch file changes và auto reload
 */
export function watchAdminMapping(callback) {
    const mappingPath = path.join(process.cwd(), 'admin-facebook-mapping.json');
    
    if (!fs.existsSync(mappingPath)) {
        console.error('❌ Không tìm thấy file để watch');
        return;
    }
    
    console.log('👀 Đang watch file admin-facebook-mapping.json...');
    
    fs.watchFile(mappingPath, (curr, prev) => {
        console.log('📁 File admin-facebook-mapping.json đã thay đổi');
        const newMapping = reloadAdminMapping();
        
        if (newMapping && callback) {
            callback(newMapping);
        }
    });
}

// Test
if (process.argv[1] && process.argv[1].endsWith('hot-reload-data.js')) {
    console.log('🧪 Test hot reload...');
    
    const mapping = reloadAdminMapping();
    if (mapping) {
        console.log(`✅ Loaded ${Object.keys(mapping).length} admin`);
    }
    
    // Test watch
    watchAdminMapping((newMapping) => {
        console.log(`🔄 Callback: Reloaded ${Object.keys(newMapping).length} admin`);
    });
    
    console.log('Thử edit file admin-facebook-mapping.json để test watch...');
}