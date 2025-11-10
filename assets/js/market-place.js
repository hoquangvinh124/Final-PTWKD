// Import auth functions
import { getCurrentUser, isAuthenticated } from './auth.js';

// LocalStorage key for marketplace products
const MARKETPLACE_PRODUCTS_KEY = 'marketplace.products';

// Default products (admin products - no seller info, cannot be deleted)
const DEFAULT_PRODUCTS = [
  { id: "test-1", category: "Audio", format: "CD", name: "Mac DeMarco – This Old Dog CD", price: "375.000₫", priceValue: 375000, image: "assets/images/Audio/CD/1.jpg" },
  { id: "test-2", category: "Audio", format: "CD", name: "Mac DeMarco – 2 CD", price: "375.000₫", priceValue: 375000, image: "assets/images/Audio/CD/2.jpg" },
  { id: "test-3", category: "Audio", format: "CD", name: "Mac DeMarco – Salad Days CD", price: "375.000₫", priceValue: 375000, image: "assets/images/Audio/CD/3.jpg" },
  { category: "Audio", format: "CD", name: "Bright Eyes – Fevers and Mirrors CD", price: "349.000₫", priceValue: 349000, image: "assets/images/Audio/CD/4.jpg" },
  { category: "Audio", format: "CD", name: "Khruangbin & Leon Bridges – Texas Moon CD", price: "402.000₫", priceValue: 402000, image: "assets/images/Audio/CD/5.jpg" },
  { category: "Audio", format: "CD", name: "Charli XCX – Brat CD", price: "402.000₫", priceValue: 402000, image: "assets/images/Audio/CD/6.jpg" },
  { category: "Audio", format: "CD", name: "Lorde – Pure Heroine CD", price: "402.000₫", priceValue: 402000, image: "assets/images/Audio/CD/7.jpg" },
  { category: "Audio", format: "CD", name: "Phoebe Bridgers – Punisher CD", price: "398.000₫", priceValue: 398000, image: "assets/images/Audio/CD/8.jpg" },
  { category: "Audio", format: "CD", name: "Fleetwood Mac – Rumours CD", price: "420.000₫", priceValue: 420000, image: "assets/images/Audio/CD/9.jpg" },
  { category: "Audio", format: "CD", name: "The Strokes – Is This It CD", price: "375.000₫", priceValue: 375000, image: "assets/images/Audio/CD/10.jpg" },
  { category: "Audio", format: "CD", name: "Tame Impala – Currents CD", price: "430.000₫", priceValue: 430000, image: "assets/images/Audio/CD/11.jpg" },
  { category: "Audio", format: "CD", name: "Billie Eilish – Happier Than Ever CD", price: "410.000₫", priceValue: 410000, image: "assets/images/Audio/CD/12.jpg" },
  { category: "Audio", format: "Vinyl", name: "Daft Punk – Discovery Vinyl", price: "680.000₫", priceValue: 680000, image: "assets/images/Audio/Vinyl/1.jpg" },
  { category: "Audio", format: "Vinyl", name: "Pink Floyd – The Wall Vinyl", price: "720.000₫", priceValue: 720000, image: "assets/images/Audio/Vinyl/2.jpg" },
  { category: "Audio", format: "Vinyl", name: "Radiohead – OK Computer Vinyl", price: "640.000₫", priceValue: 640000, image: "assets/images/Audio/Vinyl/3.jpg" },
  { category: "Audio", format: "Vinyl", name: "Nirvana – Nevermind Vinyl", price: "590.000₫", priceValue: 590000, image: "assets/images/Audio/Vinyl/4.jpg" },
  { category: "Cassette Tape", format: "Cassette", name: "City Pop Classics Vol.1", price: "520.000₫", priceValue: 520000, image: "assets/images/Cassette%20Tape/1.jpg" },
  { category: "Cassette Tape", format: "Cassette", name: "Synthwave Archive 1986", price: "485.000₫", priceValue: 485000, image: "assets/images/Cassette%20Tape/2.jpg" },
  { category: "Cassette Tape", format: "Cassette", name: "Indie Summer Sessions", price: "450.000₫", priceValue: 450000, image: "assets/images/Cassette%20Tape/3.jpg" },
  { category: "Cassette Tape", format: "Cassette", name: "Lo-Fi Chill Tape", price: "410.000₫", priceValue: 410000, image: "assets/images/Cassette%20Tape/4.jpg" },
  { category: "Cassette Tape", format: "Cassette", name: "Jazz Standards Vol.2", price: "435.000₫", priceValue: 435000, image: "assets/images/Cassette Tape/5.jpg" },
  { category: "Cassette Tape", format: "Cassette", name: "City Pop Classics Vol.2", price: "530.000₫", priceValue: 530000, image: "assets/images/Cassette Tape/6.jpg" },
  { category: "Cassette Tape", format: "Cassette", name: "Dreamwave Nights 1988", price: "495.000₫", priceValue: 495000, image: "assets/images/Cassette Tape/7.jpg" },
  { category: "Cassette Tape", format: "Cassette", name: "Soulful Evenings Mix", price: "445.000₫", priceValue: 445000, image: "assets/images/Cassette Tape/8.jpg" },
  { category: "Accessories", format: "Device", name: "Sony Discman D-50", price: "3.850.000₫", priceValue: 3850000, image: "assets/images/Accessories/CD%20Player/1.jpg" },
  { category: "Accessories", format: "Device", name: "Nakamichi Walkman Sport", price: "4.200.000₫", priceValue: 4200000, image: "assets/images/Accessories/Cassette%20Player/1.jpg" },
  { category: "Accessories", format: "Device", name: "iPod Classic 5.5 Gen", price: "2.600.000₫", priceValue: 2600000, image: "assets/images/Accessories/IPod/1.jpg" },
  { category: "Accessories", format: "Device", name: "Retro Boombox 1988", price: "5.450.000₫", priceValue: 5450000, image: "assets/images/Accessories/CD%20Player/2.jpg" },
  { category: "Pola Camera", format: "Device", name: "Polaroid 600 Spice Girls Edition", price: "3.900.000₫", priceValue: 3900000, image: "assets/images/Pola%20Camera/1.jpg" },
  { category: "Pola Camera", format: "Device", name: "Polaroid OneStep Autumn", price: "3.250.000₫", priceValue: 3250000, image: "assets/images/Pola%20Camera/2.jpg" },
  { category: "Pola Camera", format: "Device", name: "Polaroid Sun 600 LMS", price: "4.050.000₫", priceValue: 4050000, image: "assets/images/Pola%20Camera/3.jpg" },
  { category: "Pola Camera", format: "Device", name: "Polaroid Land Camera 1000", price: "4.500.000₫", priceValue: 4500000, image: "assets/images/Pola%20Camera/4.jpg" },
  { category: "VHS", format: "Device", name: "Star Wars Trilogy VHS Boxset", price: "1.650.000₫", priceValue: 1650000, image: "assets/images/VHS/1.jpg" },
  { category: "VHS", format: "Device", name: "Blade Runner Director's Cut", price: "790.000₫", priceValue: 790000, image: "assets/images/VHS/2.jpg" },
  { category: "VHS", format: "Device", name: "Back To The Future VHS", price: "720.000₫", priceValue: 720000, image: "assets/images/VHS/3.jpg" },
  { category: "VHS", format: "Device", name: "Akira Collector's VHS", price: "980.000₫", priceValue: 980000, image: "assets/images/VHS/4.jpg" },
  { category: "VHS", format: "Device", name: "Jurassic Park Special Edition", price: "850.000₫", priceValue: 850000, image: "assets/images/VHS/5.jpg" },
  { category: "VHS", format: "Device", name: "Ghostbusters Original VHS", price: "780.000₫", priceValue: 780000, image: "assets/images/VHS/6.jpg" }
];

