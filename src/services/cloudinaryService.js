/**
 * Cloudinary Service
 * Handles unsigned image uploads to Cloudinary
 * Requires: REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_PRESET
 */

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_PRESET;

export const isCloudinaryConfigured = () => {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET);
};

/**
 * Upload an image file to Cloudinary
 * Returns the secure_url on success
 * Throws error on failure
 */
export const uploadToCloudinary = async (file) => {
  if (!file) throw new Error('No file provided');
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured. Set REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_PRESET');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'live_local_businesses'); // Organize uploads in folder

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Cloudinary upload failed');
    }

    const data = await response.json();
    console.log('Cloudinary upload successful:', data.public_id);
    
    // Return secure HTTPS URL
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Get image URL for display with optional transformations
 * transformations: { width: 300, height: 200, crop: 'fill', quality: 'auto' }
 */
export const getCloudinaryUrl = (publicId, transformations = {}) => {
  if (!CLOUD_NAME) return null;

  const defaultTransforms = {
    quality: 'auto',
    fetch_format: 'auto'
  };

  const transforms = { ...defaultTransforms, ...transformations };
  const transformString = Object.entries(transforms)
    .map(([key, value]) => `${key}_${value}`)
    .join('/');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformString}/v1/${publicId}`;
};

const cloudinaryService = {
  isCloudinaryConfigured,
  uploadToCloudinary,
  getCloudinaryUrl
};

export default cloudinaryService;