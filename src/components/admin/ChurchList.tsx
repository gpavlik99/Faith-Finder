import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, Phone, Globe } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Church = Database['public']['Tables']['churches']['Row'];

interface ChurchListProps {
  churches: Church[];
  onEdit: (church: Church) => void;
  onDelete: (churchId: string) => void;
}

const ChurchList = ({ churches, onEdit, onDelete }: ChurchListProps) => {
  if (churches.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No churches found. Add your first church!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {churches.map((church) => (
        <Card key={church.id} className="hover:shadow-card transition-smooth">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {church.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{church.denomination}</Badge>
                    <Badge variant="outline" className="capitalize">{church.size}</Badge>
                    <Badge variant="outline">{church.location}</Badge>
                  </div>
                </div>

                {church.description && (
                  <p className="text-sm text-muted-foreground">{church.description}</p>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{church.address}</span>
                  </div>
                  {church.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{church.phone}</span>
                    </div>
                  )}
                  {church.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={church.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {church.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(church)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${church.name}?`)) {
                      onDelete(church.id);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChurchList;