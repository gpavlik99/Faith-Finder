-- Create enum for church size
CREATE TYPE public.church_size AS ENUM ('small', 'medium', 'large');

-- Create churches table
CREATE TABLE public.churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  denomination TEXT NOT NULL,
  size public.church_size NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  website TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on churches
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;

-- Public can read churches
CREATE POLICY "Anyone can view churches"
  ON public.churches
  FOR SELECT
  USING (true);

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = is_admin.user_id
      AND role = 'admin'
  );
$$;

-- Only admins can insert, update, delete churches
CREATE POLICY "Admins can insert churches"
  ON public.churches
  FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update churches"
  ON public.churches
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete churches"
  ON public.churches
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- Users can view their own roles
CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only admins can manage roles
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for churches table
CREATE TRIGGER set_churches_updated_at
  BEFORE UPDATE ON public.churches
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample churches in State College area
INSERT INTO public.churches (name, denomination, size, location, address, description, latitude, longitude) VALUES
('Grace Lutheran Church', 'Lutheran', 'large', 'State College', '205 S Garner St, State College, PA 16801', 'A welcoming community focused on service and worship', 40.7934, -77.8600),
('St. Paul''s United Methodist Church', 'Methodist', 'medium', 'State College', '250 E College Ave, State College, PA 16801', 'Traditional Methodist church in downtown State College', 40.7959, -77.8581),
('Our Lady of Victory Catholic Church', 'Catholic', 'large', 'State College', '820 Westerly Pkwy, State College, PA 16801', 'Active Catholic parish serving the community', 40.8012, -77.8734),
('First Baptist Church', 'Baptist', 'medium', 'Bellefonte', '123 E High St, Bellefonte, PA 16823', 'Family-friendly Baptist congregation', 40.9139, -77.7825),
('Pleasant Gap Presbyterian', 'Presbyterian', 'small', 'Pleasant Gap', '301 W College Ave, Pleasant Gap, PA 16823', 'Small, intimate Presbyterian community', 40.8456, -77.7303),
('State College Assembly of God', 'Assembly of God', 'medium', 'State College', '1350 N Atherton St, State College, PA 16803', 'Spirit-filled worship and community', 40.8156, -77.8589),
('Calvary Harvest Fields', 'Non-denominational', 'large', 'State College', '1200 Corporate Dr, State College, PA 16801', 'Contemporary worship and dynamic programs', 40.7845, -77.8923),
('St. Andrew''s Episcopal Church', 'Episcopal', 'medium', 'State College', '208 W Foster Ave, State College, PA 16801', 'Historic Episcopal church with inclusive community', 40.7923, -77.8612);