import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Loader2, ChurchIcon } from "lucide-react";
import ChurchList from "@/components/admin/ChurchList";
import ChurchForm from "@/components/admin/ChurchForm";
import AdminJobs from "@/components/admin/AdminJobs";
import type { Database } from "@/integrations/supabase/types";

type Church = Database["public"]["Tables"]["churches"]["Row"];

// Only this email can access /admin tools
const ADMIN_EMAIL = "greggmpavlik@gmail.com";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [churches, setChurches] = useState<Church[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingChurch, setEditingChurch] = useState<Church | null>(null);

  const loadChurches = async () => {
    const { data, error } = await supabase
      .from("churches")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error loading churches:", error);
      toast({
        title: "Couldn’t load churches",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setChurches((data || []) as Church[]);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!session?.user) {
          navigate("/auth");
          return;
        }

        const email = (session.user.email || "").toLowerCase();
        setUser(session.user);

        if (email === ADMIN_EMAIL.toLowerCase()) {
          setIsAdmin(true);
          await loadChurches();
        } else {
          setIsAdmin(false);
          toast({
            title: "Access denied",
            description: `Only ${ADMIN_EMAIL} can access this page.`,
            variant: "destructive",
          });
          navigate("/");
        }
      } catch (e: any) {
        console.error("Admin init error:", e);
        toast({
          title: "Something went wrong",
          description: "We couldn’t verify admin access. Please try again.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        setIsAdmin(false);
        navigate("/auth");
        return;
      }

      const email = (session.user.email || "").toLowerCase();
      setUser(session.user);

      if (email === ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
        await loadChurches();
      } else {
        setIsAdmin(false);
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleAddChurch = () => {
    setEditingChurch(null);
    setShowForm(true);
  };

  const handleEditChurch = (church: Church) => {
    setEditingChurch(church);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingChurch(null);
  };

  const handleChurchSaved = async () => {
    await loadChurches();
    handleFormClose();
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
    <div className="container py-8 space-y-6">
      <Card className="border-border/60">
        <CardHeader className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <ChurchIcon className="h-5 w-5" />
                Admin
              </CardTitle>
              <CardDescription>
                Signed in as <span className="font-medium">{user?.email}</span>
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleAddChurch}>
              <Plus className="h-4 w-4 mr-2" />
              Add church
            </Button>
          </div>

          {showForm ? (
            <ChurchForm church={editingChurch} onCancel={handleFormClose} onSaved={handleChurchSaved} />
          ) : (
            <ChurchList churches={churches} onEdit={handleEditChurch} onRefresh={loadChurches} />
          )}
        </CardContent>
      </Card>

      <AdminJobs adminEmail={ADMIN_EMAIL} />
    </div>
  );
};

export default Admin;
