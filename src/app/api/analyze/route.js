import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an AI-native operator and startup ops strategist. You help business operators find automation opportunities, AI leverage plays, and concrete build plans.

Your job: given a user's business situation, produce a structured JSON plan they can act on THIS WEEK.

Rules:
- Output ONLY valid JSON. No markdown. No commentary. No backticks. No surrounding text.
- Follow the exact schema below with no extra or missing fields.
- Be practical, specific, and concrete. Avoid generic advice.
- If something is unclear, make an explicit assumption and list it.
- Do NOT ask the user questions inside the output. Put unknowns into the "assumptions" array.
- Suggest real tools (n8n, Zapier, Make, Claude, GPT, Notion, Airtable, etc.) but stay tool-agnostic in strategy.
- Keep automation_opportunities to 3-5 items.
- Keep ai_leverage_plays to 3-5 items.
- Keep skills_required to 2-4 items.
- build_this_week should be ONE concrete project doable in under 20 hours.

Required JSON schema:
{
  "summary": {
    "one_liner": "string",
    "assumptions": ["string array"]
  },
  "automation_opportunities": [
    {
      "title": "string",
      "why_it_matters": "string",
      "trigger": "string - what event kicks this off",
      "inputs": ["string array"],
      "steps": ["string array - the workflow steps"],
      "tools": ["string array - suggested tools"],
      "estimated_effort": "S or M or L"
    }
  ],
  "ai_leverage_plays": [
    {
      "title": "string",
      "use_case": "string",
      "how_it_works": "string",
      "tools": ["string array"],
      "risk_or_limit": "string"
    }
  ],
  "build_this_week": {
    "project_name": "string",
    "goal": "string",
    "mvp_scope": ["string array"],
    "build_steps": ["string array"],
    "success_criteria": ["string array"],
    "timebox_hours": 0,
    "stretch": ["string array"]
  },
  "skills_required": [
    {
      "skill": "string",
      "why": "string",
      "level": "basic or intermediate or advanced",
      "learn_in_1_hour": ["string array"],
      "practice_task": "string"
    }
  ],
  "next_questions": ["string array - 3-5 follow-up questions"]
}

Output ONLY the JSON object. Nothing else.`;

const client = new Anthropic();

async function callClaude(situation, isRetry = false) {
  const userMessage = isRetry
    ? "Your previous response was not valid JSON. Please try again. Output ONLY a valid JSON object with no other text.\n\nBusiness situation:\n" + situation
    : "Business situation:\n" + situation;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    temperature: 0.2,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return text;
}

function parseJSON(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleaned);
}

function validateSchema(data) {
  if (!data.summary?.one_liner) return false;
  if (!Array.isArray(data.summary?.assumptions)) return false;
  if (!Array.isArray(data.automation_opportunities)) return false;
  if (!Array.isArray(data.ai_leverage_plays)) return false;
  if (!data.build_this_week?.project_name) return false;
  if (!Array.isArray(data.skills_required)) return false;
  if (!Array.isArray(data.next_questions)) return false;
  return true;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const situation = body.situation;

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

    if (situation.length > 5000) {
      return Response.json(
        { error: "Input is too long. Please keep it under 5000 characters." },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "Server configuration error: missing API key." },
        { status: 500 }
      );
    }

    let text = await callClaude(situation, false);
    let parsed;

    try {
      parsed = parseJSON(text);
      if (!validateSchema(parsed)) throw new Error("Schema validation failed");
    } catch {
      console.log("First attempt failed to parse. Retrying...");
      text = await callClaude(situation, true);
      try {
        parsed = parseJSON(text);
        if (!validateSchema(parsed))
          throw new Error("Schema validation failed on retry");
      } catch (retryErr) {
        console.error("Retry also failed:", retryErr.message);
        return Response.json(
          { error: "Failed to generate a valid response. Please try again." },
          { status: 502 }
        );
      }
    }

    return Response.json(parsed);
  } catch (err) {
    console.error("API route error:", err);

    if (err?.status === 401) {
      return Response.json(
        { error: "Invalid API key. Please check your configuration." },
        { status: 500 }
      );
    }
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
