import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Church = Database['public']['Tables']['churches']['Row'];

const DENOMINATIONS = [
  "Baptist",
  "Catholic",
  "Lutheran",
  "Methodist",
  "Presbyterian",
  "Episcopal",
  "Assembly of God",
  "Non-denominational",
  "Other"
];

const LOCATIONS = [
  "State College",
  "Bellefonte",
  "Pleasant Gap",
  "Boalsburg",
  "Lemont",
  "Pine Grove Mills"
];

interface ChurchFormProps {
  church: Church | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ChurchForm = ({ church, onSuccess, onCancel }: ChurchFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    denomination: "",
    size: "medium" as "small" | "medium" | "large",
    location: "",
    address: "",
    description: "",
    latitude: "",
    longitude: "",
    website: "",
    phone: ""
  });

  useEffect(() => {
    if (church) {
      setFormData({
        name: church.name,
        denomination: church.denomination,
        size: church.size as "small" | "medium" | "large",
        location: church.location,
        address: church.address,
        description: church.description || "",
        latitude: church.latitude?.toString() || "",
        longitude: church.longitude?.toString() || "",
        website: church.website || "",
        phone: church.phone || ""
      });
    }
  }, [church]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const churchData = {
        name: formData.name,
        denomination: formData.denomination,
        size: formData.size,
        location: formData.location,
        address: formData.address,
        description: formData.description || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        website: formData.website || null,
        phone: formData.phone || null
      };

      let error;
      
      if (church) {
        // Update existing church
        const result = await supabase
          .from('churches')
          .update(churchData)
          .eq('id', church.id);
        error = result.error;
      } else {
        // Insert new church
        const result = await supabase
          .from('churches')
          .insert([churchData]);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Church ${church ? 'updated' : 'added'} successfully`
      });
      onSuccess();
    } catch (error: any) {
      console.error('Error saving church:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save church",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="name">Church Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="denomination">Denomination *</Label>
          <Select 
            value={formData.denomination} 
            onValueChange={(value) => setFormData({ ...formData, denomination: value })}
          >
            <SelectTrigger id="denomination">
              <SelectValue placeholder="Select denomination" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {DENOMINATIONS.map((denom) => (
                <SelectItem key={denom} value={denom}>
                  {denom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Church Size *</Label>
          <Select 
            value={formData.size} 
            onValueChange={(value) => setFormData({ ...formData, size: value as "small" | "medium" | "large" })}
          >
            <SelectTrigger id="size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Select 
            value={formData.location} 
            onValueChange={(value) => setFormData({ ...formData, location: value })}
          >
            <SelectTrigger id="location">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {LOCATIONS.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            placeholder="40.7934"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            placeholder="-77.8600"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-gradient-spiritual"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            church ? 'Update Church' : 'Add Church'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChurchForm;
