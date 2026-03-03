"use client";

import { useState } from "react";

function toMarkdown(data) {
  var md = "";
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
    md += "**Effort:** " + item.estimated_effort + "\n";
    if (item.time_saved_weekly) md += "**Time saved:** " + item.time_saved_weekly + "\n";
    if (item.roi_score) md += "**ROI:** " + item.roi_score + "\n";
    md += "\n";
  });
  md += "## AI Leverage Plays\n\n";
  data.ai_leverage_plays.forEach(function(item, i) {
    md += "### " + (i + 1) + ". " + item.title + "\n";
    md += "**Use case:** " + item.use_case + "\n";
    md += "**How it works:** " + item.how_it_works + "\n";
    md += "**Tools:** " + item.tools.join(", ") + "\n";
    md += "**Risk / limit:** " + item.risk_or_limit + "\n";
    if (item.impact_level) md += "**Impact:** " + item.impact_level + "\n";
    if (item.time_saved_weekly) md += "**Time saved:** " + item.time_saved_weekly + "\n";
    md += "\n";
  });
  md += "## Build This Week: " + data.build_this_week.project_name + "\n\n";
  md += "**Goal:** " + data.build_this_week.goal + "\n";
  md += "**Timebox:** " + data.build_this_week.timebox_hours + " hours\n";
  if (data.build_this_week.estimated_weekly_roi) md += "**Estimated weekly ROI:** " + data.build_this_week.estimated_weekly_roi + "\n";
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

function RoiIndicator({ label, level }) {
  if (!level) return null;
  var normalized = (level || "").toLowerCase();
  return (
    <div className="roi-item">
      <span className="roi-icon">{label === "ROI" ? "\u{1F4C8}" : label === "Impact" ? "\u26A1" : "\u2699\uFE0F"}</span>
      <span style={{ fontSize: "0.78rem", color: "#555" }}>{label}:</span>
      <div className="roi-bar-container">
        <div className={"roi-bar " + normalized} />
      </div>
      <span className={"roi-label " + normalized}>{normalized}</span>
    </div>
  );
}

function TimeSavedBadge({ time }) {
  if (!time) return null;
  return (
    <span className="time-saved-badge">
      {"\u23F1"} {time}
    </span>
  );
}

