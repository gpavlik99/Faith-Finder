# Deployment Guide

## Step-by-Step Deployment to Vercel

### 1. Prepare Your Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to initialize
4. Go to Settings > API
5. Copy your:
   - Project URL
   - anon/public key

### 3. Create Database Tables

In Supabase SQL Editor, run:

```sql
-- Churches table
CREATE TABLE churches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  denomination TEXT NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  address TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  phone TEXT,
  website TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles table
CREATE TABLE user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = $1 AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Churches viewable by everyone"
  ON churches FOR SELECT USING (true);

CREATE POLICY "Admins can modify churches"
  ON churches FOR ALL
  USING (is_admin(auth.uid()));
```

### 4. Deploy to Vercel

**Option A: Via Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase key
6. Click "Deploy"

**Option B: Via CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 5. Verify Deployment

1. Visit your live URL
2. Test the search functionality
3. Try browsing all churches
4. Check mobile responsiveness

### 6. Make Yourself Admin

In Supabase SQL Editor:

```sql
-- First, sign up on your live site
-- Then get your user ID from auth.users table
-- Finally, run:
INSERT INTO user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin');
```

### 7. Add Church Data

1. Go to `yoursite.com/admin`
2. Log in
3. Add churches one by one

OR bulk import via Supabase SQL Editor:

```sql
INSERT INTO churches (name, denomination, size, address, location, description)
VALUES
  ('Church Name', 'Denomination', 'medium', 'Full Address', 'City', 'Description'),
  -- Add more churches...
```

## Updating Your Site

```bash
# Make changes locally
npm run dev

# Test changes
# When ready:
git add .
git commit -m "Description of changes"
git push

# Vercel auto-deploys!
```

## Custom Domain (Optional)

1. In Vercel Dashboard > Settings > Domains
2. Add your domain
3. Follow DNS instructions
4. Wait for verification (can take up to 48 hours)

## Troubleshooting

### Build Fails
- Check environment variables are set
- Look at build logs in Vercel
- Try building locally: `npm run build`

### Database Connection Fails
- Verify Supabase URL and key
- Check RLS policies
- Ensure tables exist

### Site is Slow
- Enable Vercel Analytics
- Check Supabase query performance
- Optimize images

## Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Logs**: Database and auth logs
- **Google Analytics**: User behavior tracking (optional)

## Support

Need help? Check:
- README.md for basics
- GitHub Issues for known problems
- Vercel/Supabase documentation
