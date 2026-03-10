# Station Escape UI And UX

## Player Context
The player should always know four things: where to go next, whether the weapon is ready, whether a sentry lane is active, and whether they have a temporary run buff.

## HUD Requirements
- Health bar on the left.
- Weapon cooldown or ready-state bar in the center.
- Objective text on the right.
- Small contextual prompts for keycard pickup, power-node activation, and exit use.
- Reward choice stays off the permanent HUD and appears only as a temporary overlay.

## Menu Structure
- Title screen with game name, short premise, controls, and start prompt.
- In-scene reward-choice overlay with two options.
- In-scene fail overlay.
- In-scene success overlay with extraction summary, final time, and selected upgrade.

## Input Implications
Display movement as `WASD / Arrows`, firing as `Mouse`, interaction as `E`, restart as `R`, and the reward choice as `1 / 2` while the choice overlay is open.

## Feedback Design
- Firing should give immediate muzzle flash and recoil feedback.
- Weapon cooldown should visibly refill on the HUD.
- Drones should shift color when alerted.
- Sentries should visually telegraph alert state and fire a projectile that is distinct from the player bullet.
- The keycard should produce a strong pickup confirmation and objective update.
- The power node should clearly communicate inactive versus active state.
- The exit should clearly communicate locked versus unlocked state.
- The electrified floor hazard should pulse and warn before or during live damage windows.

## Tutorial Strategy
The slice still uses environmental teaching rather than pop-up tutorials:
- Room one teaches movement and firing.
- Room two teaches that runs can vary and that the keycard leads to a reward choice.
- Room three teaches that the route is not finished when the keycard is collected; the player must restore power before extracting.

## Readability Rules
- Keep the camera far enough out for route reading.
- Distinguish each room with unique landmark shapes and contrast.
- Make the two junction variants readable from their cover layout and hazard placement.
- Keep objective copy short and directive.
- Use both color and shape changes for important state transitions.
- Keep the reward-choice overlay compact and readable in one glance.
- Keep the extraction summary compact and scannable rather than stat-heavy.

## Accessibility Basics
- Avoid using color alone for lock states, cooldown state, sentry threat, or hazard activation.
- Keep text readable on laptop screens.
- Support both `WASD` and arrow keys.
- Keep pointer aiming responsive without requiring tiny targets.
- Keep the reward choice navigable with clear text labels rather than icon-only options.

## UI States And Transitions
- Title -> run start.
- Run -> reward-choice overlay after keycard pickup.
- Run -> fail overlay on death.
- Run -> success overlay with run time, selected upgrade, and summary on escape.
- Fail or success -> instant restart on `R`.

## Phaser Notes
Use crisp text, compact bars, and fixed HUD anchoring. Keep prompts close to the relevant interactable and not embedded inside the top HUD strip. Reuse the current overlay panel styling for the reward choice so the new UI layer does not feel like a separate mode.
