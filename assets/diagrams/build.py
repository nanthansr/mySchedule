#!/usr/bin/env python3
"""Build every architecture diagram as a light/dark SVG pair.

    python3 assets/diagrams/build.py

Each diagram is a DIAGRAMS entry: lanes of boxes, plus explicit connectors.
Geometry is written once and rendered twice, so the two themes can never
drift apart. The SVGs are the committed artefact; this file regenerates them.

Palettes match GitHub's own light/dark canvas so a diagram sits flush in a
README in either theme. Copper accent carries over from the portfolio site.
"""
import pathlib

OUT = pathlib.Path(__file__).parent

THEMES = {
    "light": dict(
        bg="#ffffff", text="#1f2328", muted="#656d76", line="#8c959f",
        box="#ffffff", boxstroke="#d0d7de",
        accent="#bd5d1f", accentbg="#fff4ec", accentstroke="#e8b48c",
        lane="#f6f8fa", lanetext="#a0a8b0",
    ),
    "dark": dict(
        bg="#0d1117", text="#e6edf3", muted="#9198a1", line="#6e7681",
        box="#161b22", boxstroke="#3d444d",
        accent="#e8955a", accentbg="#2b1d12", accentstroke="#6b4426",
        lane="#12171e", lanetext="#5a626b",
    ),
}

SANS = "system-ui,-apple-system,Segoe UI,sans-serif"
MONO = "ui-monospace,SFMono-Regular,Menlo,monospace"
BH = 46   # box height


def _text(x, y, s, t, kind="sub", anchor="middle", accent=False):
    if kind == "head":
        col = t["accent"] if accent else t["text"]
        size, weight, fam = 12, "600", SANS
    elif kind == "mono":
        col, size, weight, fam = t["muted"], 10, "400", MONO
    elif kind == "lane":
        col, size, weight, fam = t["lanetext"], 10, "600", MONO
    else:
        col, size, weight, fam = t["muted"], 10.5, "400", SANS
    extra = ' letter-spacing="1.4"' if kind == "lane" else ""
    return (f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{fam}" '
            f'font-size="{size}" font-weight="{weight}" fill="{col}"{extra}>{s}</text>')


def box(x, y, w, lines, t, accent=False, h=BH):
    fill = t["accentbg"] if accent else t["box"]
    stroke = t["accentstroke"] if accent else t["boxstroke"]
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{fill}" '
           f'stroke="{stroke}" stroke-width="1"/>']
    start = y + h / 2 - (len(lines) - 1) * 7 - 4
    for i, (txt, kind) in enumerate(lines):
        out.append(_text(x + w / 2, start + i * 14 + 4, txt, t, kind, accent=accent))
    return "\n".join(out)


def arrow(pts, t, dashed=False):
    """pts: [(x,y), ...] - a straight or elbowed connector, arrowhead at the end."""
    d = "M " + " L ".join(f"{x} {y}" for x, y in pts)
    dash = ' stroke-dasharray="4 3"' if dashed else ""
    return (f'<path d="{d}" stroke="{t["line"]}" stroke-width="1.4" fill="none" '
            f'marker-end="url(#a)"{dash}/>')


def lane(y, h, label, t, w):
    return (f'<rect x="0" y="{y}" width="{w}" height="{h}" rx="8" fill="{t["lane"]}"/>\n'
            + _text(16, y + 20, label, t, "lane", anchor="start"))


def render(spec, t):
    w, h = spec["size"]
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" '
         f'height="{h}" role="img" aria-label="{spec["alt"]}">',
         f'<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" '
         f'markerHeight="6" orient="auto-start-reverse">'
         f'<path d="M 0 0 L 10 5 L 0 10 z" fill="{t["line"]}"/></marker></defs>',
         f'<rect width="{w}" height="{h}" fill="{t["bg"]}"/>']
    for ly, lh, label in spec.get("lanes", []):
        s.append(lane(ly, lh, label, t, w))
    for b in spec["boxes"]:
        s.append(box(b["x"], b["y"], b["w"], b["lines"], t, accent=b.get("accent", False),
                     h=b.get("h", BH)))
    for c in spec.get("arrows", []):
        s.append(arrow(c["pts"], t, dashed=c.get("dashed", False)))
    for lb in spec.get("labels", []):
        s.append(_text(lb["x"], lb["y"], lb["s"], t, lb.get("kind", "mono"),
                       anchor=lb.get("anchor", "start")))
    for n in spec.get("notes", []):
        s.append(f'<text x="{n["x"]}" y="{n["y"]}" font-family="{SANS}" font-size="11" '
                 f'fill="{t["muted"]}">'
                 f'<tspan fill="{t["accent"]}" font-weight="600">{n["lead"]}</tspan> '
                 f'{n["rest"]}</text>')
    s.append("</svg>")
    return "\n".join(s)


