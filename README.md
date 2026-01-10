# Faith Finder - State College, PA

A web application to help people in State College, Pennsylvania find churches that match their preferences and needs.

## Features

- **Guided Search**: Answer simple questions to find churches that fit your criteria
- **Browse All Churches**: View comprehensive list of local churches
- **Detailed Information**: See church size, denomination, location, contact info
- **Personalized Matches**: Get top match and runner-ups with explanations
- **Mobile Friendly**: Fully responsive design works on all devices
- **Admin Panel**: Manage church listings (requires admin access)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL database + Auth + Edge Functions)
- **Hosting**: Vercel
- **Analytics**: Google Analytics / Plausible (optional)

## Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Vercel account (free tier works)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd faith-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to provision (2-3 minutes)
3. Get your Project URL and anon key from Settings > API

### 2. Run Database Migrations

In your Supabase project, go to SQL Editor and run:

```sql
-- Create churches table
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

-- Enable Row Level Security
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read churches
CREATE POLICY "Churches are viewable by everyone"
  ON churches FOR SELECT
  USING (true);
```

### 3. Add Sample Data (Optional)

```sql
INSERT INTO churches (name, denomination, size, address, location, description) VALUES
('Grace Community Church', 'Non-denominational', 'medium', '123 Main St, State College, PA 16801', 'State College', 'A welcoming community focused on fellowship'),
('St. Paul Catholic Church', 'Catholic', 'large', '456 College Ave, State College, PA 16801', 'State College', 'Traditional Catholic mass'),
('First Presbyterian', 'Presbyterian', 'medium', '789 Church St, State College, PA 16801', 'State College', 'Historic Presbyterian church');
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Done!** Your site will be live at `your-project.vercel.app`

## Project Structure

```
faith-finder/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/         # Layout components
│   │   ├── admin/          # Admin panel components
│   │   └── ChurchCard.tsx  # Church display card
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Home page
│   │   ├── Match.tsx       # Search/match page
│   │   ├── Churches.tsx    # Browse all churches
│   │   └── Admin.tsx       # Admin panel
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── types/              # TypeScript types
│   └── integrations/       # External service integrations
├── public/                 # Static assets
├── supabase/              # Supabase configuration
└── package.json           # Dependencies
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Environment Variables

Required:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

Optional:
- `VITE_GA_MEASUREMENT_ID` - Google Analytics ID
- `VITE_PLAUSIBLE_DOMAIN` - Plausible Analytics domain

## Admin Access

To make yourself an admin:

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Run (replace with your user ID):
   ```sql
   INSERT INTO user_roles (user_id, role)
   VALUES ('your-user-id-here', 'admin');
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Check the documentation in `/docs`
- Open an issue on GitHub
- Contact the maintainers

## Roadmap

- [ ] Add map view of churches
- [ ] Implement user reviews/ratings
- [ ] Add service time filters
- [ ] Create mobile app version
- [ ] Add multi-language support

---

Built with ❤️ for the State College community