/**
 * Load products from localStorage, merge with default products
 */
function loadProducts() {
  try {
    const stored = localStorage.getItem(MARKETPLACE_PRODUCTS_KEY);
    if (!stored) return [...DEFAULT_PRODUCTS];
    
    const userProducts = JSON.parse(stored);
    // Merge: user-created products first (newest first), then default products
    return [...userProducts, ...DEFAULT_PRODUCTS];
  } catch (err) {
    console.warn('Failed to load marketplace products:', err);
    return [...DEFAULT_PRODUCTS];
  }
}

/**
 * Save user-created products to localStorage (not including default products)
 */
function saveProducts(allProducts) {
  try {
    // Only save user-created products (those with sellerUsername)
    const userProducts = allProducts.filter(p => p.sellerUsername);
    localStorage.setItem(MARKETPLACE_PRODUCTS_KEY, JSON.stringify(userProducts));
  } catch (err) {
    console.error('Failed to save marketplace products:', err);
  }
}

/**
 * Check if current user can delete a product
 */
function canDeleteProduct(product) {
  if (!isAuthenticated()) return false;
  
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  // Can only delete if product was created by current user
  return product.sellerUsername === currentUser.username;
}

// Initialize products from localStorage
let products = loadProducts();

const filterButtons = document.querySelectorAll(".filter-section button");
const activeFilters = {
  category: document.querySelector("button[data-filter-type='category'].active")?.dataset.filterValue || "All",
  price: document.querySelector("button[data-filter-type='price'].active")?.dataset.filterValue || "all",
  format: document.querySelector("button[data-filter-type='format'].active")?.dataset.filterValue || "all",
  owner: document.querySelector("button[data-filter-type='owner'].active")?.dataset.filterValue || "all"
};

