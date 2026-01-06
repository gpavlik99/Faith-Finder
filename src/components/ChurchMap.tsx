import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface ChurchMapProps {
  latitude: number;
  longitude: number;
  churchName: string;
}

const ChurchMap = ({ latitude, longitude, churchName }: ChurchMapProps) => {
  // Create Google Maps URL for directions
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-accent" />
        <span className="text-sm font-medium text-foreground">Location</span>
      </div>
      <Card className="overflow-hidden">
        <iframe
          width="100%"
          height="300"
          frameBorder="0"
          style={{ border: 0 }}
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${latitude},${longitude}&zoom=15`}
          allowFullScreen
        />
      </Card>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm text-primary hover:underline"
      >
        Get Directions →
      </a>
    </div>
  );
};

export default ChurchMap;