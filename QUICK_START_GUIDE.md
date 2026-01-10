# Faith Finder - Quick Start Guide (For Non-Developers)

## What You Need to Know

This guide will help you get your Faith Finder website up and running, even if you've never coded before. Think of this like following a recipe - just follow the steps in order!

---

## What This App Does

Faith Finder helps people in State College, PA find churches that match their preferences. Users answer questions about what they're looking for (church size, denomination, worship style, etc.) and get personalized recommendations.

---

## What You Need (All Free!)

1. **A Computer** with internet access
2. **GitHub Account** - where your code lives (like Google Drive for code)
3. **Vercel Account** - where your website is hosted (like WordPress hosting)
4. **Supabase Account** - where your church data is stored (like a database)
5. **About 30-60 minutes** of your time

---

## Step-by-Step Setup

### Part 1: Get the Code (5 minutes)

1. **Download the improved files:**
   - I've created improved versions of your files
   - Download them from the `improved-files` folder

2. **Replace old files with new ones:**
   - In your project folder, replace these files with the improved versions:
     - `src/components/ChurchCard.tsx`
     - `src/components/SearchForm.tsx`
     - `src/hooks/useChurches.ts`
     - `src/lib/analytics.ts`
     - `src/types/index.ts`

3. **Add new configuration files:**
   - Copy `.env.example` to `.env.local`
   - You'll fill this in later with your Supabase details

### Part 2: Set Up Your Database (Supabase) - 15 minutes

**What is Supabase?** It's where all your church information is stored, like a digital filing cabinet.

1. **Create Account:**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign up with Google or GitHub (easiest)

2. **Create a New Project:**
   - Click "New project"
   - Name: `faith-finder`
   - Database Password: Create a strong password (SAVE THIS!)
   - Region: Choose one close to State College, PA (US East is good)
   - Click "Create new project"
   - Wait 2-3 minutes for it to set up

