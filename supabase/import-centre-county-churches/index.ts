// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function pickWebsite(tags: Record<string, string>) {
  return (
    tags["contact:website"] ||
    tags["website"] ||
    tags["url"] ||
    ""
  ).trim();
}

function pickPhone(tags: Record<string, string>) {
  return (tags["contact:phone"] || tags["phone"] || "").trim();
}

function pickDenomination(tags: Record<string, string>) {
  return (
    tags["denomination"] ||
    tags["christian:denomination"] ||
    tags["religious_order"] ||
    ""
  ).trim();
}

function buildAddress(tags: Record<string, string>) {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:city"],
    tags["addr:state"],
    tags["addr:postcode"],
  ].filter(Boolean);
  return parts.join(" ").trim();
}

function guessLocation(tags: Record<string, string>) {
  return (
    tags["addr:city"] ||
    tags["addr:place"] ||
    tags["is_in:city"] ||
    "Centre County"
  ).trim();
}

function normalizeName(tags: Record<string, string>) {
  return (tags["name"] || tags["official_name"] || tags["brand"] || "").trim();
}

function isLikelyChurch(tags: Record<string, string>) {
  // We’re looking for Christian places of worship and church buildings
  const amenity = tags["amenity"];
  const building = tags["building"];
  const religion = (tags["religion"] || "").toLowerCase();
  const place = tags["place_of_worship"] || ""; // sometimes used
  return (
    (amenity === "place_of_worship" && (!religion || religion === "christian")) ||
    building === "church" ||
    place === "church"
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Require a simple shared secret so random people can’t trigger large imports
    const ADMIN_IMPORT_KEY = Deno.env.get("ADMIN_IMPORT_KEY");
    if (ADMIN_IMPORT_KEY) {
      const key = req.headers.get("x-admin-import-key") || "";
      if (key !== ADMIN_IMPORT_KEY) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Overpass QL:
    // - Find the admin boundary area for Centre County (admin_level=6 county)
    // - Pull places of worship + church buildings
    // - Output center for ways/relations
    const overpassQuery = `
[out:json][timeout:90];
area["name"="Centre County"]["boundary"="administrative"]["admin_level"="6"]->.a;
(
  nwr(area.a)["amenity"="place_of_worship"];
  nwr(area.a)["building"="church"];
);
out tags center;
`;

    const endpoint = "https://overpass-api.de/api/interpreter";
    const overpassResp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    if (!overpassResp.ok) {
      const text = await overpassResp.text();
      return new Response(JSON.stringify({ error: "Overpass failed", details: text }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const overpassJson = await overpassResp.json();
    const elements: OverpassElement[] = overpassJson?.elements || [];

    const rows = elements
      .filter((el) => el.tags && isLikelyChurch(el.tags))
      .map((el) => {
        const tags = el.tags || {};
        const name = normalizeName(tags);
        const denom = pickDenomination(tags);
        const website = pickWebsite(tags);
        const phone = pickPhone(tags);
        const address = buildAddress(tags);
        const location = guessLocation(tags);
        const lat = el.center?.lat ?? el.lat;
        const lon = el.center?.lon ?? el.lon;

        // If no name, skip (keeps DB cleaner)
        if (!name) return null;

        return {
          name,
          denomination: denom || null,
          size: null, // unknown from OSM; you can edit later in admin UI
          location,
          address: address || null,
          description: tags["description"] || null,
          website: website || null,
          phone: phone || null,
          latitude: typeof lat === "number" ? lat : null,
          longitude: typeof lon === "number" ? lon : null,
          osm_type: el.type,
          osm_id: el.id,
          source: "osm",
        };
      })
      .filter(Boolean) as any[];

    // Upsert by (osm_type, osm_id)
    const { data, error } = await supabase
      .from("churches")
      .upsert(rows, { onConflict: "osm_type,osm_id" })
      .select("id");

    if (error) {
      return new Response(JSON.stringify({ error: "Upsert failed", details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        imported: rows.length,
        upserted: data?.length ?? 0,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