const detailModal = document.getElementById("productDetail");
const detailImage = document.getElementById("detailImage");
const detailTitle = document.getElementById("detailTitle");
const detailPrice = document.getElementById("detailPrice");
const detailLocation = document.getElementById("detailLocation");
const detailCondition = document.getElementById("detailCondition");
const detailBrand = document.getElementById("detailBrand");
const detailFormat = document.getElementById("detailFormat");
const detailDescription = document.getElementById("detailDescription");
const detailFeatures = document.getElementById("detailFeatures");
const detailContactSection = document.getElementById("detailContactSection");
const detailContactLinks = document.getElementById("detailContactLinks");
const closeDetailTargets = detailModal?.querySelectorAll("[data-detail-close]") || [];

const defaultLocation = "District 7, HCMC";
const defaultCondition = "Used - Like New";

function deriveBrand(item) {
  if (item.brand) return item.brand;
  const parts = item.name.split("–");
  return parts.length > 1 ? parts[0].trim() : item.category;
}

const categoryDescriptions = {
  "Audio": "Carefully selected version for analog players, ensuring clean discs and studio-quality sound.",
  "Cassette Tape": "Cassette tapes recorded and Dolby-calibrated to standard, with heads cleaned before delivery.",
  "Accessories": "Devices inspected by LDIE technicians, 6-month warranty, works great for retro setups.",
  "Pola Camera": "Polaroid cameras with stable film exposure, includes test film and detailed instructions.",
  "VHS": "VHS tapes in original box, rewound and stored in moisture-proof bags before delivery."
};

const categoryFeatures = {
  "Audio": [
    "Includes original box and booklet",
    "Disc checked for scratches",
    "Nationwide shipping within 24 hours"
  ],
  "Cassette Tape": [
    "Tape calibrated to Dolby standard",
    "Cleaned and lubricated mechanism",
    "Complimentary protective acrylic case"
  ],
  "Accessories": [
    "6-month warranty at LDIE Zone",
    "Cleaned, worn parts replaced",
    "Detailed usage instructions provided"
  ],
  "Pola Camera": [
    "Complimentary 1 pack i-Type film",
    "Flash and sensor fully tested",
    "Includes anti-scratch fabric pouch"
  ],
  "VHS": [
    "Tape rewound and stored in moisture-proof box",
    "Includes printed Vietnamese subtitles",
    "Guaranteed stable playback on all VHS players"
  ]
};

let currentPage = 1;

const productGrid = document.getElementById("productGrid");
const pagination = document.querySelector(".products-pagination");
const pageLinks = pagination.querySelectorAll("[data-page]");
const prevBtn = pagination.querySelector("[data-action='prev']");
const nextBtn = pagination.querySelector("[data-action='next']");
const catalogSearchInput = document.getElementById("catalogSearchInput");

let searchQuery = "";

function matchesCategory(item) {
  return activeFilters.category === "All" || item.category === activeFilters.category;
}

function matchesFormat(item) {
  if (activeFilters.format === "all") return true;
  return item.format === activeFilters.format;
}

