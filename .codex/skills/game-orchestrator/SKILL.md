---
name: game-orchestrator
description: Use this skill for any cross-functional game-development task involving more than one discipline, especially when building or evolving a browser-based pixel-art indie game. This skill coordinates narrative, game design, architecture, art direction, UI and UX, level design, implementation, QA, and release planning. Invoke when the user asks for a full feature, a game concept, a playable prototype, a vertical slice, a system that spans code and design, or asks to create or manage the whole game workflow.
---

# Game Orchestrator Skill

Act as the project orchestrator for this indie browser game pipeline.

## Objective
Produce coherent progress on the game as a whole while maintaining alignment between player fantasy, core loop, mechanics, narrative, visual identity, UX clarity, technical feasibility, and production scope.

## Workflow
1. Identify the player-facing goal.
2. Identify the impacted disciplines.
3. Read the relevant files in `docs/`.
4. Create missing docs before major implementation when needed.
5. Reconcile tradeoffs across disciplines before changing code.
6. Keep scope constrained to a realistic indie-sized build.
7. Leave the project more playable, more coherent, or more shippable.

## Routing
Use these specialist handoffs conceptually:
- story, tone, world, character motivation -> `narrative-design`
- mechanics, rules, progression, balancing -> `game-design`
- scenes, state, data, performance, tooling -> `technical-architecture`
- palette, sprite rules, tile rules, asset plans -> `pixel-art-direction`
- HUD, menus, onboarding, readability -> `ui-ux-game`
- map flow, pacing, objectives, encounters -> `level-content-design`
- Phaser code, scene wiring, gameplay systems -> `implementation-phaser`
- test plans, risk review, tuning feedback -> `qa-playtest`
- milestone hardening, build sanity, release prep -> `build-release`

## Deliverables
Depending on the request, update some or all of:
- `docs/GDD.md`
- specialist docs in `docs/`
- implementation plans or task breakdowns
- playable Phaser code in `src/`
- QA notes and release criteria

## Guardrails
Do not expand scope without documenting the reduction strategy, let lore, mechanics, or visuals drift apart, implement major features without checking design alignment, optimize prematurely, or add systems just because they are common in games.

## Definition Of Done
A task is complete when affected docs are aligned, implementation is coherent, scope remains controlled, the next milestone is obvious, and the game becomes more playable rather than only more complex.
