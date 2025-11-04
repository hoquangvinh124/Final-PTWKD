# Wishlist Pagination Guide

## Layout Configuration

### Grid Display
- **Desktop (default)**: 4 products per row
- **Tablet (max-width: 768px)**: 3 products per row  
- **Mobile (max-width: 576px)**: 2 products per row

### Pagination Settings
- **Items per page**: 8 products (2 rows × 4 columns on desktop)
- **Automatic**: Pagination hides when total products ≤ 8
- **Navigation**: Previous/Next buttons + numbered page buttons

## Features

### 1. Automatic Pagination
```javascript
const ITEMS_PER_PAGE = 8; // 2 rows × 4 columns
```
- Shows 8 products at a time
- Calculates total pages automatically
- Hides pagination if only 1 page needed

### 2. Navigation Controls
- **Previous Button (‹)**: Go to previous page
- **Page Numbers (1, 2, 3)**: Jump to specific page
- **Next Button (›)**: Go to next page

### 3. Active Page Indicator
- Current page button has pink background (#ff6468)
- Disabled buttons have reduced opacity (0.3)

## User Experience

### Example: 70 Products
- Total pages: 9 (70 ÷ 8 = 8.75, rounded up)
- Page 1: Products 1-8
- Page 2: Products 9-16
- Page 9: Products 65-70 (only 6 items)

### Empty State
If wishlist is empty:
- Shows heart icon with message
- "Browse Products" button links to homepage
- Pagination is hidden

## Technical Implementation

### JavaScript Functions
1. `renderWishlistPage(page)` - Renders products for specific page
2. `setupPagination()` - Initializes pagination controls
3. `updatePaginationButtons()` - Updates page number buttons
4. `updateNavigationButtons()` - Enables/disables prev/next
5. `hidePagination()` - Hides pagination when not needed

### State Management
```javascript
let currentPage = 1;           // Current page number
const ITEMS_PER_PAGE = 8;      // Products per page
let totalPages = 1;            // Total number of pages
let allWishlistItems = [];     // All wishlist products
```

### Responsive Behavior
- **Desktop**: 8 products (2 rows × 4 cols)
- **Tablet**: 6 products per page recommended for 3-column layout
- **Mobile**: 4 products per page recommended for 2-column layout

*Note: Currently ITEMS_PER_PAGE is fixed at 8. Future enhancement could make it responsive.*

## CSS Classes

### Pagination Container
```css
.step-nav-bar        /* Outer container */
.step-nav            /* Inner navigation */
.step-button         /* Page number buttons */
.step-button--control /* Prev/Next buttons */
.active              /* Active page indicator */
```

### Button States
- Default: Semi-transparent white background
- Hover: Lighter background, slight lift animation
- Active: Pink background (#ff6468)
- Disabled: 30% opacity

## Testing

### Test Scenarios
1. **Less than 8 products**: Pagination should be hidden
2. **Exactly 8 products**: Should show 1 page, pagination hidden
3. **9-16 products**: Should show 2 pages with working navigation
4. **70+ products**: Should show 9+ pages, all buttons work

### Browser Testing
- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- Mobile browsers: Touch-friendly buttons

## Future Enhancements
1. Make ITEMS_PER_PAGE responsive (8 desktop, 6 tablet, 4 mobile)
2. Add keyboard navigation (arrow keys)
3. Add "dots" for many pages (1 ... 5 6 7 ... 20)
4. Remember last visited page in localStorage
5. Add loading animation when changing pages

---

**Last Updated**: November 4, 2025  
**Version**: 1.0
