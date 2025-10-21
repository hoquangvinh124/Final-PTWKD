const products = [
  { category: "Audio", format: "CD", name: "Mac DeMarco – This Old Dog CD", price: "375.000₫", priceValue: 375000, image: "assets/images/Audio/CD/1.jpg" },
  { category: "Audio", format: "CD", name: "Mac DeMarco – 2 CD", price: "375.000₫", priceValue: 375000, image: "assets/images/Audio/CD/2.jpg" },
  { category: "Audio", format: "CD", name: "Mac DeMarco – Salad Days CD", price: "375.000₫", priceValue: 375000, image: "assets/images/Audio/CD/3.jpg" },
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
  { category: "Accessories", format: "Thiết bị", name: "Sony Discman D-50", price: "3.850.000₫", priceValue: 3850000, image: "assets/images/Accessories/CD%20Player/1.jpg" },
  { category: "Accessories", format: "Thiết bị", name: "Nakamichi Walkman Sport", price: "4.200.000₫", priceValue: 4200000, image: "assets/images/Accessories/Cassette%20Player/1.jpg" },
  { category: "Accessories", format: "Thiết bị", name: "iPod Classic 5.5 Gen", price: "2.600.000₫", priceValue: 2600000, image: "assets/images/Accessories/IPod/1.jpg" },
  { category: "Accessories", format: "Thiết bị", name: "Retro Boombox 1988", price: "5.450.000₫", priceValue: 5450000, image: "assets/images/Accessories/CD%20Player/2.jpg" },
  { category: "Pola Camera", format: "Thiết bị", name: "Polaroid 600 Spice Girls Edition", price: "3.900.000₫", priceValue: 3900000, image: "assets/images/Pola%20Camera/1.jpg" },
  { category: "Pola Camera", format: "Thiết bị", name: "Polaroid OneStep Autumn", price: "3.250.000₫", priceValue: 3250000, image: "assets/images/Pola%20Camera/2.jpg" },
  { category: "Pola Camera", format: "Thiết bị", name: "Polaroid Sun 600 LMS", price: "4.050.000₫", priceValue: 4050000, image: "assets/images/Pola%20Camera/3.jpg" },
  { category: "Pola Camera", format: "Thiết bị", name: "Polaroid Land Camera 1000", price: "4.500.000₫", priceValue: 4500000, image: "assets/images/Pola%20Camera/4.jpg" },
  { category: "VHS", format: "Thiết bị", name: "Star Wars Trilogy VHS Boxset", price: "1.650.000₫", priceValue: 1650000, image: "assets/images/VHS/1.jpg" },
  { category: "VHS", format: "Thiết bị", name: "Blade Runner Director's Cut", price: "790.000₫", priceValue: 790000, image: "assets/images/VHS/2.jpg" },
  { category: "VHS", format: "Thiết bị", name: "Back To The Future VHS", price: "720.000₫", priceValue: 720000, image: "assets/images/VHS/3.jpg" },
  { category: "VHS", format: "Thiết bị", name: "Akira Collector's VHS", price: "980.000₫", priceValue: 980000, image: "assets/images/VHS/4.jpg" },
  { category: "VHS", format: "Thiết bị", name: "Jurassic Park Special Edition", price: "850.000₫", priceValue: 850000, image: "assets/images/VHS/5.jpg" },
  { category: "VHS", format: "Thiết bị", name: "Ghostbusters Original VHS", price: "780.000₫", priceValue: 780000, image: "assets/images/VHS/6.jpg" }
];

const filterButtons = document.querySelectorAll(".filter-section button");
const activeFilters = {
  category: document.querySelector("button[data-filter-type='category'].active")?.dataset.filterValue || "Tất cả",
  price: document.querySelector("button[data-filter-type='price'].active")?.dataset.filterValue || "all",
  format: document.querySelector("button[data-filter-type='format'].active")?.dataset.filterValue || "all"
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
const closeDetailTargets = detailModal?.querySelectorAll("[data-detail-close]") || [];

const defaultLocation = "Quận 7, TP.HCM";
const defaultCondition = "Đã qua sử dụng - Như mới";

function deriveBrand(item) {
  if (item.brand) return item.brand;
  const parts = item.name.split("–");
  return parts.length > 1 ? parts[0].trim() : item.category;
}

const categoryDescriptions = {
  "Audio": "Phiên bản chọn lọc dành cho người chơi analog, đảm bảo đĩa sạch và âm thanh chuẩn studio.",
  "Cassette Tape": "Băng cassette được ghi và căn chỉnh Dolby chuẩn, đã vệ sinh đầu từ trước khi giao.",
  "Accessories": "Thiết bị đã được kỹ thuật viên LDIE kiểm tra, bảo hành 6 tháng, dùng tốt cho dàn retro.",
  "Pola Camera": "Máy ảnh polaroid lên phim ổn định, kèm film test và hướng dẫn sử dụng chi tiết.",
  "VHS": "Băng VHS nguyên hộp, tua lại sẵn và bảo quản trong túi chống ẩm trước khi giao hàng."
};

const categoryFeatures = {
  "Audio": [
    "Bao gồm hộp và booklet gốc",
    "Đĩa kiểm tra không trầy xước",
    "Ship toàn quốc trong 24 giờ"
  ],
  "Cassette Tape": [
    "Băng được căn chỉnh chuẩn Dolby",
    "Đã vệ sinh và bôi trơn cơ",
    "Tặng kèm case acrylic bảo vệ"
  ],
  "Accessories": [
    "Bảo hành 6 tháng tại LDIE Zone",
    "Đã vệ sinh, thay linh kiện hao mòn",
    "Hỗ trợ hướng dẫn sử dụng chi tiết"
  ],
  "Pola Camera": [
    "Tặng kèm 1 pack film i-Type",
    "Đã test flash và cảm biến đầy đủ",
    "Bao gồm túi vải chống xước"
  ],
  "VHS": [
    "Tape đã tua lại và lưu trong hộp chống ẩm",
    "Bao gồm phụ đề tiếng Việt in kèm",
    "Đảm bảo phát ổn định trên mọi đầu VHS"
  ]
};

let currentPage = 1;

const productGrid = document.getElementById("productGrid");
const pagination = document.querySelector(".products-pagination");
const pageLinks = pagination.querySelectorAll("[data-page]");
const prevBtn = pagination.querySelector("[data-action='prev']");
const nextBtn = pagination.querySelector("[data-action='next']");

function matchesCategory(item) {
  return activeFilters.category === "Tất cả" || item.category === activeFilters.category;
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

function getFilteredProducts() {
  return products.filter(item => matchesCategory(item) && matchesFormat(item) && matchesPrice(item));
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
    emptyState.innerHTML = `<p>Không có sản phẩm phù hợp.</p>`;
    fragment.appendChild(emptyState);
  }

  items.forEach(item => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-thumb">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="product-meta">
        <span class="product-category">${item.category}</span>
        <h3>${item.name}</h3>
        <span class="price">${item.price}</span>
      </div>
    `;
    card.tabIndex = 0;
    card.addEventListener("click", () => openProductDetail(item));
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

function getDescription(item) {
  return item.description || categoryDescriptions[item.category] || "Sản phẩm được tuyển chọn kỹ và bảo hành chính hãng tại LDIE Zone.";
}

function getFeatureList(item) {
  return item.features || categoryFeatures[item.category] || [];
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

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && detailModal?.classList.contains("is-open")) {
    closeProductDetail();
  }
});

// initial render
goToPage(currentPage);
