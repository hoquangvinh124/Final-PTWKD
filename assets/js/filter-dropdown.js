// Simple Filter Accordion Script
// Toggle accordion visibility
function toggleFilterDropdown(button) {
    const dropdown = button.parentElement;
    const content = dropdown.querySelector('.filter-dropdown-content');
    const isActive = button.classList.contains('active');
    
    // Toggle current accordion
    if (isActive) {
        content.classList.remove('show');
        button.classList.remove('active');
    } else {
        content.classList.add('show');
        button.classList.add('active');
    }
}

// Select filter option
function selectFilter(item, filterType) {
    const dropdown = item.closest('.filter-dropdown');
    const allItems = dropdown.querySelectorAll('.filter-dropdown-item');
    
    // Remove selected class from all items in this dropdown
    allItems.forEach(i => i.classList.remove('selected'));
    
    // Add selected class to clicked item
    item.classList.add('selected');
    
    // Get selected text
    const selectedText = item.textContent.trim();
    
    // Here you can add your filter logic
    console.log(`Filter ${filterType}: ${selectedText}`);
    
    // You can add your custom filter functionality here
    // For example: filterProducts(filterType, selectedText);
}
