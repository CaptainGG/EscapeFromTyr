# AGENTS.md

This repository builds **Station Escape**, a web-based pixel-art action roguelite set inside a failing space station.

## Mission
Create a playable, maintainable browser game using a disciplined multi-skill workflow. The project should feel like a small but real indie game production pipeline rather than a one-off code generation task.

## Primary stack
- Runtime: Browser
- Rendering and game engine: Phaser 3
- Language: TypeScript
- Build tool: Vite
- Art style: Pixel art
- Target: Desktop browser first, responsive enough for laptop screens, optional mobile support later

## Global quality bar
- Favor a playable vertical slice over a huge unfinished scope.
- Keep systems modular and understandable.
- Prefer deterministic, debuggable implementations over clever but fragile ones.
- Maintain a single source of truth in `docs/` for design decisions.
- Keep gameplay scope indie-sized and finishable.

## Project doctrine
- Narrative, mechanics, art direction, UI, code, QA, and release planning must stay aligned.
- Do not introduce major mechanics, story beats, or visual motifs that conflict with existing docs unless explicitly revising them.
- Before changing direction, update the relevant docs first or in the same task.
- Every major implementation task should trace back to a design document.

## Canonical docs
Treat these files as the shared memory across skills:
- `docs/GDD.md`
- `docs/narrative.md`
- `docs/architecture.md`
- `docs/art-direction.md`
- `docs/ui-ux.md`
- `docs/levels.md`
- `docs/qa-report.md`
- `docs/release-checklist.md`

If a file does not exist, create it when needed.

## Default work pattern
When given a feature request or broad game goal:
1. Check whether the request affects narrative, mechanics, architecture, art, UI, level design, implementation, QA, or release.
2. Read the relevant docs before editing code.
3. Update docs if the request changes the design.
4. Implement in small, testable increments.
5. Add or update QA notes in `docs/qa-report.md`.
6. Keep the game runnable.

## Scope management
- Prefer a polished core loop over many shallow systems.
- Avoid procgen sprawl, content explosion, and unnecessary meta-systems unless explicitly required.
- If the request is too broad, reduce it to the smallest valuable playable version and record that reduction in `docs/GDD.md`.

## Station Escape direction
- Working title: Station Escape
- Pitch: A top-down pixel-art action roguelite where the player fights through a collapsing space station, grabs a security keycard, and reaches an evacuation route before being overrun.
- Target feel: tense, readable, lonely, compact, finishable
- Core loop: enter run -> move room to room -> survive drones -> grab keycard -> unlock exit -> escape
- Initial milestone: a single run-based vertical slice across three curated rooms, one weapon, one enemy type, one locked exit, and a minimal HUD

## Output preferences
When planning:
- Be concise, structured, and production-minded.

When implementing:
- Make files directly usable.
- Do not leave placeholder pseudocode unless explicitly requested.
- Use comments sparingly and only when they improve maintainability.

## Coordination rule
When a task obviously belongs to a specialized skill, use that skill.
When a task spans multiple disciplines, the orchestrator skill should coordinate the workflow and produce or update the shared docs before or alongside implementation.