3. **Get Your Connection Keys:**
   - Click the ⚙️ gear icon → "API"
   - You'll see two important things:
     - **Project URL** (looks like: https://abcd1234.supabase.co)
     - **anon public key** (long string of letters/numbers)
   - Copy both of these

4. **Add Keys to Your Project:**
   - Open your `.env.local` file
   - Paste in:
     ```
     VITE_SUPABASE_URL=paste-your-url-here
     VITE_SUPABASE_ANON_KEY=paste-your-key-here
     ```

5. **Create Your Database Tables:**
   - In Supabase, click "SQL Editor" on the left
   - Click "New query"
   - Copy the SQL code from `DEPLOYMENT_GUIDE.md` (Step 3 of Supabase Setup)
   - Paste it in and click "Run"
   - You should see "Success" messages

6. **Add Some Test Churches:**
   - In SQL Editor, create another new query
   - Copy the sample data SQL from the deployment guide
   - Click "Run"
   - Now you have 3 test churches in your database!

### Part 3: Test Locally (10 minutes)

**What is "running locally"?** It means viewing the website on your own computer before putting it online.

1. **Open Terminal/Command Prompt:**
   - Mac: Search for "Terminal"
   - Windows: Search for "Command Prompt" or "PowerShell"

2. **Navigate to Your Project:**
   ```bash
   cd path/to/your/faith-finder-folder
   ```
   (Replace `path/to/your/faith-finder-folder` with where you saved the project)

3. **Install Dependencies:**
   ```bash
   npm install
   ```
   This downloads all the tools the website needs. Takes 2-5 minutes.

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   You should see:
   ```
   ➜  Local:   http://localhost:5173/
   ```

5. **Open in Browser:**
   - Hold Ctrl/Cmd and click that link
   - OR manually type `http://localhost:5173` in your browser
   - Your website should appear!

6. **Test It Out:**
   - Try filling out the search form
   - Check if the test churches appear
   - Make sure all pages work

### Part 4: Put It Online (Vercel) - 15 minutes

**What is Vercel?** It's like a hosting service that makes your website available to everyone on the internet.

1. **Push to GitHub First:**
   ```bash
   git add .
   git commit -m "Updated with improvements"
   git push
   ```

2. **Sign Up for Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign Up"
   - Use your GitHub account (easiest)

3. **Import Your Project:**
   - Click "Add New..." → "Project"
   - Find your `faith-finder` repository
   - Click "Import"

4. **Configure Build Settings:**
   - Framework Preset: Vite (should auto-detect)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add `VITE_SUPABASE_URL` → paste your Supabase URL
   - Add `VITE_SUPABASE_ANON_KEY` → paste your Supabase key
   - Click "Deploy"

6. **Wait for Deployment:**
   - This takes 1-2 minutes
   - You'll see a progress screen
   - When done, you'll get a link like: `faith-finder-abc123.vercel.app`

7. **Visit Your Live Site:**
   - Click the link
   - Your website is now LIVE on the internet! 🎉
   - Share it with friends!

---

## What Each File Does (Simple Explanation)

### `/src` Folder - Your App Code
- **`/components`** - Reusable pieces of the website (like building blocks)
  - `ChurchCard.tsx` - How each church is displayed
  - `SearchForm.tsx` - The questionnaire users fill out
  
- **`/pages`** - Different pages of your website
  - `Index.tsx` - Home page
  - `Match.tsx` - Search/matching page
  - `Churches.tsx` - Browse all churches
  
- **`/hooks`** - Special functions for getting data
  - `useChurches.ts` - Gets church data from database
  
- **`/lib`** - Helper tools
  - `analytics.ts` - Tracks how people use your site
  
- **`/types`** - Definitions of what data looks like

### Configuration Files (In Root Folder)
- **`package.json`** - Lists all the tools your app needs
- **`.env.local`** - Your secret keys (NEVER share this!)
- **`vercel.json`** - Settings for hosting
- **`tailwind.config.ts`** - Visual styling settings
- **`vite.config.ts`** - Build tool settings

---

## Common Tasks

### Adding a New Church (Via Admin Panel)
1. Go to your site: `yoursite.com/admin`
2. Log in (you need to be an admin)
3. Fill out the church form
4. Click "Add Church"

### Making Yourself an Admin
1. Go to Supabase
2. Go to "SQL Editor"
3. Run this (replace YOUR_USER_ID with your actual ID):
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('YOUR_USER_ID', 'admin');
   ```

### Updating Your Website
1. Make changes to your code
2. Test locally: `npm run dev`
3. If it looks good:
   ```bash
   git add .
   git commit -m "What you changed"
   git push
   ```
4. Vercel automatically updates your site!

### Checking How Many People Visit
1. Go to Vercel dashboard
2. Click your project
3. Click "Analytics"
4. See visitor numbers, popular pages, etc.

---

## Troubleshooting

### "It's not working!"
**First, try these:**
1. Refresh the page (Ctrl+R or Cmd+R)
2. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Check if your environment variables are set correctly
4. Look at the browser console for error messages (Press F12)

### "I see an error message"
1. Read the error message carefully
2. Google the exact error message
3. Check the Deployment Guide for that specific error
4. Still stuck? Check the resources below

### "Churches aren't showing up"
1. Make sure you added sample churches to Supabase
2. Check your Supabase connection (URL and key are correct)
3. Look at browser console for errors (F12)

### "The site looks broken on my phone"
1. The design is responsive, so it should work
2. Try a different phone/browser
3. Check if images are loading
4. Clear cache on your phone

---

## Making Changes Safely

**Golden Rule:** Always test locally before deploying!

1. **Make changes** to your code
2. **Test locally:**
   ```bash
   npm run dev
   ```
3. **If it works,** commit and push:
   ```bash
   git add .
   git commit -m "Describe what you changed"
   git push
   ```
4. **Vercel auto-deploys** - wait 2 minutes, check your live site

**If something breaks:**
1. Don't panic!
2. In GitHub, you can revert to a previous version
3. Or, in Vercel, click "Rollback" to go back to the last working version

---

## Getting Help

### Free Resources
- **Supabase Docs:** [docs.supabase.com](https://docs.supabase.com)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **YouTube Tutorials:** Search "Supabase React tutorial" or "Vercel deployment"

### Communities
- Supabase Discord (very helpful!)
- Stack Overflow (tag: supabase, react)
- Reddit: r/webdev, r/reactjs

### When to Ask for Help
- Error messages you don't understand
- Database isn't working
- Deployment fails
- Need to add a complex feature

---

## Next Steps After Launch

### Week 1
- [ ] Add real church data (replace sample churches)
- [ ] Test the search function thoroughly
- [ ] Share with 5-10 friends for feedback
- [ ] Set up Google Analytics

### Month 1
- [ ] Add 20-30 churches from State College area
- [ ] Create social media accounts
- [ ] Share in local Facebook groups
- [ ] Monitor user feedback

### Month 3
- [ ] Add more churches (aim for 50+)
- [ ] Improve search based on user feedback
- [ ] Consider adding features (maps, reviews, etc.)
- [ ] Promote to local churches

---

## Important Reminders

✅ **DO:**
- Test changes locally first
- Keep your `.env.local` file secret
- Back up your Supabase data regularly
- Ask for help when stuck
- Celebrate small wins!

❌ **DON'T:**
- Share your environment variables publicly
- Make changes directly on the live site
- Delete things without backing up
- Give up if something doesn't work immediately
- Forget to commit your changes

---

## You've Got This!

Remember: Every developer was a beginner once. The fact that you're working on this is amazing! Take it one step at a time, don't rush, and don't be afraid to ask for help.

Your Faith Finder app is going to help a lot of people find their church home in State College. That's a meaningful project! 🙏

---

## Quick Reference Card

### Essential Commands
```bash
npm install          # Install dependencies
npm run dev          # Test locally
npm run build        # Build for production
git add .            # Stage changes
git commit -m "msg"  # Save changes
git push             # Upload to GitHub
```

### Important URLs
- Your Code: `github.com/YOUR_USERNAME/faith-finder`
- Your Database: `app.supabase.com`
- Your Website: `your-project.vercel.app`
- Deployment Logs: `vercel.com/dashboard`

### Key Files to Know
- `.env.local` - Your secret keys
- `src/pages/Index.tsx` - Home page
- `src/components/SearchForm.tsx` - Search form
- `DEPLOYMENT_GUIDE.md` - Detailed instructions
