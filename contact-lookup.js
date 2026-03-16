import fs from 'fs';

// Load admin contact mapping
let adminContactMapping = {};
try {
    const mappingData = fs.readFileSync('admin-contact-mapping.json', 'utf8');
    adminContactMapping = JSON.parse(mappingData);
} catch (error) {
    console.error('Không thể load admin contact mapping:', error.message);
}

/**
 * Tìm admin từ số điện thoại
 * @param {string} phone - Số điện thoại
 * @returns {object|null} - Admin info hoặc null nếu không tìm thấy
 */
export function findAdminByPhone(phone) {
    try {
        // Normalize phone number (remove spaces, dashes, etc.)
        const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
        
        for (const [adminName, adminData] of Object.entries(adminContactMapping)) {
            if (adminData.phone && adminData.phone.replace(/[\s\-\(\)]/g, '') === normalizedPhone) {
                return {
                    name: adminData.name,
                    adminUrl: adminData.adminUrl,
                    facebookUrl: adminData.facebookUrl,
                    phone: adminData.phone,
                    matchType: 'phone'
                };
            }
        }
        
        return null;
    } catch (error) {
        console.error('Lỗi khi tìm admin bằng phone:', error.message);
        return null;
    }
}

/**
 * Tìm admin từ số tài khoản ngân hàng
 * @param {string} bankAccount - Số tài khoản
 * @returns {object|null} - Admin info hoặc null nếu không tìm thấy
 */
export function findAdminByBankAccount(bankAccount) {
    try {
        // Normalize bank account (remove spaces, dashes, etc.)
        const normalizedAccount = bankAccount.replace(/[\s\-]/g, '');
        
        for (const [adminName, adminData] of Object.entries(adminContactMapping)) {
            if (adminData.bankAccounts) {
                for (const [bankName, accountNumber] of Object.entries(adminData.bankAccounts)) {
                    if (accountNumber.replace(/[\s\-]/g, '') === normalizedAccount) {
                        return {
                            name: adminData.name,
                            adminUrl: adminData.adminUrl,
                            facebookUrl: adminData.facebookUrl,
                            phone: adminData.phone,
                            matchType: 'bank',
                            matchedBank: bankName,
                            matchedAccount: accountNumber
                        };
                    }
                }
            }
        }
        
        return null;
    } catch (error) {
        console.error('Lỗi khi tìm admin bằng bank account:', error.message);
        return null;
    }
}

/**
 * Detect và tìm admin từ text (phone hoặc bank account)
 * @param {string} text - Text chứa phone hoặc bank account
 * @returns {object|null} - Admin info hoặc null nếu không tìm thấy
 */
export function findAdminByContact(text) {
    // Regex patterns - cải thiện để lọc chính xác
    const phonePattern = /(?:^|\s)((?:0|\+84)[0-9]{8,10})(?=\s|$)/g;
    const bankAccountPattern = /(?:^|\s)(\d{10,20})(?=\s|$)/g;
    
    // Tìm phone numbers
    const phoneMatches = [...text.matchAll(phonePattern)];
    if (phoneMatches.length > 0) {
        for (const match of phoneMatches) {
            const phone = match[1]; // Lấy captured group
            const result = findAdminByPhone(phone);
            if (result) return result;
        }
    }
    
    // Tìm bank accounts
    const bankMatches = [...text.matchAll(bankAccountPattern)];
    if (bankMatches.length > 0) {
        for (const match of bankMatches) {
            const account = match[1]; // Lấy captured group
            const result = findAdminByBankAccount(account);
            if (result) return result;
        }
    }
    
    return null;
}

/**
 * Format thông tin admin contact để hiển thị
 * @param {object} admin - Admin data với contact info
 * @returns {string} - Formatted string
 */
export function formatAdminContactInfo(admin) {
    let info = `🕵️ **FB Real của: "${admin.name}"**\n`;
    info += `🎖 GDV này có bảo hiểm tại Checkscam.vn\n`;
    info += `🔗 ${admin.adminUrl}\n`;
    
    if (admin.facebookUrl) {
        info += `📘 Facebook: ${admin.facebookUrl}\n`;
    }
    
    if (admin.phone) {
        info += `📱 Phone: ${admin.phone}\n`;
    }
    
    if (admin.matchType === 'phone') {
        info += `✅ **Xác nhận qua SĐT**`;
    } else if (admin.matchType === 'bank') {
        info += `✅ **Xác nhận qua STK ${admin.matchedBank}**`;
    }
    
    return info;
}

// Test function
if (process.argv[1] && process.argv[1].endsWith('contact-lookup.js')) {
    console.log('🧪 Testing Contact Lookup...\n');
    
    // Test phone
    console.log('=== Test Phone ===');
    const phoneResult = findAdminByPhone('0763666222');
    if (phoneResult) {
        console.log('✅ Found by phone:');
        console.log(formatAdminContactInfo(phoneResult));
    } else {
        console.log('❌ Not found by phone');
    }
    
    // Test bank account
    console.log('\n=== Test Bank Account ===');
    const bankResult = findAdminByBankAccount('0491000133345');
    if (bankResult) {
        console.log('✅ Found by bank account:');
        console.log(formatAdminContactInfo(bankResult));
    } else {
        console.log('❌ Not found by bank account');
    }
    
    // Test mixed text
    console.log('\n=== Test Mixed Text ===');
    const mixedText = 'Anh em check giúp số này: 0763666222 và stk 0491000133345';
    const mixedResult = findAdminByContact(mixedText);
    if (mixedResult) {
        console.log('✅ Found in mixed text:');
        console.log(formatAdminContactInfo(mixedResult));
    } else {
        console.log('❌ Not found in mixed text');
    }
}