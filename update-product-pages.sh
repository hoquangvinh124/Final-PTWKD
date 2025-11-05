#!/bin/bash

# Script to add product pagination CSS and JS to all product pages

# List of product HTML files
files=(
  "audio-vinyl-products.html"
  "vhs-products.html"
  "cassette-tape-products.html"
  "camera-products.html"
  "accessory-products.html"
  "accessory-cassette-player-products.html"
  "accessory-ipod-products.html"
  "accessory-cd-player-products.html"
  "audio-products.html"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Add CSS files after header-footer.css if not already present
    if ! grep -q "product-grid.css" "$file"; then
      sed -i '' 's|<link rel="stylesheet" href="assets/css/header-footer.css">|<link rel="stylesheet" href="assets/css/header-footer.css">\n    <link rel="stylesheet" href="assets/css/product-grid.css">\n    <link rel="stylesheet" href="assets/css/product-pagination.css">|' "$file"
      echo "  ✓ Added CSS files"
    else
      echo "  - CSS already present"
    fi
    
    # Add JS file before closing body tag if not already present
    if ! grep -q "product-pagination.js" "$file"; then
      sed -i '' 's|<script src="chatbot.js"></script>|<script src="chatbot.js"></script>\n    <script src="assets/js/product-pagination.js"></script>|' "$file"
      echo "  ✓ Added JS file"
    else
      echo "  - JS already present"
    fi
  else
    echo "⚠ File not found: $file"
  fi
done

echo ""
echo "✅ All product pages updated!"
