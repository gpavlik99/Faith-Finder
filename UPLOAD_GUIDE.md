# 📂 File Upload Guide - Simple Drag & Drop

## Files Ready to Upload

I've renamed everything to match production. Just drag and drop!

## Step 1: Delete the Old Folder

**IMPORTANT: Do this FIRST!**

1. In your project: `src/integrations/`
2. **Delete the entire `supabase` folder**
3. This removes the broken client.ts

## Step 2: Replace These 8 Files

Download these files and put them in the right locations:

### File Locations:

**1. client.ts**
- Location: `src/integrations/client.ts`
- Replace the existing file

**2. SearchForm.tsx**
- Location: `src/components/SearchForm.tsx`
- Replace the existing file

**3. useChurches.ts**
- Location: `src/hooks/useChurches.ts`
- Replace the existing file

**4. Auth.tsx**
- Location: `src/pages/Auth.tsx`
- Replace the existing file

**5. Churches.tsx**
- Location: `src/pages/Churches.tsx`
- Replace the existing file

**6. Admin.tsx**
- Location: `src/pages/Admin.tsx`
- Replace the existing file

**7. ChurchForm.tsx**
- Location: `src/components/admin/ChurchForm.tsx`
- Replace the existing file

**8. AdminJobs.tsx**
- Location: `src/components/admin/AdminJobs.tsx`
- Replace the existing file

## Step 3: Upload to GitHub

### Using GitHub Desktop:
1. Open GitHub Desktop
2. You'll see 8 files changed (and 1 folder deleted)
3. Commit message: `Fix: Remove old client and update imports`
4. Click **Commit to main**
5. Click **Push origin**

### Using GitHub Website:
For each file, go to its location on GitHub and:
1. Click the file
2. Click pencil icon (Edit)
3. Delete all content
4. Open the new file in Notepad
5. Copy everything (Ctrl+A, Ctrl+C)
6. Paste into GitHub (Ctrl+V)
7. Click **Commit changes**

Also delete the `supabase` folder:
1. Go to `src/integrations/supabase`
2. Click on the folder
3. Delete it

## Step 4: Wait & Test

1. Wait for Vercel to deploy (2 minutes)
2. Open **Incognito window**
3. Go to your site
4. Press F12 → Console
5. You should ONLY see:
   ```
   ✅ Supabase client created successfully!
   ```
   **NO MORE ERRORS!** 🎉

## Checklist

- [ ] Delete `src/integrations/supabase/` folder
- [ ] Replace 8 files with new versions
- [ ] Upload to GitHub
- [ ] Wait for Vercel deployment
- [ ] Test in incognito window
- [ ] Site works! ✅

---

After this, your Faith Finder site will be fully functional with AI church matching! 🚀
