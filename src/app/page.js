"use client";

import { useState } from "react";

function toMarkdown(data) {
  let md = "";
  md += "# " + data.summary.one_liner + "\n\n";
  md += "**Assumptions:** " + data.summary.assumptions.join("; ") + "\n\n";
  md += "## Automation Opportunities\n\n";
  data.automation_opportunities.forEach(function(item, i) {
    md += "### " + (i + 1) + ". " + item.title + "\n";
    md += "**Why it matters:** " + item.why_it_matters + "\n";
    md += "**Trigger:** " + item.trigger + "\n";
    md += "**Inputs:** " + item.inputs.join(", ") + "\n";
    md += "**Steps:**\n";
    item.steps.forEach(function(s) { md += "- " + s + "\n"; });
    md += "**Tools:** " + item.tools.join(", ") + "\n";
    md += "**Effort:** " + item.estimated_effort + "\n\n";
  });
  md += "## AI Leverage Plays\n\n";
  data.ai_leverage_plays.forEach(function(item, i) {
    md += "### " + (i + 1) + ". " + item.title + "\n";
    md += "**Use case:** " + item.use_case + "\n";
    md += "**How it works:** " + item.how_it_works + "\n";
    md += "**Tools:** " + item.tools.join(", ") + "\n";
    md += "**Risk / limit:** " + item.risk_or_limit + "\n\n";
  });
  md += "## Build This Week: " + data.build_this_week.project_name + "\n\n";
  md += "**Goal:** " + data.build_this_week.goal + "\n";
  md += "**Timebox:** " + data.build_this_week.timebox_hours + " hours\n";
  md += "**MVP scope:**\n";
  data.build_this_week.mvp_scope.forEach(function(s) { md += "- " + s + "\n"; });
  md += "**Build steps:**\n";
  data.build_this_week.build_steps.forEach(function(s, i) { md += (i + 1) + ". " + s + "\n"; });
  md += "**Success criteria:**\n";
  data.build_this_week.success_criteria.forEach(function(s) { md += "- " + s + "\n"; });
  if (data.build_this_week.stretch.length) {
    md += "**Stretch:**\n";
    data.build_this_week.stretch.forEach(function(s) { md += "- " + s + "\n"; });
  }
  md += "\n";
  md += "## Skills Required\n\n";
  data.skills_required.forEach(function(item, i) {
    md += "### " + (i + 1) + ". " + item.skill + " (" + item.level + ")\n";
    md += "**Why:** " + item.why + "\n";
    md += "**Learn in 1 hour:**\n";
    item.learn_in_1_hour.forEach(function(s) { md += "- " + s + "\n"; });
    md += "**Practice task:** " + item.practice_task + "\n\n";
  });
  if (data.next_questions && data.next_questions.length) {
    md += "## Next Questions\n\n";
    data.next_questions.forEach(function(q) { md += "- " + q + "\n"; });
  }
  return md;
}