function matchesPrice(item) {
  const value = item.priceValue;
  switch (activeFilters.price) {
    case "under-500":
      return value < 500000;
    case "500-1000":
      return value >= 500000 && value < 1000000;
    case "1000-3000":
      return value >= 1000000 && value < 3000000;
    case "above-3000":
      return value >= 3000000;
    default:
      return true;
  }
}

function matchesSearch(item) {
  if (!searchQuery) return true;
  const query = searchQuery.toLowerCase();
  return (
    item.name.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query) ||
    item.format.toLowerCase().includes(query) ||
    (item.brand && item.brand.toLowerCase().includes(query))
  );
}

function matchesOwner(item) {
  if (!isAuthenticated()) {
    // If not logged in, show all products
    return activeFilters.owner === "all";
  }
  
  const currentUser = getCurrentUser();
  if (!currentUser) return activeFilters.owner === "all";
  
  if (activeFilters.owner === "all") return true;
  if (activeFilters.owner === "my") {
    // My products are those created by current user
    return item.sellerUsername === currentUser.username;
  }
  if (activeFilters.owner === "others") {
    // Others' products are those not created by current user (or default products)
    return !item.sellerUsername || item.sellerUsername !== currentUser.username;
  }
  return true;
}

function getFilteredProducts() {
  return products.filter(item => 
    matchesCategory(item) && 
    matchesFormat(item) && 
    matchesPrice(item) && 
    matchesSearch(item) &&
    matchesOwner(item)
  );
}

function getTotalPages() {
  const count = getFilteredProducts().length;
  return Math.max(1, Math.ceil(count / 12));
}

function getPageItems(page) {
  const start = (page - 1) * 12;
  return getFilteredProducts().slice(start, start + 12);
}

function renderProducts(page) {
  const fragment = document.createDocumentFragment();
  const items = getPageItems(page);

  if (items.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "catalog-empty";
    emptyState.innerHTML = `<p>No matching products found.</p>`;
    fragment.appendChild(emptyState);
  }

  items.forEach(item => {
    const card = document.createElement("article");
    card.className = "product-card";
    
    // Check if current user can delete this product
    const canDelete = canDeleteProduct(item);
    const deleteBtn = canDelete ? `
      <button class="product-delete-btn" data-product-id="${item.id}" title="Delete product">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    ` : '';
    
    card.innerHTML = `
      ${deleteBtn}
      <div class="product-thumb" data-product-view>
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="product-meta">
        <span class="product-category">${item.category}</span>
        <h3 data-product-view>${item.name}</h3>
        <span class="price">${item.price}</span>
      </div>
    `;
    card.tabIndex = 0;

    if (canDelete) {
      const deleteButton = card.querySelector(".product-delete-btn");
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        openDeleteConfirm(item.id);
      });
    }

    card.addEventListener("click", (e) => {
      if (!e.target.closest(".product-delete-btn")) {
        openProductDetail(item);
      }
    });
    
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProductDetail(item);
      }
    });
    fragment.appendChild(card);
  });

  productGrid.innerHTML = "";
  productGrid.appendChild(fragment);
}

function updatePagination(page, total) {
  pageLinks.forEach(link => {
    const linkPage = Number(link.dataset.page);
    link.classList.toggle("active", linkPage === page);
    link.classList.toggle("hidden", linkPage > total);
  });
  prevBtn.disabled = page === 1;
  nextBtn.disabled = page === total;
}

function goToPage(page) {
  const total = getTotalPages();
  if (page < 1 || page > total) return;
  currentPage = page;
  renderProducts(currentPage);
  updatePagination(currentPage, total);
}

pageLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    const page = Number(link.dataset.page);
    goToPage(page);
  });
});

prevBtn.addEventListener("click", () => {
  goToPage(currentPage - 1);
});

nextBtn.addEventListener("click", () => {
  goToPage(currentPage + 1);
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const type = button.dataset.filterType;
    if (!type) return;

    const section = button.closest(".filter-section");
    section?.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    activeFilters[type] = button.dataset.filterValue;
    goToPage(1);
  });
});

let searchTimeout;
catalogSearchInput?.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchQuery = e.target.value.trim();
    goToPage(1);
  }, 300); // Debounce 300ms
});