# --------------------------------------------------------------------------
DIAGRAMS = {}

DIAGRAMS["fraud-pipeline"] = {
    "size": (900, 400),
    "alt": ("Three lanes. Train: a Kaggle dataset of 284,807 transactions goes through "
            "XGBoost with scale_pos_weight 577 into an MLflow registry under a champion "
            "alias. Serve: a transaction hits FastAPI for schema validation, then the model "
            "held in memory, returning a score in 2 to 5 milliseconds; the registry promotes "
            "a new model without a redeploy. Watch: Evidently runs a scheduled drift check "
            "into a Pushgateway, Prometheus and Grafana rules read it alongside per-prediction "
            "counters from FastAPI, and an alert fires by email."),
    "lanes": [(8, 108, "TRAIN"), (126, 108, "SERVE"), (244, 148, "WATCH")],
    "boxes": [
        dict(x=96,  y=40,  w=168, lines=[("Kaggle dataset", "head"), ("284,807 txns · 0.17% fraud", "sub")]),
        dict(x=320, y=40,  w=150, lines=[("XGBoost", "head"), ("scale_pos_weight=577", "mono")]),
        dict(x=534, y=40,  w=150, lines=[("MLflow registry", "head"), ("@champion alias", "mono")]),
        dict(x=96,  y=158, w=168, lines=[("Transaction", "head"), ("V1–V28 + amount", "sub")]),
        dict(x=320, y=158, w=150, lines=[("FastAPI", "head"), ("schema validation", "sub")]),
        dict(x=534, y=158, w=150, lines=[("Model in memory", "head"), ("2–5 ms per call", "sub")], accent=True),
        dict(x=748, y=158, w=110, lines=[("Score", "head"), ("fraud / legit", "sub")]),
        dict(x=96,  y=282, w=168, lines=[("Evidently", "head"), ("scheduled drift check", "sub")]),
        dict(x=320, y=282, w=150, lines=[("Pushgateway", "head"), ("short-lived job", "sub")]),
        dict(x=534, y=282, w=150, lines=[("Prometheus", "head"), ("+ Grafana rules", "sub")]),
        dict(x=748, y=282, w=110, lines=[("Alert fires", "head"), ("email", "sub")], accent=True),
    ],
    "arrows": [
        {"pts": [(264, 63), (316, 63)]},
        {"pts": [(470, 63), (530, 63)]},
        {"pts": [(264, 181), (316, 181)]},
        {"pts": [(470, 181), (530, 181)]},
        {"pts": [(684, 181), (744, 181)]},
        {"pts": [(609, 86), (609, 154)], "dashed": True},
        {"pts": [(264, 305), (316, 305)]},
        {"pts": [(470, 305), (530, 305)]},
        {"pts": [(684, 305), (744, 305)]},
        # per-request counters go straight to Prometheus, NOT via the Pushgateway
        {"pts": [(395, 204), (395, 262), (609, 262), (609, 278)], "dashed": True},
    ],
    "labels": [
        {"x": 500, "y": 56,  "s": "PR-AUC", "anchor": "middle"},
        {"x": 619, "y": 119, "s": "promote, no redeploy"},
        {"x": 403, "y": 226, "s": "counters on every prediction"},
    ],
    "notes": [{"x": 96, "y": 348, "lead": "simulate_incident.py",
               "rest": "replays a fraud spike and a distribution shift, so the alert path is tested, not assumed."}],
}

