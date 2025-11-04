/**
 * Wishlist Sample Data Generator
 * This script adds sample products to the wishlist for demonstration purposes
 */

// Import required functions
import { isAuthenticated } from './auth.js';
import { addToWishlist, getWishlist } from './user.js';

/**
 * Sample product IDs from different categories to add to wishlist
 * Expanded list with more products from each category
 */
const SAMPLE_PRODUCTS = [
    // Audio - CD (IDs 1-12)
    { id: '1', category: 'Audio', subcategory: 'CD' },
    { id: '2', category: 'Audio', subcategory: 'CD' },
    { id: '3', category: 'Audio', subcategory: 'CD' },
    { id: '4', category: 'Audio', subcategory: 'CD' },
    { id: '5', category: 'Audio', subcategory: 'CD' },
    { id: '6', category: 'Audio', subcategory: 'CD' },
    { id: '7', category: 'Audio', subcategory: 'CD' },
    { id: '10', category: 'Audio', subcategory: 'CD' },
    { id: '11', category: 'Audio', subcategory: 'CD' },
    { id: '12', category: 'Audio', subcategory: 'CD' },
    
    // Audio - Vinyl (IDs 13-24)
    { id: '13', category: 'Audio', subcategory: 'Vinyl' },
    { id: '14', category: 'Audio', subcategory: 'Vinyl' },
    { id: '16', category: 'Audio', subcategory: 'Vinyl' },
    { id: '17', category: 'Audio', subcategory: 'Vinyl' },
    { id: '18', category: 'Audio', subcategory: 'Vinyl' },
    { id: '19', category: 'Audio', subcategory: 'Vinyl' },
    { id: '20', category: 'Audio', subcategory: 'Vinyl' },
    { id: '21', category: 'Audio', subcategory: 'Vinyl' },
    { id: '22', category: 'Audio', subcategory: 'Vinyl' },
    { id: '23', category: 'Audio', subcategory: 'Vinyl' },
    
    // VHS (IDs 25-44)
    { id: '27', category: 'VHS', subcategory: '' },
    { id: '29', category: 'VHS', subcategory: '' },
    { id: '30', category: 'VHS', subcategory: '' },
    { id: '31', category: 'VHS', subcategory: '' },
    { id: '33', category: 'VHS', subcategory: '' },
    { id: '34', category: 'VHS', subcategory: '' },
    { id: '35', category: 'VHS', subcategory: '' },
    { id: '36', category: 'VHS', subcategory: '' },
    { id: '37', category: 'VHS', subcategory: '' },
    { id: '38', category: 'VHS', subcategory: '' },
    { id: '39', category: 'VHS', subcategory: '' },
    { id: '42', category: 'VHS', subcategory: '' },
    { id: '44', category: 'VHS', subcategory: '' },
    
    // Audio - Cassette (IDs 45-64)
    { id: '45', category: 'Audio', subcategory: 'Cassette' },
    { id: '46', category: 'Audio', subcategory: 'Cassette' },
    { id: '47', category: 'Audio', subcategory: 'Cassette' },
    { id: '48', category: 'Audio', subcategory: 'Cassette' },
    { id: '49', category: 'Audio', subcategory: 'Cassette' },
    { id: '50', category: 'Audio', subcategory: 'Cassette' },
    { id: '52', category: 'Audio', subcategory: 'Cassette' },
    { id: '53', category: 'Audio', subcategory: 'Cassette' },
    { id: '54', category: 'Audio', subcategory: 'Cassette' },
    { id: '55', category: 'Audio', subcategory: 'Cassette' },
    
    // Camera - Polaroid (IDs 65-84)
    { id: '65', category: 'Camera', subcategory: 'Polaroid' },
    { id: '66', category: 'Camera', subcategory: 'Polaroid' },
    { id: '67', category: 'Camera', subcategory: 'Polaroid' },
    { id: '68', category: 'Camera', subcategory: 'Polaroid' },
    { id: '69', category: 'Camera', subcategory: 'Polaroid' },
    { id: '70', category: 'Camera', subcategory: 'Polaroid' },
    { id: '71', category: 'Camera', subcategory: 'Polaroid' },
    { id: '72', category: 'Camera', subcategory: 'Polaroid' },
    
    // Accessory - Cassette Player (IDs 85-92)
    { id: '85', category: 'Accessory', subcategory: 'Cassette Player' },
    { id: '86', category: 'Accessory', subcategory: 'Cassette Player' },
    { id: '87', category: 'Accessory', subcategory: 'Cassette Player' },
    { id: '88', category: 'Accessory', subcategory: 'Cassette Player' },
    { id: '89', category: 'Accessory', subcategory: 'Cassette Player' },
    
    // Accessory - CD Player (IDs 93-100)
    { id: '93', category: 'Accessory', subcategory: 'CD Player' },
    { id: '94', category: 'Accessory', subcategory: 'CD Player' },
    { id: '95', category: 'Accessory', subcategory: 'CD Player' },
    { id: '96', category: 'Accessory', subcategory: 'CD Player' },
    
    // Accessory - iPod (IDs 101+)
    { id: '101', category: 'Accessory', subcategory: 'IPod' },
    { id: '102', category: 'Accessory', subcategory: 'IPod' },
    { id: '103', category: 'Accessory', subcategory: 'IPod' },
    { id: '104', category: 'Accessory', subcategory: 'IPod' },
];