function getDescription(item) {
  return item.description || categoryDescriptions[item.category] || "Product carefully curated and officially warranted at LDIE Zone.";
}

function getFeatureList(item) {
  return item.features || categoryFeatures[item.category] || [];
}

function handleBuyProduct(item) {
  alert(`Added "${item.name}" to cart!\nPrice: ${item.price}`);
  
  console.log("Product added to cart:", item);
}

function handleBuyNow(item) {
  const contactSection = document.getElementById("detailContactSection");
  
  if (item.contact && contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    contactSection.style.animation = 'pulse 0.5s ease';
    setTimeout(() => {
      contactSection.style.animation = '';
    }, 500);

    if (!item.contact.phone && !item.contact.zalo && !item.contact.messenger && 
        !item.contact.instagram && !item.contact.threads) {
      alert(`To purchase "${item.name}", please contact the seller.\n\nContact information not available for this product.`);
    }
  } else {
    alert(`To purchase "${item.name}", please contact the seller.\n\nContact: District 7, HCMC\nPrice: ${item.price}`);
  }
  
  console.log("Buy now - showing contact info:", item);
}

function openProductDetail(item) {
  if (!detailModal) return;
  detailImage.src = item.image;
  detailImage.alt = item.name;
  detailTitle.textContent = item.name;
  detailPrice.textContent = item.price;
  detailLocation.textContent = item.location || defaultLocation;
  detailCondition.textContent = item.condition || defaultCondition;
  detailBrand.textContent = deriveBrand(item);
  detailFormat.textContent = item.format;
  detailDescription.textContent = getDescription(item);
  const features = getFeatureList(item);
  detailFeatures.innerHTML = features.map(feature => `<li>${feature}</li>`).join("");
  
  // Display contact info if available
  const contactFacebook = document.getElementById("contactFacebook");
  const contactInstagram = document.getElementById("contactInstagram");
  const contactZalo = document.getElementById("contactZalo");
  const contactThreads = document.getElementById("contactThreads");
  const contactPhone = document.getElementById("contactPhone");
  
  if (item.contact && detailContactSection && detailContactLinks) {
    // Update icon links - always show icons, just update href
    if (item.contact.messenger && contactFacebook) {
      contactFacebook.href = item.contact.messenger;
    } else if (contactFacebook) {
      contactFacebook.href = "#";
      contactFacebook.onclick = (e) => e.preventDefault();
    }
    
    if (item.contact.instagram && contactInstagram) {
      contactInstagram.href = `https://instagram.com/${item.contact.instagram.replace('@', '')}`;
    } else if (contactInstagram) {
      contactInstagram.href = "#";
      contactInstagram.onclick = (e) => e.preventDefault();
    }
    
    if (item.contact.zalo && contactZalo) {
      contactZalo.href = `https://zalo.me/${item.contact.zalo}`;
    } else if (contactZalo) {
      contactZalo.href = "#";
      contactZalo.onclick = (e) => e.preventDefault();
    }
    
    if (item.contact.threads && contactThreads) {
      contactThreads.href = `https://threads.net/${item.contact.threads.replace('@', '')}`;
    } else if (contactThreads) {
      contactThreads.href = "#";
      contactThreads.onclick = (e) => e.preventDefault();
    }
    
    if (item.contact.phone && contactPhone) {
      contactPhone.href = `tel:${item.contact.phone}`;
    } else if (contactPhone) {
      contactPhone.href = "#";
      contactPhone.onclick = (e) => e.preventDefault();
    }
    
    const contacts = [];
    
    if (item.contact.phone) {
      contacts.push(`<a href="tel:${item.contact.phone}" class="contact-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
        ${item.contact.phone}
      </a>`);
    }
    
    if (item.contact.zalo) {
      contacts.push(`<a href="https://zalo.me/${item.contact.zalo}" target="_blank" class="contact-link">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1 1 0 0 0 3.8 21.454l3.032-.892A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm3.5 13h-7a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zm0-3h-7a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zm0-3h-7a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1z"/>
        </svg>
        Zalo
      </a>`);
    }
    
    if (item.contact.messenger) {
      contacts.push(`<a href="${item.contact.messenger}" target="_blank" class="contact-link">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.912 1.447 5.506 3.712 7.199V22l3.466-1.902a10.157 10.157 0 0 0 2.822.388c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm.993 12.416l-2.548-2.72-4.974 2.72 5.47-5.804 2.61 2.72 4.912-2.72-5.47 5.804z"/>
        </svg>
        Messenger
      </a>`);
    }
    
    if (item.contact.instagram) {
      contacts.push(`<a href="https://instagram.com/${item.contact.instagram.replace('@', '')}" target="_blank" class="contact-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
        ${item.contact.instagram}
      </a>`);
    }
    
    if (item.contact.threads) {
      contacts.push(`<a href="https://threads.net/${item.contact.threads.replace('@', '')}" target="_blank" class="contact-link">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.186 3.998a8.99 8.99 0 0 0-8.188 5.28c-.104.232.023.505.254.609.232.104.505-.023.609-.254a7.99 7.99 0 0 1 14.678 0c.104.232.377.358.609.254.232-.104.358-.377.254-.609a8.99 8.99 0 0 0-8.216-5.28zM12 8a4 4 0 0 0-4 4c0 .34.042.67.121.985A4.002 4.002 0 0 0 12 16a4.002 4.002 0 0 0 3.879-3.015A4.002 4.002 0 0 0 12 8z"/>
        </svg>
        ${item.contact.threads}
      </a>`);
    }
    
    if (contacts.length > 0) {
      detailContactLinks.innerHTML = contacts.join('');
    } else {
      detailContactLinks.innerHTML = '<p style="color: rgba(255,244,245,0.6); font-size: 14px; margin: 0;">No contact information available. Please check back later.</p>';
    }
  } else {
    // Reset all icon links if no contact info - icons still visible but not functional
    if (contactFacebook) {
      contactFacebook.href = "#";
      contactFacebook.onclick = (e) => e.preventDefault();
    }
    if (contactInstagram) {
      contactInstagram.href = "#";
      contactInstagram.onclick = (e) => e.preventDefault();
    }
    if (contactZalo) {
      contactZalo.href = "#";
      contactZalo.onclick = (e) => e.preventDefault();
    }
    if (contactThreads) {
      contactThreads.href = "#";
      contactThreads.onclick = (e) => e.preventDefault();
    }
    if (contactPhone) {
      contactPhone.href = "#";
      contactPhone.onclick = (e) => e.preventDefault();
    }
    
    if (detailContactLinks) {
      detailContactLinks.innerHTML = '<p style="color: rgba(255,244,245,0.6); font-size: 14px; margin: 0;">No contact information available. Please check back later.</p>';
    }
  }
  
  detailModal.classList.add("is-open");
  document.body.classList.add("modal-open");
}