DIAGRAMS["multipaste"] = {
    "size": (900, 372),
    "alt": ("Two paths. Capture: macOS gives no clipboard notification, so a 200 millisecond "
            "timer polls the pasteboard change count; concealed and transient types from "
            "password managers are dropped, and the rest is stored in SQLite. Paste: a global "
            "CGEventTap intercepts command-shift-V before the focused app sees it, a heads-up "
            "display renders at the text cursor, and the selected clip is injected as a "
            "synthetic keystroke. An echo guard sits between the two paths so the app never "
            "re-captures the text it just injected."),
    "lanes": [(8, 150, "CAPTURE"), (168, 150, "PASTE")],
    "boxes": [
        dict(x=96,  y=42,  w=160, lines=[("200 ms timer", "head"), ("no notification exists", "sub")]),
        dict(x=310, y=42,  w=160, lines=[("changeCount", "head"), ("changed since last?", "mono")]),
        dict(x=524, y=42,  w=160, lines=[("Privacy filter", "head"), ("drop concealed types", "sub")], accent=True),
        dict(x=738, y=42,  w=110, lines=[("SQLite", "head"), ("clip history", "sub")]),
        dict(x=96,  y=202, w=160, lines=[("CGEventTap", "head"), ("⌘⇧V, before the app", "sub")]),
        dict(x=310, y=202, w=160, lines=[("Radial HUD", "head"), ("drawn at the caret", "sub")]),
        dict(x=524, y=202, w=160, lines=[("Inject keystroke", "head"), ("synthetic ⌘V", "sub")]),
        dict(x=738, y=202, w=110, lines=[("Focused app", "head"), ("receives paste", "sub")]),
    ],
    "arrows": [
        {"pts": [(256, 65), (306, 65)]},
        {"pts": [(470, 65), (520, 65)]},
        {"pts": [(684, 65), (734, 65)]},
        {"pts": [(256, 225), (306, 225)]},
        {"pts": [(470, 225), (520, 225)]},
        {"pts": [(684, 225), (734, 225)]},
        # history feeds the HUD
        {"pts": [(793, 88), (793, 132), (390, 132), (390, 198)], "dashed": True},
        # the echo guard points straight back at the filter that implements it:
        # injected text must not come back in as a brand-new clip
        {"pts": [(604, 198), (604, 92)], "dashed": True},
    ],
    "labels": [
        {"x": 398, "y": 126, "s": "cycle through recent clips"},
        {"x": 614, "y": 170, "s": "echo guard:"},
        {"x": 614, "y": 184, "s": "skip our own paste"},
    ],
    "notes": [{"x": 96, "y": 344, "lead": "Without that guard",
               "rest": "every paste re-enters the history as a fresh clip and the buffer eats itself."}],
}

DIAGRAMS["learn-buddy"] = {
    "size": (900, 268),
    "alt": ("A learner profile of topic, pace and availability goes into a FastAPI matching "
            "service, which queries Postgres for overlapping windows and returns ranked "
            "partner matches. The whole stack runs from one docker-compose file, and GitHub "
            "Actions runs the test suite on every push before anything merges."),
    "lanes": [(8, 150, "REQUEST")],
    "boxes": [
        dict(x=96,  y=42,  w=160, lines=[("Learner profile", "head"), ("topic · pace · times", "sub")]),
        dict(x=310, y=42,  w=160, lines=[("FastAPI", "head"), ("matching service", "sub")]),
        dict(x=524, y=42,  w=160, lines=[("PostgreSQL", "head"), ("overlap query", "sub")]),
        dict(x=738, y=42,  w=110, lines=[("Ranked pairs", "head"), ("best fit first", "sub")], accent=True),
        dict(x=96,  y=200, w=374, lines=[("docker-compose", "head"), ("api + db + frontend, one command", "sub")]),
        dict(x=524, y=200, w=324, lines=[("GitHub Actions", "head"), ("tests run on every push, before merge", "sub")]),
    ],
    "arrows": [
        {"pts": [(256, 65), (306, 65)]},
        {"pts": [(470, 65), (520, 65)]},
        {"pts": [(684, 65), (734, 65)]},
        {"pts": [(283, 196), (283, 100)], "dashed": True},
        {"pts": [(686, 196), (686, 100)], "dashed": True},
    ],
    "labels": [
        {"x": 291, "y": 150, "s": "runs the whole stack locally"},
        {"x": 694, "y": 150, "s": "gates the merge"},
    ],
}

