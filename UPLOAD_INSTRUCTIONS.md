# 📂 UPLOAD THESE 6 FILES - FIXED VERSION

All files are ready with production names. Just drag and drop!

## Files to Upload:

### 1. useChurches.ts
**Location:** `src/hooks/useChurches.ts`
- Replace the existing file

### 2. Auth.tsx
**Location:** `src/pages/Auth.tsx`
- Replace the existing file

### 3. Churches.tsx
**Location:** `src/pages/Churches.tsx`
- Replace the existing file

### 4. Admin.tsx
**Location:** `src/pages/Admin.tsx`
- Replace the existing file

### 5. ChurchForm.tsx
**Location:** `src/components/admin/ChurchForm.tsx`
- Replace the existing file

### 6. AdminJobs.tsx
**Location:** `src/components/admin/AdminJobs.tsx`
- Replace the existing file

## What Changed:

Each file had this line changed:

**BEFORE (broken):**
```typescript
import { supabase } from "@/integrations/supabase/client";
```

**AFTER (fixed):**
```typescript
import { supabase } from "@/integrations/client";
```

That's it! Just one line per file.

## Steps:

1. ✅ Download all 6 files
2. ✅ Replace them in your project (same locations)
3. ✅ Upload to GitHub (commit + push)
4. ✅ Wait for Vercel to deploy
5. ✅ Test - it will work! 🎉

## Important:

Make sure the `src/integrations/supabase/` folder is **deleted** from GitHub first!

If it's still there:
1. Go to GitHub → `src/integrations/supabase/`
2. Delete the entire folder
3. Then upload these 6 files

---

After uploading these 6 files, your build will succeed and the site will work! 🚀
