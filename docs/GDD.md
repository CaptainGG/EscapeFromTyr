# Station Escape GDD

## High Concept
Station Escape is a top-down action roguelite set on a crippled orbital station. The player wakes in a breached arrival sector, scavenges a security keycard, restores a shuttle power node, and fights through hostile station security to reach the last evacuation route.

## Player Fantasy
Be a stranded survivor improvising a route through a hostile station: move fast, fight smart, make one sharp upgrade choice, and get out before the system closes around you.

## Slice 2 Goal
Deliver a replayable second slice that proves the loop:
1. Enter the station run from the title screen.
2. Learn snappy movement and firing in the arrival corridor.
3. Survive one of two handcrafted security junction variants.
4. Pick up a security keycard.
5. Choose one temporary run buff.
6. Activate a shuttle-bay power node.
7. Unlock and use the exit to complete the run.

## Must-Have For Slice 2
- Top-down movement with precise stop-start response.
- Mouse-aimed sidearm with infinite ammo and short cooldown.
- One continuous station map composed of three curated rooms.
- Two enemy archetypes: security drone and ranged sentry.
- One electrified floor hazard in the security junction, with limited variant placement.
- One keycard pickup plus one power-node activation gating the final exit.
- One mid-run choice between two temporary buffs.
- One alternate handcrafted middle-room variant selected at run start.
- One simple failure state with restart.
- One success state with an extraction summary, final time, and selected upgrade.
- Minimal HUD with health, weapon cooldown, and objective text.

## Should-Have Later
- Randomized room chains.
- Additional enemy types beyond the first sentry.
- More weapon pickups.
- Light run modifiers.
- Additional environmental hazards such as vents or vacuum leaks.
- Narrative handoff screens between floors.

## Cut For Now
- Meta-progression.
- Full procedural generation.
- Inventory grids.
- Skill trees.
- Multiple playable characters.
- Dialogue systems.

## Core Loop
Enter the station, survive a small room variant, collect the keycard, choose one temporary buff, restore power to the shuttle route, and escape before your health gives out.

## Moment-To-Moment Verbs
- Move
- Aim
- Fire
- Dodge
- Collect
- Choose
- Activate
- Unlock
- Escape

## System Rules
- The player moves in eight directions with keyboard input and stops almost immediately when input ends.
- The player aims with the mouse pointer and fires a low-cooldown sidearm by clicking or holding the mouse button.
- Security drones patrol until the player enters detection range, then chase aggressively.
- Ranged sentries hold a lane, acquire the player only inside range with clear sight, and fire readable single shots on a cooldown.
- Bullet hits destroy enemies after a small number of shots.
- The electrified floor hazard pulses on and off in a fixed rhythm and damages the player only while energized.
- The run chooses one of two handcrafted security-junction variants at start.
- The keycard triggers a once-per-run choice between Rapid Fire and Reinforced Suit.
- The exit remains locked until the keycard is collected and the power node is activated.
- The power node requires the player to stand in range and hold `E`.
- The exit requires the player to stand in range and press `E`.

## Failure And Recovery
- Losing all health triggers an immediate run-failed overlay.
- The player can restart instantly with `R`.
- A clean retry should take well under two minutes once the route is understood.

## Difficulty Assumptions
- Room one should teach movement and firing with low pressure.
- Room two should be the main tension spike because it holds the keycard, the reward choice, and the variable junction layout.
- Room three should feel like a final push built around one sentry lane and the power-node detour, not a second difficulty wall.
- The reward choice should be meaningful but never mandatory for understanding the run.
- A first-time player should understand the full run structure within one or two attempts and feel a reason to replay after seeing the alternate junction variant.

## UX Implications
- The exit, keycard, and live enemies must read clearly at a glance.
- The sentry's shot lane and projectile must read differently from the drone's contact threat.
- Weapon readiness must be visible without clutter.
- Objective text should always tell the player whether they need the keycard, the power node, or the exit.
- The reward choice overlay must pause the action and present two obvious options with no scrolling or nested UI.
- The screen should show enough of each room to support route reading.
- The extraction summary should reinforce that each attempt is a self-contained run and remind the player which buff they picked.

## Technical Direction
- Phaser 3 + TypeScript + Vite.
- Generated placeholder textures for the first playable build.
- Room, pickup, exit, enemy placement, hazard placement, and reward definitions stored in a run data config object.
- One gameplay scene supported by a boot scene, title scene, and small reusable UI helper.

## Asset Requirements For This Milestone
- Player placeholder sprite.
- Drone placeholder sprite.
- Sentry placeholder sprite and projectile.
- Bullet placeholder.
- Keycard placeholder.
- Power-node placeholder.
- Locked and unlocked exit placeholders.
- Floor and wall tile placeholders.
- Hit flash, muzzle pulse, and hazard pulse effects.

## Next Milestone After Slice 2
If replayability lands well, add one more reusable encounter layer such as a second objective branch or one new room event without introducing permanent unlocks or full procedural generation.
