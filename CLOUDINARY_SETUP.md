# Cloudinary Setup Guide

This guide walks you through setting up Cloudinary for image uploads in Live Local.

## Why Cloudinary?

Since Back4App's free tier disables file uploads, we use **Cloudinary** (a free-tier CDN service) to host images. Cloudinary provides:
- ✅ Free tier with 25 GB storage
- ✅ Automatic image optimization & delivery
- ✅ Unlimited transformations
- ✅ Client-side uploads (unsigned, no backend server needed)
- ✅ HTTPS delivery by default

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click **Sign Up** → Create a free account (email + password)
3. Verify your email if prompted
4. You'll be redirected to your **Cloudinary Dashboard**

## Step 2: Get Your Cloud Name

On the Dashboard, you'll see your **Cloud Name** displayed prominently at the top.

Example: `drewdiguglielmo` (yours will be different)

Note this down — you'll need it later.

## Step 3: Create an Upload Preset

Upload presets allow client-side uploads without exposing your API key.

1. In your Cloudinary Dashboard, go to **Settings** (gear icon, top right)
2. Click the **Upload** tab
3. Scroll down to **Upload presets** section
4. Click **Add upload preset** (or edit an existing one)
5. Set the following:
   - **Name**: `live_local_uploads` (or any name you prefer)
   - **Unsigned**: Toggle to **ON** (critical for client-side uploads)
   - **Folder**: `live_local_businesses` (optional, for organization)
   - **Resource type**: Keep as **Auto**
6. Click **Save** button

Copy the **Preset Name** — you'll need this next.

## Step 4: Configure Environment Variables

1. Open `.env.local` in the project root:
   ```bash
   cd /Users/drewdiguglielmo/live_local-main
   nano .env.local
   ```

2. Add these two lines:
   ```
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   REACT_APP_CLOUDINARY_PRESET=your_upload_preset_here
   ```

3. Replace:
   - `your_cloud_name_here` → your actual Cloud Name from Step 2
   - `your_upload_preset_here` → your preset name from Step 3 (e.g., `live_local_uploads`)

4. Example (with made-up values):
   ```
   REACT_APP_CLOUDINARY_CLOUD_NAME=drewdiguglielmo
   REACT_APP_CLOUDINARY_PRESET=live_local_uploads
   ```

5. Save and exit (Ctrl+O, Enter, Ctrl+X in nano)

## Step 5: Verify Setup

1. Restart the development server:
   ```bash
   npm start
   ```

2. Navigate to the **Add Your Business** page (`/application`)

3. Fill out the form and select an image

4. Click **Register**

5. If successful, you should see:
   - "Uploading..." message briefly on the button
   - Success message: "Thank you — your business application was submitted"
   - Check your Cloudinary Dashboard under **Media Library** → your image should appear there

## Troubleshooting

### "Cloudinary is not configured" Error

**Cause**: Environment variables not set or not picked up by React

**Solution**:
1. Verify `.env.local` has both variables
2. Stop and restart the dev server: `npm start`
3. Check browser DevTools → Console for error messages

### Image Upload Fails Silently

**Cause**: Unsigned preset not enabled, or incorrect preset name

**Solution**:
1. Go back to Cloudinary Dashboard → Settings → Upload
2. Click your preset and verify **Unsigned** is toggled **ON**
3. Check preset name matches exactly in `.env.local`

### Images Don't Display in Listings

**Cause**: ImageURL field not stored in Parse or fetch logic issue

**Solution**:
1. Check browser DevTools → Network tab
   - See if the image URL is valid (should be `res.cloudinary.com/...`)
2. In browser DevTools → Console, check for errors
3. Verify `.env.local` is set and dev server restarted

### Upload Succeeds but Image URL Not Stored

**Cause**: Application.js not sending `ImageURL` to Parse

**Solution**:
1. Open `src/components/Application.js`
2. Look for line with `payload.ImageURL = imageUrl`
3. If missing, check that Cloudinary upload completed successfully
4. See Console for upload response

## How It Works

### Flow: Upload → Cloudinary → URL → Parse → Display

1. **User uploads image** in Application form
2. **Client-side**: `uploadToCloudinary()` sends file directly to Cloudinary (no backend needed)
3. **Cloudinary responds** with `secure_url` (HTTPS image link)
4. **Parse saves URL**: Application.js sends `ImageURL` to Parse's `Business` class
5. **Display**: BusinessList, Results, BusinessDetail fetch businesses and display images from Cloudinary URLs

### Why This Approach?

- ✅ **Free tier friendly**: Back4App free tier blocks file uploads; Cloudinary doesn't
- ✅ **CDN delivery**: Images served from Cloudinary's global CDN (faster loads)
- ✅ **No backend auth needed**: Unsigned preset = client-side only
- ✅ **Easy cleanup**: Delete images in Cloudinary without touching Parse
- ✅ **Image optimization**: Cloudinary auto-optimizes format, size, quality

## Deployment (Netlify)

When deploying to Netlify, add these environment variables in **Site settings → Build & Deploy → Environment**:

```
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
REACT_APP_CLOUDINARY_PRESET=your_upload_preset_here
```

Netlify will inject them during the build process.

## See Also

- [Cloudinary Dashboard](https://cloudinary.com/console)
- [Cloudinary Upload API Docs](https://cloudinary.com/documentation/upload_widget)
- [Live Local README](./README.md)
