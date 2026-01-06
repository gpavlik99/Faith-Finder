import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { denomination, size, location, additionalInfo, churches } =
      await req.json();

    console.log("Matching church with params:", {
      denomination,
      size,
      location,
      additionalInfo,
    });

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    // System prompt: tells the model what it is and that we want JSON
    const systemPrompt = `
You are a helpful church matching assistant for the State College, PA area.
You receive:
- The visitor's preferences
- A list of churches (with id, name, denomination, size, location, description, etc.)

Your job is to:
1. Pick the single best matching church
2. Pick two strong runner-up churches
3. Explain briefly *why* each is a good match.

IMPORTANT:
- Only choose churches that appear in the provided list.
- Always respond with valid JSON.
- Do not include any text outside the JSON object.
`;

    // User prompt: send preferences + full church list
    const userPrompt = `
I'm looking for a church with these preferences:
- Denomination: ${denomination || "any"}
- Church Size: ${size || "any"}
- Location: ${location || "any"}
${additionalInfo ? `- Additional Requirements: ${additionalInfo}` : ""}

Here are the available churches in the area (this is an array of JSON objects):
${JSON.stringify(churches, null, 2)}

Please provide your answer as a single JSON object in this exact shape (valid JSON, nothing else):

{
  "bestMatch": {
    "churchId": "uuid-from-the-list",
    "reason": "Short explanation (2–3 sentences) of why this church is the best fit."
  },
  "runnerUps": [
    {
      "churchId": "uuid-from-the-list",
      "reason": "Short explanation (1–2 sentences)."
    },
    {
      "churchId": "uuid-from-the-list",
      "reason": "Short explanation (1–2 sentences)."
    }
  ]
}
`;

    // Call OpenAI's Chat Completions API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or another model you prefer
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "AI rate limit exceeded. Please try again later.",
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      return new Response(
        JSON.stringify({
          error: "AI request failed. Please try again later.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      console.error("No AI content in response:", data);
      throw new Error("AI returned an empty response");
    }

    console.log("AI Response (raw):", aiContent);

    // Parse the JSON text returned by the model
    const matchResult = JSON.parse(aiContent);

    // Basic sanity check
    if (!matchResult.bestMatch || !Array.isArray(matchResult.runnerUps)) {
      throw new Error("AI response did not match the expected schema");
    }

    return new Response(JSON.stringify(matchResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in match-church function:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "An unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