/**
 * Load products from product.json
 */
async function loadProducts() {
    try {
        const response = await fetch('product.json');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

/**
 * Add sample products to wishlist
 */
export async function populateWishlistWithSamples() {
    if (!isAuthenticated()) {
        console.warn('User not authenticated. Cannot add sample products to wishlist.');
        return { success: false, reason: 'NOT_AUTHENTICATED' };
    }

    const currentWishlist = getWishlist();
    if (currentWishlist && currentWishlist.length > 0) {
        console.log('Wishlist already has items. Skipping sample data.');
        return { success: false, reason: 'WISHLIST_NOT_EMPTY' };
    }

    const allProducts = await loadProducts();
    if (!allProducts || allProducts.length === 0) {
        console.error('No products loaded from product.json');
        return { success: false, reason: 'NO_PRODUCTS_LOADED' };
    }

    let addedCount = 0;
    const errors = [];

    for (const sample of SAMPLE_PRODUCTS) {
        const product = allProducts.find(p => p.id === sample.id || p.id === String(sample.id));
        
        if (product) {
            const result = addToWishlist({
                id: product.id,
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image_front || product.image,
                category: product.category,
                subcategory: product.subcategory
            });

            if (result.success) {
                addedCount++;
                console.log(`✓ Added to wishlist: ${product.name}`);
            } else {
                errors.push({ id: sample.id, reason: result.reason });
                console.warn(`✗ Failed to add: ${product.name} - ${result.reason}`);
            }
        } else {
            errors.push({ id: sample.id, reason: 'PRODUCT_NOT_FOUND' });
            console.warn(`✗ Product not found: ID ${sample.id}`);
        }
    }

    console.log(`\n✓ Successfully added ${addedCount}/${SAMPLE_PRODUCTS.length} products to wishlist`);
    
    return {
        success: true,
        added: addedCount,
        total: SAMPLE_PRODUCTS.length,
        errors: errors
    };
}

/**
 * Auto-populate wishlist if empty (can be disabled in production)
 */
export function initializeWishlistSamples() {
    // Only run on user-profile page
    if (!window.location.pathname.includes('user-profile.html')) {
        return;
    }

    // Wait a bit to ensure auth is loaded
    setTimeout(async () => {
        if (isAuthenticated()) {
            const wishlist = getWishlist();
            if (!wishlist || wishlist.length === 0) {
                console.log('Wishlist is empty. Adding sample products...');
                await populateWishlistWithSamples();
                
                // Reload the wishlist display
                const { loadUserWishlist } = await import('./user-wishlist.js');
                if (loadUserWishlist) {
                    loadUserWishlist();
                }
            }
        }
    }, 500);
}

// Export for console testing
window.populateWishlistWithSamples = populateWishlistWithSamples;
