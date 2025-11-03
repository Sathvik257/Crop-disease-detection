import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const diseases = [
  "Apple - Apple scab",
  "Apple - Black rot",
  "Apple - Cedar apple rust",
  "Apple - Healthy",
  "Corn - Cercospora leaf spot",
  "Corn - Common rust",
  "Corn - Northern Leaf Blight",
  "Corn - Healthy",
  "Grape - Black rot",
  "Grape - Esca (Black Measles)",
  "Grape - Leaf blight",
  "Grape - Healthy",
  "Potato - Early blight",
  "Potato - Late blight",
  "Potato - Healthy",
  "Tomato - Bacterial spot",
  "Tomato - Early blight",
  "Tomato - Late blight",
  "Tomato - Leaf Mold",
  "Tomato - Septoria leaf spot",
  "Tomato - Spider mites",
  "Tomato - Target Spot",
  "Tomato - Yellow Leaf Curl Virus",
  "Tomato - Mosaic virus",
  "Tomato - Healthy",
  "Pepper - Bacterial spot",
  "Pepper - Healthy",
  "Strawberry - Leaf scorch",
  "Strawberry - Healthy",
  "Orange - Haunglongbing (Citrus greening)",
  "Peach - Bacterial spot",
  "Peach - Healthy",
  "Cherry - Powdery mildew",
  "Cherry - Healthy",
  "Soybean - Healthy",
  "Squash - Powdery mildew",
  "Raspberry - Healthy",
  "Blueberry - Healthy"
];

function simulatePrediction() {
  const shuffled = [...diseases].sort(() => Math.random() - 0.5);
  const top3 = shuffled.slice(0, 3);
  
  const confidences = [
    Math.random() * 20 + 75,
    Math.random() * 15 + 55,
    Math.random() * 10 + 35
  ].sort((a, b) => b - a);
  
  return top3.map((disease, index) => ({
    disease,
    confidence: Math.round(confidences[index] * 10) / 10
  }));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return new Response(
        JSON.stringify({ error: 'No image file provided' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    const predictions = simulatePrediction();

    return new Response(
      JSON.stringify({ predictions }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to process image' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});