DIAGRAMS["culprit"] = {
    "size": (900, 400),
    "alt": ("Three lanes. Record: the agent runs N times on the PR branch, a DecisionRecorder "
            "marks which steps actually made a stochastic decision, the rest are dropped because "
            "replaying them is provably a no-op, and LangGraph leaves a checkpoint before every "
            "step. Replay: rewind to the checkpoint before step k, re-roll that one decision and "
            "let everything downstream run fresh, repeat round-robin so every candidate step gets "
            "the same number of samples, and read off the shift in failure rate per step. Gate: "
            "compare the observed rate against the baseline committed in .culprit/baseline.json, "
            "and only if it regressed does attribution run and the process exit 1 with a markdown "
            "report for the pull request."),
    "lanes": [(8, 108, "RECORD"), (126, 108, "REPLAY"), (244, 148, "GATE")],
    "boxes": [
        dict(x=96,  y=40,  w=168, lines=[("Agent run", "head"), ("PR branch, N runs", "sub")]),
        dict(x=320, y=40,  w=150, lines=[("DecisionRecorder", "head"), ("which steps rolled?", "sub")]),
        dict(x=534, y=40,  w=150, lines=[("Candidate steps", "head"), ("no-op steps dropped", "sub")], accent=True),
        dict(x=748, y=40,  w=110, lines=[("Checkpoints", "head"), ("one before each", "sub")]),
        dict(x=96,  y=158, w=168, lines=[("Rewind to step k", "head"), ("LangGraph checkpoint", "sub")]),
        dict(x=320, y=158, w=150, lines=[("Re-roll step k", "head"), ("downstream runs fresh", "sub")]),
        dict(x=534, y=158, w=150, lines=[("K times, round-robin", "head"), ("equal samples per step", "sub")], accent=True),
        dict(x=748, y=158, w=110, lines=[("Effect", "head"), ("shift in fail rate", "sub")]),
        dict(x=96,  y=282, w=168, lines=[("Baseline", "head"), (".culprit/baseline.json", "mono")]),
        dict(x=320, y=282, w=150, lines=[("Regressed?", "head"), ("rate vs baseline", "sub")]),
        dict(x=534, y=282, w=150, lines=[("attribute()", "head"), ("rank the candidates", "sub")]),
        dict(x=748, y=282, w=110, lines=[("exit 1", "head"), ("+ report.md", "mono")], accent=True),
    ],
    "arrows": [
        {"pts": [(264, 63), (316, 63)]},
        {"pts": [(470, 63), (530, 63)]},
        {"pts": [(684, 63), (744, 63)]},
        {"pts": [(264, 181), (316, 181)]},
        {"pts": [(470, 181), (530, 181)]},
        {"pts": [(684, 181), (744, 181)]},
        {"pts": [(264, 305), (316, 305)]},
        {"pts": [(470, 305), (530, 305)]},
        {"pts": [(684, 305), (744, 305)]},
        # only the candidate steps are worth replaying
        {"pts": [(609, 86), (609, 154)], "dashed": True},
        # measured effects feed the ranking
        {"pts": [(803, 204), (803, 254), (609, 254), (609, 278)], "dashed": True},
    ],
    "labels": [
        {"x": 619, "y": 119, "s": "only these get replayed"},
        {"x": 619, "y": 246, "s": "effects feed the ranking"},
        {"x": 478, "y": 298, "s": "no", "anchor": "middle"},
    ],
    "notes": [{"x": 96, "y": 348, "lead": "Replay is the expensive half,",
               "rest": "so it only runs once the gate has already tripped. A clean branch never pays for it."}],
}

DIAGRAMS["visual-francais"] = {
    "size": (900, 268),
    "alt": ("French text is pasted into a vanilla JavaScript page in the browser. Clicking a word "
            "sends it to a small Python proxy, which holds the Anthropic API key so it never "
            "reaches the client, and calls the Anthropic API. An image association comes back and "
            "renders beside the word instead of an English translation. Four Playwright end-to-end "
            "tests, written in French, drive the whole path."),
    "lanes": [(8, 150, "REQUEST")],
    "boxes": [
        dict(x=96,  y=42,  w=160, lines=[("French text", "head"), ("click any word", "sub")]),
        dict(x=310, y=42,  w=160, lines=[("Python proxy", "head"), ("key stays server-side", "sub")], accent=True),
        dict(x=524, y=42,  w=160, lines=[("Anthropic API", "head"), ("word to association", "sub")]),
        dict(x=738, y=42,  w=110, lines=[("Image", "head"), ("no translation", "sub")]),
        dict(x=96,  y=200, w=374, lines=[("Vanilla JS in the browser", "head"), ("no framework, no build step", "sub")]),
        dict(x=524, y=200, w=324, lines=[("Playwright", "head"), ("four end-to-end tests, written in French", "sub")]),
    ],
    "arrows": [
        {"pts": [(256, 65), (306, 65)]},
        {"pts": [(470, 65), (520, 65)]},
        {"pts": [(684, 65), (734, 65)]},
        {"pts": [(283, 196), (283, 100)], "dashed": True},
        {"pts": [(686, 196), (686, 100)], "dashed": True},
    ],
    "labels": [
        {"x": 291, "y": 150, "s": "renders the result"},
        {"x": 694, "y": 150, "s": "drives the whole path"},
    ],
}

