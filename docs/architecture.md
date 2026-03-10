# Station Escape Architecture

## Runtime And Tooling
- Phaser 3 for scenes, input, timing, and arcade physics.
- TypeScript for maintainable gameplay code.
- Vite for development and production builds.

## Project Structure
- `src/main.ts`: browser entrypoint and Phaser boot.
- `src/game/createGame.ts`: game configuration assembly.
- `src/config/gameConfig.ts`: screen, palette, and render constants.
- `src/config/levelData.ts`: run data, room definitions, spawns, and tuning values.
- `src/scenes/BootScene.ts`: generated placeholder textures and scene handoff.
- `src/scenes/MainMenuScene.ts`: title and control screen.
- `src/scenes/RunScene.ts`: core station run gameplay.
- `src/ui/Hud.ts`: HUD bars and objective text.
- `src/types/game.ts`: shared run and entity data types.

## Scene Model
- `BootScene` generates the placeholder art set.
- `MainMenuScene` establishes premise and controls.
- `RunScene` owns the three-room run, combat, pickups, fail state, and success state.

## State Ownership
- Scene-local state owns current health, weapon cooldown, keycard possession, and run-end state.
- Static run tuning lives in `levelData.ts`.
- Render constants and palette live in `gameConfig.ts`.

## Data Model
The run data contract should include:
- world bounds
- room definitions
- player spawn
- obstacle layout
- enemy spawn data and patrol points
- keycard position
- exit position and prompt range
- combat tuning values

## Input Model
- Movement: `WASD` and arrow keys.
- Fire: pointer aim plus mouse click or hold.
- Interact: `E` near the keycard or exit.
- Restart: `R` from fail or success overlay.
- Start: `Enter` or `Space` from title.

## Rendering And Camera
- Native game resolution: `480x270`.
- Fixed camera with gentle follow on the player.
- Show more room space on screen than the previous slice to avoid an over-zoomed feel.
- Keep pixel-art rendering crisp while limiting CSS upscaling.

## Asset Pipeline Assumptions
- Use generated textures for v1 so the game stays runnable without external art.
- Keep texture names generic enough for later sprite replacement.
- Distinguish player, drones, bullets, keycard, and exit states with shape and color.

## Save Model
No save data or meta-progression in v1. Restarting begins a fresh run.

## Performance And Debugging
- Keep enemy count small.
- Keep bullets short-lived.
- Centralize tunable values for movement, fire rate, detection, and damage.
- Avoid introducing procgen before the handcrafted run feels solid.

## Implementation Order
1. Update presentation scale and menu readability.
2. Generate the new station texture set.
3. Build the station run scene.
4. Wire movement, aiming, firing, and drone combat.
5. Add keycard and locked exit flow.
6. Update HUD, overlays, and QA notes.