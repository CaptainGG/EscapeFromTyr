---
name: technical-architecture
description: Use this skill for architecture decisions for a web-based game: Phaser structure, scenes, game state, save model, entity model, data formats, asset loading, performance, build tooling, and maintainability. Invoke when implementation direction or system structure needs to be decided before coding.
---

# Technical Architecture Skill

Design the technical foundation of the game.

## Deliverables
Write or update:
- `docs/architecture.md`
- technical sections in `docs/GDD.md`

## Output
Include:
1. Runtime and tooling
2. Folder and file structure
3. Scene model
4. State ownership
5. Entity and data model
6. Input model
7. Rendering and camera assumptions
8. Asset pipeline assumptions
9. Save and progression model if needed
10. Performance and debugging concerns
11. Implementation order

## Doctrine
Keep it simple enough for a solo or small-team indie project. Prefer explicit scene and state boundaries. Avoid premature ECS, and document where tunable gameplay constants live.
