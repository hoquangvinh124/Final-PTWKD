// ===== PHẦN 1: LẤY ID TỪ URL =====
function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// ===== PHẦN 2: FETCH DỮ LIỆU TỪ JSON =====
async function getProductById(productId) {
  try {
    const response = await fetch('product.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products = await response.json();
    
    // Tìm sản phẩm có ID khớp
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    
    return product;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sản phẩm:', error);
    return null;
  }
}

// ===== PHẦN 3: RENDER THÔNG TIN SẢN PHẨM =====
function renderProductDetails(product) {
  // 1. Cập nhật tiêu đề trang
  document.title = product.name;
  
  // 2. Cập nhật Gallery Images
  const mainImage = document.getElementById('product-main-image');
  const galleryThumbs = document.querySelector('.gallery-thumbs');
  
  if (mainImage) {
    mainImage.src = product.image_front;
    mainImage.alt = product.name;
    mainImage.setAttribute('data-current-index', '0');
  }
  
  // Tạo array chứa cả 2 ảnh
  const galleryImages = [product.image_front, product.image_back];
  
  if (galleryThumbs) {
    galleryThumbs.innerHTML = galleryImages.map((imageSrc, index) => `
      <button class="thumb ${index === 0 ? 'is-active' : ''}" type="button" data-image="${imageSrc}" data-index="${index}">
        <img src="${imageSrc}" alt="Ảnh sản phẩm ${index + 1}">
      </button>
    `).join('');
  }
  
  // Xóa tất cả event listeners cũ bằng cách clone và replace các nút điều hướng
  const prevBtn = document.querySelector('.gallery-nav--prev');
  const nextBtn = document.querySelector('.gallery-nav--next');
  
  if (prevBtn) {
    const newPrevBtn = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    
    newPrevBtn.addEventListener('click', function() {
      const currentIndex = parseInt(mainImage.getAttribute('data-current-index') || '0');
      const newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
      
      mainImage.src = galleryImages[newIndex];
      mainImage.setAttribute('data-current-index', newIndex);
      
      // Cập nhật active thumbnail
      const thumbButtons = galleryThumbs.querySelectorAll('.thumb');
      thumbButtons.forEach((b, i) => {
        if (i === newIndex) {
          b.classList.add('is-active');
        } else {
          b.classList.remove('is-active');
        }
      });
    });
  }
  
  if (nextBtn) {
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    newNextBtn.addEventListener('click', function() {
      const currentIndex = parseInt(mainImage.getAttribute('data-current-index') || '0');
      const newIndex = (currentIndex + 1) % galleryImages.length;
      
      mainImage.src = galleryImages[newIndex];
      mainImage.setAttribute('data-current-index', newIndex);
      
      // Cập nhật active thumbnail
      const thumbButtons = galleryThumbs.querySelectorAll('.thumb');
      thumbButtons.forEach((b, i) => {
        if (i === newIndex) {
          b.classList.add('is-active');
        } else {
          b.classList.remove('is-active');
        }
      });
    });
  }
  
  // Thêm event listeners cho thumbnails sau khi đã tạo xong
  setTimeout(() => {
    const thumbButtons = galleryThumbs.querySelectorAll('.thumb');
    thumbButtons.forEach((btn, index) => {
      btn.addEventListener('click', function() {
        // Cập nhật ảnh chính
        if (mainImage) {
          mainImage.src = galleryImages[index];
          mainImage.setAttribute('data-current-index', index);
        }
        
        // Cập nhật trạng thái active
        thumbButtons.forEach((b, i) => {
          if (i === index) {
            b.classList.add('is-active');
          } else {
            b.classList.remove('is-active');
          }
        });
      });
    });
  }, 100);
  
  // 3. Cập nhật Product Info
  const subtitle = document.querySelector('.product-info .subtitle');
  const productTitle = document.querySelector('.product-info h1');
  const priceElement = document.querySelector('.product-info .price');
  const stockTag = document.querySelector('.product-info .tag');
  
  if (subtitle) subtitle.textContent = product.category;
  if (productTitle) productTitle.textContent = product.name;
  if (priceElement) priceElement.textContent = product.price;
  
  if (stockTag) {
    if (product.is_available) {
      stockTag.textContent = 'Còn hàng';
      stockTag.className = 'tag in-stock';
    } else {
      stockTag.textContent = 'Hết hàng';
      stockTag.className = 'tag out-of-stock';
    }
  }
  
  // 4. Cập nhật Description
  const descriptionElement = document.querySelector('pre');
  if (descriptionElement) {
    // Loại bỏ HTML tags từ description
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = product.description;
    const cleanDescription = tempDiv.textContent || tempDiv.innerText || '';
    descriptionElement.textContent = cleanDescription;
  }
  
  // 5. Cập nhật Product Details (Information tab)
  const detailsList = document.querySelector('#details-specs .details-list');
  if (detailsList && product.subcategory) {
    detailsList.innerHTML = `
      <li><span>Danh mục</span><span>${product.category}</span></li>
      <li><span>Loại</span><span>${product.subcategory}</span></li>
      <li><span>Giá</span><span>${product.price}</span></li>
      <li><span>Số lượng</span><span>${product.stock_quantity}</span></li>
      <li><span>Thương hiệu</span><span>${product.brand.name || 'N/A'}</span></li>
    `;
  }
  
  // 6. Cập nhật Reviews
  const reviewsList = document.querySelector('.reviews-list');
  if (reviewsList && product.reviews && product.reviews.length > 0) {
    reviewsList.innerHTML = product.reviews.map(review => {
      const reviewDate = new Date(review.date);
      const formattedDate = reviewDate.toLocaleDateString('vi-VN');
      const initials = review.user_id.substring(0, 2).toUpperCase();
      
      return `
        <article class="review" tabindex="0">
          <div class="review-avatar" aria-hidden="true">${initials}</div>
          <div class="review-body">
            <header class="review-meta">
              <span class="review-author">${review.user_id}</span>
              <time class="review-date" datetime="${review.date}">${formattedDate}</time>
            </header>
            <p>${review.comment}</p>
          </div>
        </article>
      `;
    }).join('');
  }
}

// ===== PHẦN 4: KHỞI TẠO TRANG =====
async function initSingleProduct() {
  // Lấy ID từ URL
  const productId = getProductIdFromURL();
  
  if (!productId) {
    alert('Không tìm thấy sản phẩm. Vui lòng quay lại trang danh sách.');
    window.location.href = 'products.html';
    return;
  }
  
  // Lấy thông tin sản phẩm từ JSON
  const product = await getProductById(productId);
  
  if (!product) {
    alert('Không tìm thấy sản phẩm. Vui lòng quay lại trang danh sách.');
    window.location.href = 'products.html';
    return;
  }
  
  // Render thông tin sản phẩm
  renderProductDetails(product);
  
  console.log('Đã load thông tin sản phẩm:', product);
}

// ===== CHẠY KHI DOM SẴN SÀNG =====
document.addEventListener('DOMContentLoaded', initSingleProduct);