function Results({ data }) {
  return (
    <div className="results">
      <div className="results-section">
        <h2>Summary</h2>
        <div className="summary-box">
          <p>{data.summary.one_liner}</p>
          <ul>
            {data.summary.assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="results-section">
        <h2>Automation Opportunities</h2>
        {data.automation_opportunities.map((item, i) => (
          <div className="card" key={i}>
            <h3>
              {item.title}{" "}
              <span className="badge badge-effort">{item.estimated_effort}</span>
            </h3>
            <p><strong>Why it matters:</strong> {item.why_it_matters}</p>
            <p><strong>Trigger:</strong> {item.trigger}</p>
            <p><strong>Inputs:</strong> {item.inputs.join(", ")}</p>
            <p><strong>Steps:</strong></p>
            <ul>
              {item.steps.map((s, j) => (
                <li key={j}>{s}</li>
              ))}
            </ul>
            <p>
              {item.tools.map((t, j) => (
                <span className="badge" key={j}>{t}</span>
              ))}
            </p>
          </div>
        ))}
      </div>

      <div className="results-section">
        <h2>AI Leverage Plays</h2>
        {data.ai_leverage_plays.map((item, i) => (
          <div className="card" key={i}>
            <h3>{item.title}</h3>
            <p><strong>Use case:</strong> {item.use_case}</p>
            <p><strong>How it works:</strong> {item.how_it_works}</p>
            <p><strong>Risk / limit:</strong> {item.risk_or_limit}</p>
            <p>
              {item.tools.map((t, j) => (
                <span className="badge" key={j}>{t}</span>
              ))}
            </p>
          </div>
        ))}
      </div>

      <div className="results-section">
        <h2>Build This Week: {data.build_this_week.project_name}</h2>
        <p><strong>Goal:</strong> {data.build_this_week.goal}</p>
        <p><strong>Timebox:</strong> {data.build_this_week.timebox_hours} hours</p>
        <h3>MVP Scope</h3>
        <ul>
          {data.build_this_week.mvp_scope.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <h3>Build Steps</h3>
        <ul>
          {data.build_this_week.build_steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <h3>Success Criteria</h3>
        <ul>
          {data.build_this_week.success_criteria.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        {data.build_this_week.stretch.length > 0 && (
          <>
            <h3>Stretch Goals</h3>
            <ul>
              {data.build_this_week.stretch.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="results-section">
        <h2>Skills Required</h2>
        {data.skills_required.map((item, i) => (
          <div className="card" key={i}>
            <h3>
              {item.skill}{" "}
              <span className="badge badge-level">{item.level}</span>
            </h3>
            <p><strong>Why:</strong> {item.why}</p>
            <p><strong>Learn in 1 hour:</strong></p>
            <ul>
              {item.learn_in_1_hour.map((s, j) => (
                <li key={j}>{s}</li>
              ))}
            </ul>
            <p><strong>Practice task:</strong> {item.practice_task}</p>
          </div>
        ))}
      </div>

      {data.next_questions && data.next_questions.length > 0 && (
        <div className="results-section">
          <h2>Next Questions to Explore</h2>
          <ul>
            {data.next_questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [situation, setSituation] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    var trimmed = situation.trim();
    if (!trimmed) {
      setError("Please describe your business situation first.");
      return;
    }
    if (trimmed.length < 20) {
      setError("Please provide a bit more detail (at least 20 characters).");
      return;
    }

    setError("");
    setResults(null);
    setLoading(true);
    setCopied(false);

    try {
      var res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: trimmed }),
      });

      if (!res.ok) {
        var body = await res.json().catch(function() { return {}; });
        throw new Error(body.error || "Server error (" + res.status + ")");
      }

      var data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!results) return;
    var md = toMarkdown(results);
    navigator.clipboard.writeText(md).then(function() {
      setCopied(true);
      setTimeout(function() { setCopied(false); }, 2000);
    });
  }

  return (
    <div className="container">
      <div className="header">
        <h1>AI Native Operator Toolkit</h1>
        <p>
          Describe your business situation. Get an actionable AI-native operator
          plan in seconds.
        </p>
      </div>

      <div className="input-area">
        <textarea
          placeholder="Example: I run a 5-person e-commerce brand. We spend 10+ hours/week manually updating inventory across Shopify, Amazon, and our warehouse spreadsheet. Our customer support is handled via a shared Gmail inbox and we often miss messages..."
          value={situation}
          onChange={function(e) { setSituation(e.target.value); }}
          disabled={loading}
        />
      </div>

      <div className="button-row">
        <button
          className="btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Generate Plan"}
        </button>

        {results && (
          <button className="btn btn-secondary" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy as Markdown"}
          </button>
        )}
        {copied && <span className="copied-toast">Copied to clipboard</span>}
      </div>

      {error && <div className="error-box" style={{ marginTop: 16 }}>{error}</div>}

      {loading && (
        <div className="loading-box">
          <div className="spinner" />
          <p>Claude is analyzing your situation...</p>
          <p style={{ fontSize: "0.82rem", color: "#888", marginTop: 4 }}>
            This usually takes 15-30 seconds.
          </p>
        </div>
      )}

      {results && <Results data={results} />}
    </div>
  );
}