function closeProductDetail() {
  if (!detailModal) return;
  detailModal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
}

closeDetailTargets.forEach(btn => btn.addEventListener("click", closeProductDetail));

detailModal?.addEventListener("click", event => {
  if (event.target === detailModal) {
    closeProductDetail();
  }
});

// initial render
goToPage(currentPage);

// Add Product Modal
const addProductModal = document.getElementById("addProductModal");
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const closeAddTargets = addProductModal?.querySelectorAll("[data-add-close]") || [];
const productImageInput = document.getElementById("productImage");
const imagePreview = document.getElementById("imagePreview");
const uploadBtn = document.getElementById("uploadBtn");

let uploadedImageData = null;

function openAddProductModal() {
  if (!addProductModal) return;
  addProductModal.classList.add("is-open");
  document.body.classList.add("modal-open");
}

function closeAddProductModal() {
  if (!addProductModal) return;
  addProductModal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  addProductForm?.reset();
  uploadedImageData = null;
  if (imagePreview) {
    imagePreview.classList.remove("has-image");
    const existingImg = imagePreview.querySelector("img");
    if (existingImg) existingImg.remove();
  }
}

// Image upload handling
uploadBtn?.addEventListener("click", () => {
  productImageInput?.click();
});

imagePreview?.addEventListener("click", () => {
  productImageInput?.click();
});

productImageInput?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      uploadedImageData = event.target.result;
      
      // Update preview
      const existingImg = imagePreview.querySelector("img");
      if (existingImg) existingImg.remove();
      
      const img = document.createElement("img");
      img.src = uploadedImageData;
      img.alt = "Product preview";
      imagePreview.appendChild(img);
      imagePreview.classList.add("has-image");
    };
    reader.readAsDataURL(file);
  }
});

