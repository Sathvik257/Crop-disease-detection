import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const diseases = [
  { disease: "Late Blight", confidence: 92.5 },
  { disease: "Early Blight", confidence: 87.3 },
  { disease: "Leaf Spot", confidence: 78.9 },
  { disease: "Powdery Mildew", confidence: 95.2 },
  { disease: "Bacterial Wilt", confidence: 84.6 },
  { disease: "Fusarium Wilt", confidence: 89.1 },
  { disease: "Anthracnose", confidence: 91.4 },
  { disease: "Rust", confidence: 88.7 },
  { disease: "Mosaic Virus", confidence: 93.8 },
  { disease: "Septoria Leaf Spot", confidence: 86.2 }
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const variance = (Math.random() - 0.5) * 10;
    const confidence = Math.max(70, Math.min(99, randomDisease.confidence + variance));

    const predictions = [
      {
        disease: randomDisease.disease,
        confidence: parseFloat(confidence.toFixed(1))
      }
    ];

    return new Response(
      JSON.stringify({ predictions }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});