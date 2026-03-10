# Release Checklist

## Milestone Goal
Share a stable Station Escape vertical slice that proves a short handcrafted station run from spawn to escape.

## Build And Run Sanity
- `npm install` completes successfully.
- `npm run dev` starts without errors.
- `npm run build` produces a production bundle.

## Placeholder Audit
- Player, drones, bullets, keycard, and exit are visually distinct.
- Each room has at least one clear landmark.
- Locked and unlocked exit states are easy to read.

## Input Sanity
- `WASD` and arrow keys both move the player.
- Mouse aim and firing behave consistently.
- `E` interacts with pickups and exit.
- `R` restarts after fail or success.

## UX Polish Gate
- Menu no longer feels oversized.
- Camera shows enough room space to support navigation.
- Objective text stays clear during the full run.
- Success and fail overlays are short and readable.

## Performance Sanity
- The run is smooth on a typical laptop browser.
- Bullet cleanup is reliable.
- Enemy count stays small enough to avoid stutter.

## Known Issues Allowed For Share
- Placeholder art remains in use.
- No audio yet.
- Only one handcrafted run exists.

## Must Fix Before Share
- Broken restart flow.
- Exit gating bug.
- Unreadable menu or camera scale.
- Build or dev server errors.

## Nice To Have After Share
- Additional room variety.
- Better hit effects.
- Small extraction summary screen.