// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Church = {
  id: string;
  name?: string;
  denomination?: string;
  size?: string;
  location?: string;
  address?: string;
  description?: string;
  website?: string;
  phone?: string;
};

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

console.info("match-church function started");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY in Supabase secrets." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const raw = await req.text();
    const body = raw ? JSON.parse(raw) : {};

    const denomination = body?.denomination ?? "";
    const size = body?.size ?? "";
    const location = body?.location ?? "";
    const additionalInfo = body?.additionalInfo ?? "";
    const churches: Church[] = Array.isArray(body?.churches) ? body.churches : [];

    if (!size || !location || churches.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Invalid input: size, location, and churches are required.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const system = `You match a user to a church from a provided list.

Return ONLY valid JSON with this exact shape:
{
  "bestMatch": { "churchId": string, "reason": string },
  "runnerUps": [ { "churchId": string, "reason": string }, { "churchId": string, "reason": string } ]
}

Rules:
- churchId MUST be one of the provided church ids.
- Pick exactly 1 bestMatch and exactly 2 runnerUps.
- bestMatch.reason MUST start with "Best match because:" and include 2–4 bullet points.
- runnerUps reasons should be 1–2 sentences each.
- Be specific: reference denomination/size/location/other preferences when relevant.
- Plain language. No marketing fluff.`;

    const user = `User preferences:
- Denomination: ${denomination || "No preference / Not sure"}
- Size: ${size}
- Location: ${location}
- Additional info: ${additionalInfo || "(none)"}

Church list (JSON):
${JSON.stringify(churches)}`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(
        JSON.stringify({ error: "OpenAI request failed", details: errText }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    const parsed = safeJsonParse(content);

    if (!parsed?.bestMatch?.churchId || !Array.isArray(parsed?.runnerUps)) {
      return new Response(
        JSON.stringify({ error: "Model returned invalid JSON", raw: content }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

