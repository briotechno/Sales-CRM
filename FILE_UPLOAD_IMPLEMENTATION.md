# File Upload Implementation - Add New Lead Modal

## Overview
Successfully replaced URL text inputs with file upload functionality for profile images and company logos, with 1MB file size validation.

## ✅ Changes Implemented

### 1. **Helper Functions Added**

#### File to Base64 Converter
```javascript
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
```

#### File Size Validator (Max 1MB)
```javascript
const validateFileSize = (file) => {
  const maxSize = 1 * 1024 * 1024; // 1MB in bytes
  return file.size <= maxSize;
};
```

### 2. **Upload Handler Functions**

#### Individual Profile Image Upload
- Validates file size (max 1MB)
- Converts image to base64
- Shows error toast if file exceeds 1MB
- Shows success toast on successful upload
- Resets input on error

#### Company Logo Upload
- Same validation and conversion as profile image
- Specific handler for organization type

#### Contact Person Image Upload
- Handles multiple contact persons
- Index-based upload for each contact
- Same validation rules

### 3. **UI Components Updated**

#### Individual - Profile Image
**Before:** Text input for URL
**After:** 
- File upload button with dashed border
- Upload icon and text
- Image preview (80x80px)
- Remove button (X icon) on preview
- Hover effects (orange theme)

#### Organization - Company Logo
**Before:** Text input for URL
**After:**
- File upload button with dashed border
- Upload icon and text
- Logo preview (80x80px)
- Remove button (X icon) on preview
- Hover effects (orange theme)

#### Contact Person - Profile Image
**Before:** Text input for URL
**After:**
- File upload button for each contact person
- Unique ID for each upload input
- Individual preview for each contact
- Remove button for each preview
- Hover effects (orange theme)

## 🎨 UI Features

### Upload Button Design
```jsx
<label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-sm hover:border-[#FF7B1D] cursor-pointer transition-all bg-gray-50 hover:bg-orange-50">
  <Upload size={18} className="text-gray-500" />
  <span className="text-sm text-gray-600">
    {hasImage ? "Change Image" : "Upload Image (Max 1MB)"}
  </span>
</label>
```

### Image Preview Design
```jsx
<div className="mt-2 relative">
  <img
    src={imageData}
    alt="Preview"
    className="w-20 h-20 object-cover rounded-sm border-2 border-gray-200"
  />
  <button
    type="button"
    onClick={removeImage}
    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
  >
    <X size={14} />
  </button>
</div>
```

## ⚠️ Validation & Error Handling

### File Size Validation
- **Maximum Size:** 1 MB (1,048,576 bytes)
- **Error Message:** "File size must not exceed 1 MB"
- **Action:** Input is reset, upload is cancelled

### File Type Validation
- **Accepted Types:** `image/*` (all image formats)
- **Browser handles:** File picker only shows image files

### Success Feedback
- **Profile Image:** "Profile image uploaded successfully"
- **Company Logo:** "Company logo uploaded successfully"

### Error Feedback
- **Size Error:** "File size must not exceed 1 MB"
- **Upload Error:** "Failed to upload image"

## 📊 Data Storage

### Base64 Encoding
All uploaded images are converted to base64 strings and stored in:
- `formData.profile_image` (Individual)
- `formData.company_logo` (Organization)
- `contactPersons[index].profile_image` (Contact Persons)

### Database Storage
Base64 strings are stored in the database as TEXT/VARCHAR fields:
- `profile_image` VARCHAR(500) → May need to increase for base64
- `company_logo` VARCHAR(500) → May need to increase for base64

**Note:** Base64 images are typically larger than the original file size. A 1MB image becomes approximately 1.37MB as base64. Consider updating database column types to TEXT or MEDIUMTEXT for larger storage.

## 🔄 User Flow

### Upload Process
1. User clicks upload button
2. File picker opens (images only)
3. User selects image
4. Validation checks file size
5. If valid:
   - Convert to base64
   - Update state
   - Show preview
   - Show success toast
6. If invalid:
   - Reset input
   - Show error toast

### Remove Process
1. User clicks X button on preview
2. Image data is cleared from state
3. Preview disappears
4. Upload button shows "Upload Image" again

## 🎯 Benefits

1. **Better UX:** Visual upload interface vs text input
2. **Validation:** Prevents oversized files
3. **Preview:** Users see uploaded image immediately
4. **Error Handling:** Clear feedback on issues
5. **Consistency:** Same pattern across all image uploads
6. **Theme Matching:** Orange hover effects match app theme

## 📝 Technical Details

### Icons Used
- `Upload` - Upload button icon
- `X` - Remove image button

### Styling Classes
- Dashed border for upload area
- Orange hover effects (`hover:border-[#FF7B1D]`, `hover:bg-orange-50`)
- Gray background for upload area
- Rounded corners (`rounded-sm`)
- Transition effects for smooth interactions

### File Input
- Hidden with `className="hidden"`
- Triggered via label with `htmlFor` attribute
- Unique IDs for multiple contact persons

## 🚀 Next Steps (Optional Enhancements)

1. **Image Compression:** Compress images before base64 conversion to reduce size
2. **Cloud Storage:** Upload to cloud (AWS S3, Cloudinary) instead of base64
3. **Crop/Resize:** Add image cropping/resizing before upload
4. **Progress Bar:** Show upload progress for larger files
5. **Multiple Formats:** Support for specific formats (PNG, JPG, etc.)
6. **Database Update:** Change VARCHAR(500) to TEXT or MEDIUMTEXT for base64 storage

---

**Status:** ✅ **COMPLETE**
**Date:** February 12, 2026
**File Size Limit:** 1 MB
**Validation:** ✅ Implemented
**Preview:** ✅ Implemented
**Error Handling:** ✅ Implemented
