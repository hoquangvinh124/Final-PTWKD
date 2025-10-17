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

// Load và hiển thị danh sách sản phẩm khi trang load
async function loadProduct() {
  const products = await getProductData();
  if (products && products.length > 0) {
    const container = document.querySelector('.col-xl-8 .row.gx-5');
    if (container) {
      // Tạo HTML cho tất cả sản phẩm
      const productsHTML = products.map(product => createProductCard(product)).join('');
      // Thêm tất cả sản phẩm vào đầu danh sách
      container.insertAdjacentHTML('afterbegin', productsHTML);
    }
  }
}

// Chạy khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', loadProduct);    