DIAGRAMS["aws-two-tier"] = {
    "size": (900, 268),
    "alt": ("A browser request reaches Nginx on the public application tier, which serves the "
            "React build and proxies API calls to a FastAPI container on the same EC2 instance. "
            "FastAPI talks to the data tier, which sits in a private subnet reachable only from "
            "the application tier security group. Both tiers are containerised and live inside "
            "one VPC, with security groups rather than open ports separating them."),
    "lanes": [(8, 150, "REQUEST")],
    "boxes": [
        dict(x=96,  y=42,  w=160, lines=[("Browser", "head"), ("public internet", "sub")]),
        dict(x=310, y=42,  w=160, lines=[("Nginx on EC2", "head"), ("serves React, proxies /api", "sub")]),
        dict(x=524, y=42,  w=160, lines=[("FastAPI container", "head"), ("application tier", "sub")]),
        dict(x=738, y=42,  w=110, lines=[("Data tier", "head"), ("private subnet", "sub")], accent=True),
        dict(x=96,  y=200, w=374, lines=[("One VPC", "head"), ("public and private subnets, not one flat network", "sub")]),
        dict(x=524, y=200, w=324, lines=[("Security groups", "head"), ("the data tier accepts only the app tier", "sub")]),
    ],
    "arrows": [
        {"pts": [(256, 65), (306, 65)]},
        {"pts": [(470, 65), (520, 65)]},
        {"pts": [(684, 65), (734, 65)]},
        {"pts": [(283, 196), (283, 100)], "dashed": True},
        {"pts": [(686, 196), (686, 100)], "dashed": True},
    ],
    "labels": [
        {"x": 291, "y": 150, "s": "holds both tiers"},
        {"x": 694, "y": 150, "s": "no open ports between them"},
    ],
}

DIAGRAMS["pomofocus"] = {
    "size": (900, 268),
    "alt": ("Starting a session stores an end date rather than a countdown number. On every tick "
            "the menu bar ring is redrawn from the gap between now and that end date, so the ring "
            "ripens instead of digits ticking down, and the session ends when now passes the end "
            "date. Because the truth is a date and not a counter, closing the lid mid-session and "
            "reopening it later leaves the remaining time correct, where a decrementing counter "
            "would have drifted."),
    "lanes": [(8, 150, "SESSION")],
    "boxes": [
        dict(x=96,  y=42,  w=160, lines=[("Start", "head"), ("store an end date", "sub")], accent=True),
        dict(x=310, y=42,  w=160, lines=[("Every tick", "head"), ("now vs end date", "sub")]),
        dict(x=524, y=42,  w=160, lines=[("Ring redraws", "head"), ("no digits, ever", "sub")]),
        dict(x=738, y=42,  w=110, lines=[("Done", "head"), ("now passes end", "sub")]),
        dict(x=96,  y=200, w=374, lines=[("Lid closes, app sleeps", "head"), ("a decrementing counter would drift here", "sub")]),
        dict(x=524, y=200, w=324, lines=[("Swift, zero dependencies", "head"), ("five tests, no network calls at all", "sub")]),
    ],
    "arrows": [
        {"pts": [(256, 65), (306, 65)]},
        {"pts": [(470, 65), (520, 65)]},
        {"pts": [(684, 65), (734, 65)]},
        {"pts": [(283, 196), (283, 100)], "dashed": True},
    ],
    "labels": [
        {"x": 291, "y": 150, "s": "the date is still true on wake"},
    ],
    "notes": [{"x": 524, "y": 258, "lead": "A visible countdown is itself a context switch",
               "rest": "- you look at it, and the looking is the interruption."}],
}

if __name__ == "__main__":
    for name, spec in DIAGRAMS.items():
        for theme, t in THEMES.items():
            p = OUT / f"{name}-{theme}.svg"
            p.write_text(render(spec, t), encoding="utf-8")
            print(f"wrote {p.name} ({p.stat().st_size} bytes)")