addProductBtn?.addEventListener("click", openAddProductModal);

closeAddTargets.forEach(btn => btn.addEventListener("click", closeAddProductModal));

addProductModal?.addEventListener("click", event => {
  if (event.target === addProductModal) {
    closeAddProductModal();
  }
});

addProductForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    alert("Please login to add products!");
    return;
  }
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert("Please login to add products!");
    return;
  }
  
  if (!uploadedImageData) {
    alert("Please upload a product image!");
    return;
  }
  
  const formData = new FormData(addProductForm);
  const price = Number(formData.get("productPrice"));
  
  // Generate unique ID for the new product
  const productId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newProduct = {
    id: productId,
    category: formData.get("productCategory"),
    format: formData.get("productFormat"),
    name: formData.get("productName"),
    price: `${price.toLocaleString('vi-VN')}₫`,
    priceValue: price,
    image: uploadedImageData, // Use uploaded image data URL
    brand: formData.get("productBrand") || undefined,
    condition: formData.get("productCondition") || undefined,
    location: formData.get("productLocation") || undefined,
    description: formData.get("productDescription") || undefined,
    contact: {
      phone: formData.get("contactPhone") || undefined,
      zalo: formData.get("contactZalo") || undefined,
      messenger: formData.get("contactMessenger") || undefined,
      instagram: formData.get("contactInstagram") || undefined,
      threads: formData.get("contactThreads") || undefined
    },
    // Seller information
    sellerUsername: currentUser.username,
    sellerName: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username,
    sellerAvatar: currentUser.avatar || 'assets/images/default-avatar.jpg',
    createdAt: new Date().toISOString()
  };
  
  // Add to products array at the beginning (so it appears first)
  products.unshift(newProduct);
  
  // Save to localStorage
  saveProducts(products);
  
  // Go to page 1 to show the newly added product
  goToPage(1);
  
  // Close modal and show success message
  closeAddProductModal();
  alert(`Product "${newProduct.name}" added successfully!`);
  
  console.log("New product added:", newProduct);
  console.log("Total products:", products.length);
});

const deleteConfirmModal = document.getElementById("deleteConfirmModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const closeDeleteTargets = deleteConfirmModal?.querySelectorAll("[data-delete-close]") || [];

let productToDelete = null;

function openDeleteConfirm(productId) {
  if (!deleteConfirmModal) return;
  productToDelete = productId;
  deleteConfirmModal.classList.add("is-open");
  document.body.classList.add("modal-open");
}

function closeDeleteConfirm() {
  if (!deleteConfirmModal) return;
  deleteConfirmModal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  productToDelete = null;
}

closeDeleteTargets.forEach(btn => btn.addEventListener("click", closeDeleteConfirm));

deleteConfirmModal?.addEventListener("click", event => {
  if (event.target === deleteConfirmModal) {
    closeDeleteConfirm();
  }
});

confirmDeleteBtn?.addEventListener("click", () => {
  if (!productToDelete) return;

  // Check if user is authenticated and has permission to delete
  if (!isAuthenticated()) {
    alert("Please login to delete products!");
    closeDeleteConfirm();
    return;
  }

  const productIndex = products.findIndex(p => p.id === productToDelete);
  if (productIndex === -1) {
    alert("Product not found!");
    closeDeleteConfirm();
    return;
  }

  const product = products[productIndex];
  
  // Check if user has permission to delete
  if (!canDeleteProduct(product)) {
    alert("You don't have permission to delete this product!");
    closeDeleteConfirm();
    return;
  }

  const deletedProduct = products[productIndex];
  products.splice(productIndex, 1);
  
  // Save to localStorage
  saveProducts(products);
  
  // Close modal
  closeDeleteConfirm();
  
  // Re-render
  goToPage(currentPage);
  
  alert(`Product "${deletedProduct.name}" has been deleted successfully!`);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (detailModal?.classList.contains("is-open")) {
      closeProductDetail();
    } else if (addProductModal?.classList.contains("is-open")) {
      closeAddProductModal();
    } else if (deleteConfirmModal?.classList.contains("is-open")) {
      closeDeleteConfirm();
    }
  }
});

