# Escape From Tyr

Station Escape is a small top-down action roguelite set inside a failing orbital station. The current build is focused on one tight, replayable run: push through three connected spaces, survive security pressure, steal clearance, restore power to the shuttle line, and get out.

## Current Slice

This repo is tracking a compact second milestone built around replayability instead of raw content volume. Right now the game includes:

- a title screen and playable run
- three handcrafted station spaces
- snappy keyboard movement with mouse-aimed shooting
- two enemy archetypes: pursuit drones and ranged sentries
- a keycard objective, power-node activation, and locked extraction exit
- one mid-run upgrade choice
- an alternate middle-room variant for repeat runs
- a run summary with final time and simple stats

## Controls

- `WASD` or `Arrow Keys` to move
- `Mouse` to aim and fire
- `E` to interact
- `1` / `2` to choose a run upgrade
- `R` to restart after a run ends

## Stack

- Phaser 3
- TypeScript
- Vite

## Running It Locally

```bash
npm install
npm run dev
```

Build the current version with:

```bash
npm run build
```

## Current Milestone

The goal of this slice is to prove that the project can support repeat runs without drifting into procedural-generation sprawl too early. The station layout is still handcrafted, but the run now has enough variation to test whether the core loop is worth repeating:

- a new ranged enemy that changes how you use cover
- a second objective step that reroutes the final push
- a simple buff choice during the run
- one curated room variation instead of a fully fixed route

## Next Milestone

If this layer lands well, the next step is to add one more compact encounter modifier or room event that can combine with the current run structure without turning the project into a systems explosion.

## Notes

The supporting design docs for the current slice live in `docs/` and track the gameplay, level, UI, and QA decisions alongside the code.
