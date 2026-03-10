# QA Report

## Build Under Review
Station Escape Slice 2 replayability milestone with one alternate middle-room variant, one ranged sentry, one power-node objective step, and one mid-run upgrade choice.

## Current Shipped Goal
- Start the run from the menu.
- Move with `WASD` or arrows using precise, non-slippery controls.
- Aim and fire with the mouse.
- Survive security drones, one junction hazard, and one sentry-controlled lane.
- Pick up the keycard.
- Choose one temporary buff.
- Activate the power node.
- Unlock and use the station exit.
- Review final time, selected buff, and run stats on success.
- Restart with `R` after death or victory.

## Test Scenarios
- Start multiple runs and confirm the middle room alternates between the two handcrafted variants.
- Verify the player still stops almost immediately when input ends and that firing while moving remains stable.
- Confirm sentry projectiles are visually distinct from player bullets and can be avoided with cover or movement.
- Step into and out of sentry line of sight to verify acquisition and disengage behavior.
- Step onto the electrified floor hazard while inactive and active to verify telegraphing and live damage behavior in both variants.
- Pick up the keycard and confirm the reward-choice overlay appears once and pauses the run.
- Select each reward in separate runs and verify the buff applies immediately and resets on restart.
- Approach the exit before the power node and confirm it stays locked.
- Activate the power node with `E` and confirm the objective updates.
- Escape after both requirements are complete and confirm the summary shows final time, buff, and run stats.
- Die from enemy or hazard damage and confirm a clean restart clears reward state, variant state, and objective state.

## Replayability Questions
- Does the alternate middle-room variant feel different enough to notice within the first two or three runs?
- Does the reward choice create a real preference without becoming mandatory for success?
- Does the power-node step make the route more interesting, or does it feel like unnecessary backtracking?
- Does seeing a sentry change how the player values cover and room entry angles?

## Likely Issues
- The alternate room variant may be too subtle if the obstacle layout changes but the route feels identical in motion.
- The sentry can feel unfair if its line of sight is too broad or its projectile speed is too high for the room scale.
- The power-node step can feel redundant if the node is too close to the exit or not clearly visible from approach.
- The reward-choice overlay can feel like friction if it stays on screen too long or lacks clear input labels.

## Tuning Risks
- Rapid Fire can erase tension if the cooldown drop is too generous.
- Reinforced Suit can trivialize hazard mistakes if the bonus health is too high.
- One sentry plus too many drones can create a difficulty spike that reads as clutter instead of tactical pressure.
- Variant B will fail its purpose if hazard placement and cover angles do not materially alter movement choices.

## Technical Risks
- Restart flow must clear bullets, enemy projectiles, reward state, chosen variant, power-node state, and exit lock state every time.
- Physics pause or overlay handling for the reward choice must not leave stale velocities or input states behind.
- The sentry line-of-sight check must stay deterministic and not flicker when the player is near wall edges.

## Severity Ranking
- P1: exit unlocks without both the keycard and power node
- P1: reward choice can be taken multiple times or persists between runs
- P1: sentry projectile damage or collision fails to reset on restart
- P2: sentry line of sight feels inconsistent around cover
- P2: alternate junction variant is too subtle to improve replayability
- P3: summary text becomes cramped once the upgrade line is added

## Recommended Fixes
- Keep all new run tuning centralized in the run data config.
- Cap Slice 2 to one sentry at a time and one reward decision per run.
- Favor obvious geometry changes and hazard placement shifts over small decorative variation.
- Tune the power node so it changes route timing, not total map size.

## Next Improvements
1. Add one more compact encounter modifier, such as a room event or alternate final-room pressure package.
2. Deepen reward identity with one more carefully tuned buff only if the current two already feel distinct.
3. Consider a second handcrafted route branch before any move toward procedural generation.

## Retest Priorities
1. Reward-choice flow and reset behavior
2. Exit gating with keycard plus power node
3. Sentry readability and fairness
4. Variant visibility across repeated runs
5. Restart reliability after all new states are added
