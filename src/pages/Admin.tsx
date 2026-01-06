import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Loader2, ChurchIcon } from "lucide-react";
import ChurchList from "@/components/admin/ChurchList";
import ChurchForm from "@/components/admin/ChurchForm";
import type { Database } from "@/integrations/supabase/types";

type Church = Database['public']['Tables']['churches']['Row'];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [churches, setChurches] = useState<Church[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChurch, setEditingChurch] = useState<Church | null>(null);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        checkAdminStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    await checkAdminStatus(session.user.id);
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsAdmin(true);
        loadChurches();
      } else {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to access this page.",
          variant: "destructive"
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error('Error checking admin status:', error);
      toast({
        title: "Error",
        description: "Failed to verify admin status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadChurches = async () => {
    try {
      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .order('name');

      if (error) throw error;
      setChurches(data || []);
    } catch (error: any) {
      console.error('Error loading churches:', error);
      toast({
        title: "Error",
        description: "Failed to load churches",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleEdit = (church: Church) => {
    setEditingChurch(church);
    setShowForm(true);
  };

  const handleDelete = async (churchId: string) => {
    try {
      const { error } = await supabase
        .from('churches')
        .delete()
        .eq('id', churchId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Church deleted successfully"
      });
      loadChurches();
    } catch (error: any) {
      console.error('Error deleting church:', error);
      toast({
        title: "Error",
        description: "Failed to delete church",
        variant: "destructive"
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingChurch(null);
    loadChurches();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingChurch(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChurchIcon className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
                <p className="text-sm text-muted-foreground">Manage church information</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate("/")}>
                View Site
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!showForm ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Church Directory</h2>
                <p className="text-muted-foreground mt-1">
                  Manage all churches in the State College area
                </p>
              </div>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-spiritual"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Church
              </Button>
            </div>

            <ChurchList 
              churches={churches}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>
                {editingChurch ? 'Edit Church' : 'Add New Church'}
              </CardTitle>
              <CardDescription>
                {editingChurch 
                  ? 'Update church information' 
                  : 'Add a new church to the directory'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChurchForm
                church={editingChurch}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;