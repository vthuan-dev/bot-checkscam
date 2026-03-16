import fs from 'fs';

/**
 * Thêm admin contact info vào mapping
 */
function addAdminContact(adminName, contactInfo) {
    try {
        // Load existing mapping
        let adminContactMapping = {};
        if (fs.existsSync('admin-contact-mapping.json')) {
            const mappingData = fs.readFileSync('admin-contact-mapping.json', 'utf8');
            adminContactMapping = JSON.parse(mappingData);
        }
        
        // Add new admin
        adminContactMapping[adminName] = contactInfo;
        
        // Save back to file
        fs.writeFileSync('admin-contact-mapping.json', JSON.stringify(adminContactMapping, null, 2));
        
        console.log(`✅ Đã thêm contact info cho admin: ${adminName}`);
        return true;
        
    } catch (error) {
        console.error('❌ Lỗi khi thêm admin contact:', error.message);
        return false;
    }
}

// Example usage
if (process.argv[1] && process.argv[1].endsWith('add-admin-contact.js')) {
    console.log('📝 Add Admin Contact Info\n');
    
    // Example: Thêm admin khác
    const newAdmin = {
        name: "Khang Khang",
        adminUrl: "https://admin.checkscam.vn/khang-khang/",
        facebookUrl: "https://www.facebook.com/profile.php?id=100013965611470",
        phone: "0901234567", // Example phone
        bankAccounts: {
            "Vietcombank": "1234567890123",
            "Techcombank": "9876543210987"
        }
    };
    
    // Uncomment để thêm admin mới
    // addAdminContact("Khang Khang", newAdmin);
    
    console.log('Để thêm admin mới, uncomment code trong file này');
}

export { addAdminContact };