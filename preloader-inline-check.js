// Inline script - Đặt ngay sau thẻ mở <body> và trước preloader HTML
// Script này chạy đồng bộ để ẩn preloader trước khi render
(function() {
    if (sessionStorage.getItem('preloader_shown')) {
        // Thêm style ngay lập tức để ẩn preloader
        var style = document.createElement('style');
        style.textContent = '#videoPreloader { display: none !important; }';
        document.head.appendChild(style);
    }
})();
