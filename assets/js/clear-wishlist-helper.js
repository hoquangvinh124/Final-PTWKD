/**
 * Clear Old Wishlist Data - Utility Script
 * Use this to clean up old/invalid wishlist items
 */

console.log('🧹 Wishlist Cleanup Utility');
console.log('============================\n');

// Check if user is logged in
const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
if (!currentUser) {
    console.error('❌ No user logged in. Please login first.');
} else {
    console.log(`✓ Current user: ${currentUser.username}\n`);
    
    // Get all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex !== -1) {
        const wishlist = users[userIndex].wishlist || [];
        console.log(`📋 Current wishlist has ${wishlist.length} items\n`);
        
        if (wishlist.length > 0) {
            console.log('Current items:');
            wishlist.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.name || 'Unknown'} (ID: ${item.id || item.productId || 'N/A'})`);
            });
            
            console.log('\n🗑️  To clear ALL wishlist items, run:');
            console.log('clearWishlist()\n');
            
            console.log('🔄 To remove old items and reload with fresh data, run:');
            console.log('await reloadWishlistWithFreshData()\n');
        } else {
            console.log('✓ Wishlist is already empty\n');
            console.log('To add sample products, run:');
            console.log('await populateWishlistWithSamples()\n');
        }
    } else {
        console.error('❌ User not found in database');
    }
}

// Helper function to clear wishlist
window.clearWishlist = function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
        console.error('❌ No user logged in');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex !== -1) {
        users[userIndex].wishlist = [];
        users[userIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('users', JSON.stringify(users));
        console.log('✅ Wishlist cleared successfully!');
        console.log('Reloading page...');
        setTimeout(() => location.reload(), 500);
    }
};

// Helper function to reload with fresh data
window.reloadWishlistWithFreshData = async function() {
    console.log('🔄 Clearing old data...');
    clearWishlist();
    
    // Wait for page reload, then populate will happen automatically
    console.log('✅ Page will reload and fresh data will be loaded automatically');
};

console.log('============================');
console.log('💡 Commands available:');
console.log('  - clearWishlist()');
console.log('  - reloadWishlistWithFreshData()');
console.log('  - populateWishlistWithSamples()');