function StepIndicator({ current }) {
  var steps = ["Describe", "Refine", "Plan"];
  return (
    <div className="step-indicator">
      {steps.map(function(label, i) {
        var isActive = i === current;
        var isDone = i < current;
        var dotClass = "step-dot " + (isActive ? "active" : isDone ? "done" : "upcoming");
        var labelClass = "step-label " + (isActive ? "active" : "inactive");
        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div className={dotClass}>
              {isDone ? "\u2713" : i + 1}
            </div>
            <span className={labelClass}>{label}</span>
            {i < 2 && (
              <div className={"step-line " + (isDone ? "done" : "upcoming")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Results({ data }) {
  return (
    <div className="results fade-in">
      <div className="results-section">
        <h2>Summary</h2>
        <div className="summary-box">
          <p>{data.summary.one_liner}</p>
          <ul>
            {data.summary.assumptions.map(function(a, i) {
              return <li key={i}>{a}</li>;
            })}
          </ul>
        </div>
      </div>

      <div className="results-section">
        <h2>Automation Opportunities</h2>
        {data.automation_opportunities.map(function(item, i) {
          return (
            <div className="card" key={i}>
              <h3>
                {item.title}{" "}
                <span className="badge badge-effort">{item.estimated_effort}</span>
                <TimeSavedBadge time={item.time_saved_weekly} />
              </h3>
              <div className="roi-strip">
                <RoiIndicator label="ROI" level={item.roi_score} />
                <RoiIndicator label="Complexity" level={item.implementation_complexity} />
              </div>
              <p><strong>Why it matters:</strong> {item.why_it_matters}</p>
              <p><strong>Trigger:</strong> {item.trigger}</p>
              <p><strong>Inputs:</strong> {item.inputs.join(", ")}</p>
              <p><strong>Steps:</strong></p>
              <ul>
                {item.steps.map(function(s, j) {
                  return <li key={j}>{s}</li>;
                })}
              </ul>
              <p>
                {item.tools.map(function(t, j) {
                  return <span className="badge" key={j}>{t}</span>;
                })}
              </p>
            </div>
          );
        })}
      </div>

      <div className="results-section">
        <h2>AI Leverage Plays</h2>
        {data.ai_leverage_plays.map(function(item, i) {
          return (
            <div className="card" key={i}>
              <h3>
                {item.title}
                {item.time_saved_weekly && (
                  <>{" "}<TimeSavedBadge time={item.time_saved_weekly} /></>
                )}
              </h3>
              <div className="roi-strip">
                <RoiIndicator label="Impact" level={item.impact_level} />
              </div>
              <p><strong>Use case:</strong> {item.use_case}</p>
              <p><strong>How it works:</strong> {item.how_it_works}</p>
              <p><strong>Risk / limit:</strong> {item.risk_or_limit}</p>
              <p>
                {item.tools.map(function(t, j) {
                  return <span className="badge" key={j}>{t}</span>;
                })}
              </p>
            </div>
          );
        })}
      </div>

      <div className="results-section">
        <h2>Build This Week: {data.build_this_week.project_name}</h2>
        <p><strong>Goal:</strong> {data.build_this_week.goal}</p>
        <p><strong>Timebox:</strong> {data.build_this_week.timebox_hours} hours</p>
        {data.build_this_week.estimated_weekly_roi && (
          <div className="roi-summary-card">
            <div className="roi-summary-stat">
              <div className="number">{data.build_this_week.timebox_hours}h</div>
              <div className="label">To Build</div>
            </div>
            <div className="roi-summary-arrow">&rarr;</div>
            <div className="roi-summary-stat">
              <div className="number">{data.build_this_week.estimated_weekly_roi}</div>
              <div className="label">Saved Weekly</div>
            </div>
          </div>
        )}
        <h3>MVP Scope</h3>
        <ul>
          {data.build_this_week.mvp_scope.map(function(s, i) {
            return <li key={i}>{s}</li>;
          })}
        </ul>
        <h3>Build Steps</h3>
        <ul>
          {data.build_this_week.build_steps.map(function(s, i) {
            return <li key={i}>{s}</li>;
          })}
        </ul>
        <h3>Success Criteria</h3>
        <ul>
          {data.build_this_week.success_criteria.map(function(s, i) {
            return <li key={i}>{s}</li>;
          })}
        </ul>
        {data.build_this_week.stretch.length > 0 && (
          <>
            <h3>Stretch Goals</h3>
            <ul>
              {data.build_this_week.stretch.map(function(s, i) {
                return <li key={i}>{s}</li>;
              })}
            </ul>
          </>
        )}
      </div>

      <div className="results-section">
        <h2>Skills Required</h2>
        {data.skills_required.map(function(item, i) {
          return (
            <div className="card" key={i}>
              <h3>
                {item.skill}{" "}
                <span className="badge badge-level">{item.level}</span>
              </h3>
              <p><strong>Why:</strong> {item.why}</p>
              <p><strong>Learn in 1 hour:</strong></p>
              <ul>
                {item.learn_in_1_hour.map(function(s, j) {
                  return <li key={j}>{s}</li>;
                })}
              </ul>
              <p><strong>Practice task:</strong> {item.practice_task}</p>
            </div>
          );
        })}
      </div>

      {data.next_questions && data.next_questions.length > 0 && (
        <div className="results-section">
          <h2>Next Questions to Explore</h2>
          <ul>
            {data.next_questions.map(function(q, i) {
              return <li key={i}>{q}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  var _step = useState(0);
  var step = _step[0];
  var setStep = _step[1];

  var _situation = useState("");
  var situation = _situation[0];
  var setSituation = _situation[1];

  var _questions = useState(null);
  var questions = _questions[0];
  var setQuestions = _questions[1];

  var _answers = useState({});
  var answers = _answers[0];
  var setAnswers = _answers[1];

  var _results = useState(null);
  var results = _results[0];
  var setResults = _results[1];

  var _loading = useState(false);
  var loading = _loading[0];
  var setLoading = _loading[1];

  var _error = useState("");
  var error = _error[0];
  var setError = _error[1];

  var _copied = useState(false);
  var copied = _copied[0];
  var setCopied = _copied[1];

  async function handleNext() {
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
    setLoading(true);

    try {
      var res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: trimmed }),
      });

      if (!res.ok) {
        var body = await res.json().catch(function() { return {}; });
        throw new Error(body.error || "Server error (" + res.status + ")");
      }

      var data = await res.json();
      setQuestions(data.questions);
      setAnswers({});
      setStep(1);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setError("");
    setLoading(true);
    setCopied(false);

    var formattedAnswers = [];
    if (questions) {
      questions.forEach(function(q) {
        var answer = answers[q.id] || "";
        var freetext = answers[q.id + "_freetext"] || "";
        var combined = answer;
        if (freetext) {
          combined = combined ? combined + " - " + freetext : freetext;
        }
        if (combined) {
          formattedAnswers.push({ question: q.question, answer: combined });
        }
      });
    }

    try {
      var res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: situation.trim(),
          answers: formattedAnswers,
        }),
      });

      if (!res.ok) {
        var body = await res.json().catch(function() { return {}; });
        throw new Error(body.error || "Server error (" + res.status + ")");
      }

      var data = await res.json();
      setResults(data);
      setStep(2);
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

  function handleStartOver() {
    setStep(0);
    setSituation("");
    setQuestions(null);
    setAnswers({});
    setResults(null);
    setError("");
    setCopied(false);
  }

  function setAnswer(questionId, value) {
    setAnswers(function(prev) {
      var next = {};
      Object.keys(prev).forEach(function(k) { next[k] = prev[k]; });
      next[questionId] = value;
      return next;
    });
  }

  return (
    <div className="page-wrapper">
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-badge">AI-Powered Operations Strategy</div>
          <h1>AI Native Operator Toolkit</h1>
          <p>
            Describe your business situation. Get a tailored automation and AI
            strategy you can act on this week.
          </p>
        </div>
      </div>

      <div className="container">
        <StepIndicator current={step} />

        {step === 0 && !loading && (
          <div className="fade-in">
            <div className="input-area">
              <textarea
                placeholder="Example: I run a 5-person e-commerce brand. We spend 10+ hours/week manually updating inventory across Shopify, Amazon, and our warehouse spreadsheet. Our customer support is handled via a shared Gmail inbox and we often miss messages..."
                value={situation}
                onChange={function(e) { setSituation(e.target.value); }}
                disabled={loading}
              />
            </div>
            <div className="button-row">
              <button className="btn" onClick={handleNext} disabled={loading}>
                Next &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 1 && questions && !loading && (
          <div className="fade-in">
            <div className="situation-preview">
              <strong>Your situation:</strong>{" "}
              {situation.length > 150 ? situation.slice(0, 150) + "..." : situation}
            </div>

            <div className="results-section">
              <h2>A few quick questions to sharpen your plan</h2>
              {questions.map(function(q) {
                return (
                  <div className="question-block" key={q.id}>
                    <p className="question-text">{q.question}</p>
                    <div className="options-row">
                      {q.options.map(function(opt, j) {
                        var isSelected = answers[q.id] === opt;
                        return (
                          <button
                            key={j}
                            className={"option-btn" + (isSelected ? " selected" : "")}
                            onClick={function() { setAnswer(q.id, isSelected ? "" : opt); }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {q.allow_freetext && (
                      <input
                        type="text"
                        className="freetext-input"
                        placeholder="Or type your own answer..."
                        value={answers[q.id + "_freetext"] || ""}
                        onChange={function(e) { setAnswer(q.id + "_freetext", e.target.value); }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="button-row" style={{ marginTop: "16px" }}>
              <button
                className="btn btn-back"
                onClick={function() { setStep(0); setError(""); }}
              >
                &larr; Back
              </button>
              <button className="btn" onClick={handleGenerate} disabled={loading}>
                Generate Plan &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 2 && results && !loading && (
          <div className="fade-in">
            <div className="button-row" style={{ marginBottom: "16px" }}>
              <button className="btn btn-back" onClick={handleStartOver}>
                &larr; Start Over
              </button>
              <button className="btn btn-secondary" onClick={handleCopy}>
                {copied ? "\u2713 Copied!" : "Copy as Markdown"}
              </button>
              {copied && <span className="copied-toast">Copied to clipboard</span>}
            </div>
            <Results data={results} />
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        {loading && (
          <div className="loading-box fade-in">
            <div className="spinner" />
            <p>{step === 0 ? "Analyzing your situation..." : "Generating your personalized plan..."}</p>
            <p className="loading-sub">
              {step === 0 ? "This takes about 5\u201310 seconds." : "This takes about 15\u201330 seconds."}
            </p>
          </div>
        )}
      </div>

      <div className="footer">
        Built with Claude &middot; AI Native Operator Toolkit v0.3
      </div>
    </div>
  );
}
