# Station Escape Level Design

## Slice Purpose
The second slice should make the run worth repeating without expanding into procgen or a long content ladder. One run still teaches movement, shooting, and escape flow, but now includes a room variant, a new enemy lane, a second objective step, and one upgrade choice.

## Room Sequence
### Room 1: Arrival Corridor
- Purpose: teach movement and firing with low pressure
- Layout: long corridor with light cover, arrival stripes, and one early drone lane
- Learning goal: understand that combat is active and movement is snappy rather than slippery

### Room 2: Security Junction
- Purpose: main combat room, hazard room, keycard room, and replayability slot
- Layout: one of two handcrafted variants chosen at run start
- Learning goal: recognize that the station can shift between attempts while preserving the same high-level route

### Room 3: Shuttle Bay
- Purpose: final push and escape
- Layout: open bay with a visible power node on approach, a sentry-controlled lane, and a framed extraction pad on the far side
- Learning goal: reroute through the power node before the final exit and respect ranged pressure

## Middle-Room Variants
### Variant A: Pressure Junction
- Stronger drone pressure and familiar hazard timing
- Wider lower lane with a live conduit strip near the keycard side
- Cover favors short repositioning and quick pushes to the keycard

### Variant B: Crossfire Junction
- More angular cover and a shifted hazard lane
- The geometry creates longer sightlines that change how the player enters and exits the room
- The player should feel the room read differently at a glance even though the macro route is unchanged

## Pacing Beats
1. Calm entry and control learning.
2. First drone pressure and shooting test.
3. Mid-run junction variant reveal.
4. Keycard pickup and reward choice.
5. Final-room sentry pressure.
6. Power-node detour before extraction.
7. Escape and run summary.

## Encounter Structure
- Drones remain the close-range pressure unit.
- The ranged sentry is a lane-control threat that changes positioning rather than chase rhythm.
- Only one sentry should threaten the player at a time in Slice 2.
- The environmental hazard should still influence movement without replacing enemy pressure.

## Objective Structure
- The player must collect the keycard.
- Keycard pickup triggers a one-time choice between two temporary buffs.
- The player must then activate the shuttle-bay power node.
- The exit can only be used after both requirements are complete.
- The run ends immediately once the player escapes, then shows a compact extraction summary.

## Gating And Progression
The run remains curated and backtrack-friendly, but the goal chain now becomes: survive -> collect keycard -> choose buff -> activate power node -> escape.

## Placement Logic
- Spawn the player with enough open space to test movement.
- Place drones so the player can choose between direct engagement and slight repositioning.
- Place the sentry where it controls a visible lane but still allows cover-based counterplay.
- Keep the keycard, power node, and exit all visually distinctive from the environment.
- Place the electrified floor hazard where it influences route choice without blocking the entire room.

## Reward Logic
- The reward choice appears once per run immediately after the keycard.
- Rapid Fire should shorten weapon cooldown enough to feel distinct, but not erase tension.
- Reinforced Suit should increase survivability enough to feel safe, but not trivialize hazards.
- Rewards are temporary and reset on restart.

## Data Representation
Represent the run in typed config data containing:
- room bounds
- base obstacle rectangles
- variant obstacle rectangles for the middle room
- hazard rectangles and pulse timing
- player spawn
- enemy spawn definitions with enemy type
- keycard, power-node, and exit positions
- reward choice definitions
