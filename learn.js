// Hàm fetch đơn giản để lấy dữ liệu từ product.json
async function getProductData() {
  try {
    const response = await fetch('product.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Dữ liệu sản phẩm:', data);
    return data; // Trả về array
  } catch (error) {
    console.error('Lỗi khi fetch dữ liệu:', error);
    return [];
  }
}

// Hàm tạo HTML card sản phẩm từ dữ liệu JSON
function createProductCard(product) {
  const productHTML = `
    <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 product-grid-item">
      <div class="item">
        <div class="thumb">
          <div class="hover-content">
            <ul>
              <li><a href="single-product.html?id=${product.id}"><i class="heart-icon"></i></a></li>
              <li><a href="single-product.html?id=${product.id}"><i class="shopping-bag-icon"></i></a></li>
            </ul>
          </div>
          <a href="single-product.html?id=${product.id}">
            <img src="${product.image_front}" alt="${product.name}" class="main-image">
            <img src="${product.image_back}" alt="${product.name}" class="hover-image">
          </a>
        </div>
        <div class="down-content">
          <a href="single-product.html?id=${product.id}">
            <h4>${product.name}</h4>
          </a>
          <div class="product-price">
            <span class="current">${product.price}</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return productHTML;
}

// Hàm lọc sản phẩm theo category và subcategory
function filterProducts(products, category, subcategory = null) {
  return products.filter(product => {
    const matchCategory = !category || product.category === category;
    const matchSubcategory = !subcategory || product.subcategory === subcategory;
    return matchCategory && matchSubcategory;
  });
}

// Load và hiển thị danh sách sản phẩm khi trang load
async function loadProduct(category = null, subcategory = null) {
  const products = await getProductData();
  if (products && products.length > 0) {
    // Lọc sản phẩm theo category và subcategory
    const filteredProducts = filterProducts(products, category, subcategory);
    
    const container = document.querySelector('.col-xl-8 .row.gx-5');
    if (container) {
      // Tạo HTML cho sản phẩm đã lọc
      const productsHTML = filteredProducts.map(product => createProductCard(product)).join('');
      // Thêm sản phẩm vào đầu danh sách
      container.insertAdjacentHTML('afterbegin', productsHTML);
      
      // Log để debug
      console.log(`Loaded ${filteredProducts.length} products for category: ${category || 'All'}, subcategory: ${subcategory || 'All'}`);
    }
  }
}

// Chạy khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
  // Lấy thông tin category và subcategory từ data attribute của body hoặc từ tên file
  const pageName = window.location.pathname.split('/').pop().replace('.html', '');
  
  let category = null;
  let subcategory = null;
  
  // Xác định category và subcategory dựa trên tên trang
  if (pageName.includes('audio')) {
    category = 'Audio';
    if (pageName.includes('cd') && !pageName.includes('player')) {
      subcategory = 'CD';
    } else if (pageName.includes('vinyl')) {
      subcategory = 'Vinyl';
    }
  } else if (pageName.includes('cassette-tape')) {
    category = 'Audio';
    subcategory = 'Cassette';
  } else if (pageName.includes('camera')) {
    category = 'Camera';
    subcategory = 'Polaroid';
  } else if (pageName.includes('accessory')) {
    category = 'Audio';
    if (pageName.includes('cassette-player')) {
      subcategory = 'CassettePlayer';
    } else if (pageName.includes('ipod')) {
      subcategory = 'IPod';
    } else if (pageName.includes('cd-player')) {
      subcategory = 'CDPlayer';
    }
  } else if (pageName.includes('vhs')) {
    category = 'VHS';
  }
  
  // Load sản phẩm với filter tương ứng
  loadProduct(category, subcategory);
});    