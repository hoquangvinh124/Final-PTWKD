#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Read the file
with open('assets/js/admin-script.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")

# Keep lines 1-911 (before first duplicate section)
# Skip lines 912-1351 (duplicate section)
# Keep lines 1352-end (after duplicate)

new_lines = lines[:911] + lines[1351:]

print(f"New total lines: {len(new_lines)}")

# Write back
with open('assets/js/admin-script.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("✅ Removed duplicate code (lines 912-1351)")
print(f"✅ File now has {len(new_lines)} lines")
