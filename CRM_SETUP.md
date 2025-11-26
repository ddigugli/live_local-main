# CRM Setup Guide

The CRM feature requires creating Parse class definitions in your Back4App dashboard before the frontend can query them. This guide walks you through the setup process.

## Overview

The CRM system includes 6 new Parse classes:
- **Contact** — CRM contacts (firstName, lastName, email, phone, title, company reference, notes)
- **Company** — Client/partner companies (name, website, phone, address, description)
- **Deal** — Sales deals (title, company reference, amount, status, expectedCloseDate, description)
- **Task** — Work tasks (title, description, dueDate, status)
- **Activity** — CRM activity log (activityType, description, contact/deal references)
- **Note** — Internal notes (content, contact references)

## Quick Setup (Manual via Back4App Dashboard)

1. **Open Back4App Dashboard**
   - Go to https://www.back4app.com/
   - Log in to your account
   - Select your Parse app (e.g., "live-local")

2. **Create Contact Class**
   - Click "Database" → "Parse Classes"
   - Click "+ Add Class"
   - Class name: `Contact`
   - Click "Create"
   - Add columns (fields) via "Data Browser" or click the column name to add:
     - `firstName` (String)
     - `lastName` (String)
     - `email` (String)
     - `phone` (String)
     - `title` (String)
     - `company` (Pointer to Company class) *create Company first if needed*
     - `notes` (String)
     - `owner` (Pointer to User) — optional; automatically set by app
   - Click "Create Column" for each field

3. **Create Company Class**
   - Similar process: "Database" → "+ Add Class" → `Company`
   - Columns:
     - `name` (String, required)
     - `website` (String)
     - `phone` (String)
     - `address` (String)
     - `description` (String)
     - `owner` (Pointer to User)

4. **Create Deal Class**
   - Class name: `Deal`
   - Columns:
     - `title` (String, required)
     - `company` (Pointer to Company, required)
     - `amount` (Number)
     - `status` (String) — will store "Open" / "Won" / "Lost"
     - `expectedCloseDate` (Date)
     - `description` (String)
     - `owner` (Pointer to User)

5. **Create Task Class**
   - Class name: `Task`
   - Columns:
     - `title` (String, required)
     - `description` (String)
     - `dueDate` (Date)
     - `status` (String) — will store "Open" / "Completed"
     - `assignedTo` (Pointer to User)

6. **Create Activity Class**
   - Class name: `Activity`
   - Columns:
     - `activityType` (String)
     - `description` (String)
     - `contact` (Pointer to Contact)
     - `deal` (Pointer to Deal)
     - `createdBy` (Pointer to User)

7. **Create Note Class**
   - Class name: `Note`
   - Columns:
     - `content` (String)
     - `contact` (Pointer to Contact)
     - `createdBy` (Pointer to User)

## Class-Level Permissions (CLP)

By default, Parse classes restrict client access for security. To allow your frontend CRM app to query/create objects:

1. In Back4App Dashboard, go to "Database" → select a CRM class (e.g., "Contact")
2. Click the class settings (gear icon or "Settings" button)
3. Look for "Class-Level Permissions" (CLP)
4. Set permissions:
   - **Public/Unauthenticated**: 
     - Find (Query): ❌ No (optional; set if you want public read access)
     - Create: ❌ No
   - **Authenticated Users**:
     - Find (Query): ✅ Yes
     - Create: ✅ Yes
     - Update: ✅ Yes
     - Delete: ✅ Yes
   - **Pointer Constraints** (if applicable): Allow User → Contact / Deal / Task references to work

5. Click "Save" to apply CLP

Repeat for all 6 CRM classes: Contact, Company, Deal, Task, Activity, Note.

## Verify Setup

1. **Test via frontend:**
   - Start the local dev server: `npm start`
   - Authenticate (Login or Register)
   - Navigate to "CRM Dashboard" via the header link
   - Click "+ Add Contact" → fill form → submit
   - If successful, contact appears in the Contact list
   - If you see a "Failed to load" error, check browser console (F12 → Console) for Parse error details

2. **Test via Back4App Data Browser:**
   - In Back4App Dashboard, open "Database" → "Data Browser" → select "Contact"
   - You should see any contacts created via the frontend listed here
   - This confirms the frontend successfully wrote to the backend

3. **If you see Parse 500 errors:**
   - Class doesn't exist: create it per steps above
   - CLP denies access: update CLP to allow "Authenticated Users" → "Find" / "Create" / "Update" / "Delete"
   - Network issue: check browser DevTools → Network tab for failed Parse REST API requests (should return 200/201)

## Troubleshooting

**"Parse 500 from parseapi.back4app.com/classes/Contact"**
- Class `Contact` doesn't exist in Back4App
- Fix: Create the class via Back4App Dashboard (step 2 above)

**"No routes matched" in console**
- Routes aren't defined in `src/App.js`
- Fix: This should already be resolved; routes for `/crm/companies`, `/crm/tasks`, etc. were added. Restart dev server: `npm start`

**"Unauthorized" (401) when querying Parse**
- Environment variables not set or incorrect
- Fix: Ensure `.env.local` has valid credentials:
  ```
  REACT_APP_PARSE_APP_ID=<your App ID>
  REACT_APP_PARSE_JS_KEY=<your JS Key>
  REACT_APP_PARSE_SERVER_URL=https://parseapi.back4app.com/
  ```

**"Access denied" (403) when saving**
- CLP or object ACL blocks the operation
- Fix: Check CLP in Back4App (ensure "Authenticated Users" can create/update/delete)

## Next Steps

Once all 6 CRM classes are created and CLP is configured:
1. Restart the frontend: `npm start`
2. Log in to the app
3. Test CRM features:
   - Add a Company
   - Add a Contact (linked to the Company)
   - Add a Deal (linked to the Company)
   - Add a Task
4. Navigate to each CRM page to verify data persists

For production (Netlify deployment), ensure the same Parse environment variables are set in Netlify Site Settings → Build & deploy → Environment.

