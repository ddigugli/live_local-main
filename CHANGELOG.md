# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2025-10-15
- Move Parse queries into model files (Business, Profile, Review).
- Centralize CRUD and query helpers in `src/models/*`.
- Use named exports for models to satisfy lint rules.
- Wire Application/Profile forms to save to Parse via model helpers.
- Added comments for all Parse queries and Routing. 
- Intialized routing and created routes between modules. 
- Configured webpack with current implementation. 
- Changed to version to 0.2.0.


## [0.3.0] - 2025-11-6
- Created Auth module in  `src/components/Auth/`, with `Login`, `Register`, and `RedirectIfAuthenticated` .js files 
- Added Parse authentication service `src/components/Auth/authService.js` with login, register, logout features
- Implemented `ProtectedRoute` component in `src/components/ProtectedRoute.js`to render children when user is authenticated
- Updated routes/route definitions in `src/App.js` 
- Updated Profile page to include edit / delete functionality 
- Added sample reviews / data 

## [0.4.0] - 2025-12-2
### Cloudinary Integration (Image Hosting)
- Implemented Cloudinary client-side image upload service (`src/services/cloudinaryService.js`)
- Updated Application form to upload images to Cloudinary before creating business in Parse
- Images now stored as `ImageURL` (Cloudinary secure_url) instead of Parse.File
- Added error handling and loading state ("Uploading...") during image upload
- Graceful fallback: businesses save without image if upload fails
- Updated all business service queries to prefer `ImageURL` over `Image` field
- Updated `BusinessCard.js` and `BusinessDetail.js` to display Cloudinary images
- Added comprehensive Cloudinary setup guide (`CLOUDINARY_SETUP.md`)
- Added Cloudinary env vars to `.env.example` with setup instructions

### UI/UX Improvements
- Redesigned business cards: full-bleed photo tiles with business name overlaid at top (dark gradient background)
- Card height: 300px with responsive scaling for mobile
- Updated BusinessDetail page to show Description instead of Keywords
- Styled category tiles ("Cafes, Lunch Places, Other") to match business card design
- Category tiles now have centered text overlays with dark gradient background
- Improved hover effects: cards translate upward (-4px) instead of scale

### Testing & Documentation
- Created comprehensive integration and unit test suite (77 test cases)
- Tests cover Parse SDK, Business model, Application form, and auth service
- Added testing documentation and quick reference guides
- Created visual test delivery summary

### Bug Fixes & Refinements
- Fixed filename sanitization for special characters in image uploads
- Removed debug console logs from Application form after verification
- Improved CSS organization and removed duplicate style rules
