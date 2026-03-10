---
name: implementation-phaser
description: Use this skill to implement or refactor the browser game in Phaser: scenes, entities, movement, combat, interactions, UI hookups, level loading, game loop behavior, and content integration. Invoke when code should be written or modified for the playable game.
---

# Implementation Phaser Skill

Write production-usable Phaser code for the game.

## Deliverables
Modify:
- `src/`
- asset manifests or loader wiring
- config and build files
- docs when code changes imply design changes

## Workflow
Before coding, check `docs/GDD.md`, `docs/architecture.md`, `docs/ui-ux.md`, `docs/levels.md`, and `docs/art-direction.md` when relevant.

## Rules
Prefer clear modular code, keep the game runnable after changes, avoid giant god-classes, separate scene orchestration from reusable gameplay logic, and keep tunable values in config where practical.

## Implementation Order
1. Minimal playable path
2. Controls and feedback
3. Core interactions
4. Content wiring
5. Polish
