import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an AI-native operator and startup ops strategist. Given a business situation description, generate exactly 3 smart scoping questions that will help you produce a much better automation plan.

Rules:
- Output ONLY valid JSON. No markdown. No backticks. No surrounding text.
- Each question should help clarify something that would dramatically improve your recommendations.
- Focus on: team size/roles, current tools, biggest pain points, budget/timeline constraints, and technical comfort level.
- Make questions specific to what the user described, not generic.
- Each question should have 3-4 multiple choice options plus a freetext option.
- Keep questions short and clear.

Required JSON schema:
{
  "questions": [
    {
      "id": "q1",
      "question": "string",
      "options": ["string", "string", "string"],
      "allow_freetext": true
    },
    {
      "id": "q2",
      "question": "string",
      "options": ["string", "string", "string"],
      "allow_freetext": true
    },
    {
      "id": "q3",
      "question": "string",
      "options": ["string", "string", "string"],
      "allow_freetext": true
    }
  ]
}

Output ONLY the JSON object. Nothing else.`;

const client = new Anthropic();

async function callClaude(situation, isRetry = false) {
  const userMessage = isRetry
    ? "Your previous response was not valid JSON. Please try again. Output ONLY a valid JSON object.\n\nBusiness situation:\n" + situation
    : "Business situation:\n" + situation;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    temperature: 0.3,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content
    .filter(function(block) { return block.type === "text"; })
    .map(function(block) { return block.text; })
    .join("");

  return text;
}

function parseJSON(text) {
  var cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleaned);
}

export async function POST(request) {
  try {
    var body = await request.json();
    var situation = body.situation;

    if (!situation || typeof situation !== "string") {
      return Response.json(
        { error: "Please provide a business situation." },
        { status: 400 }
      );
    }

    if (situation.trim().length < 20) {
      return Response.json(
        { error: "Please provide more detail (at least 20 characters)." },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "Server configuration error: missing API key." },
        { status: 500 }
      );
    }

    var text = await callClaude(situation, false);
    var parsed;

    try {
      parsed = parseJSON(text);
      if (!parsed.questions || parsed.questions.length < 2) {
        throw new Error("Invalid questions format");
      }
    } catch {
      console.log("First attempt failed. Retrying...");
      text = await callClaude(situation, true);
      try {
        parsed = parseJSON(text);
        if (!parsed.questions || parsed.questions.length < 2) {
          throw new Error("Invalid questions format on retry");
        }
      } catch (retryErr) {
        console.error("Retry also failed:", retryErr.message);
        return Response.json(
          { error: "Failed to generate questions. Please try again." },
          { status: 502 }
        );
      }
    }

    return Response.json(parsed);
  } catch (err) {
    console.error("Questions API error:", err);

    if (err?.status === 429) {
      return Response.json(
        { error: "Rate limited. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
