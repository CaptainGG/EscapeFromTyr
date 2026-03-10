import type { StationRunData } from "../types/game";

export const stationRunData: StationRunData = {
  worldWidth: 1600,
  worldHeight: 920,
  rooms: [
    { name: "arrival", label: "ARRIVAL CORRIDOR", x: 64, y: 228, width: 372, height: 264 },
    { name: "junction", label: "SECURITY JUNCTION", x: 520, y: 164, width: 468, height: 392 },
    { name: "bay", label: "SHUTTLE BAY", x: 1068, y: 132, width: 420, height: 456 },
  ],
  baseObstacles: [
    { x: 228, y: 312, width: 42, height: 132 },
    { x: 1170, y: 248, width: 52, height: 164 },
    { x: 1286, y: 446, width: 124, height: 34 },
  ],
  fixedEnemySpawns: [
    {
      type: "drone",
      x: 336,
      y: 358,
      patrolPoints: [
        { x: 300, y: 300 },
        { x: 388, y: 420 },
      ],
    },
    {
      type: "sentry",
      x: 1306,
      y: 280,
      rotation: 2.45,
    },
  ],
  middleRoomVariants: [
    {
      id: "pressure",
      label: "PRESSURE JUNCTION",
      obstacles: [
        { x: 596, y: 258, width: 54, height: 138 },
        { x: 754, y: 210, width: 144, height: 34 },
        { x: 820, y: 420, width: 112, height: 34 },
      ],
      hazards: [
        {
          x: 676,
          y: 488,
          width: 200,
          height: 28,
          label: "LIVE CONDUIT",
          pulseOffsetMs: 0,
        },
      ],
      enemySpawns: [
        {
          type: "drone",
          x: 676,
          y: 278,
          patrolPoints: [
            { x: 640, y: 220 },
            { x: 868, y: 232 },
            { x: 864, y: 480 },
          ],
        },
        {
          type: "drone",
          x: 908,
          y: 330,
          patrolPoints: [
            { x: 930, y: 242 },
            { x: 938, y: 474 },
            { x: 790, y: 500 },
          ],
        },
      ],
      keycardPosition: { x: 910, y: 488 },
    },
    {
      id: "crossfire",
      label: "CROSSFIRE JUNCTION",
      obstacles: [
        { x: 648, y: 270, width: 52, height: 164 },
        { x: 792, y: 340, width: 164, height: 34 },
        { x: 918, y: 452, width: 52, height: 120 },
      ],
      hazards: [
        {
          x: 742,
          y: 230,
          width: 28,
          height: 222,
          label: "ARC LANE",
          pulseOffsetMs: 260,
        },
      ],
      enemySpawns: [
        {
          type: "drone",
          x: 626,
          y: 470,
          patrolPoints: [
            { x: 606, y: 498 },
            { x: 640, y: 222 },
            { x: 896, y: 246 },
          ],
        },
      ],
      keycardPosition: { x: 922, y: 250 },
    },
  ],
  playerSpawn: { x: 156, y: 360 },
  keycardRadius: 28,
  powerNodePosition: { x: 1166, y: 520 },
  powerNodeRadius: 34,
  powerNodeHoldMs: 800,
  exitPosition: { x: 1424, y: 360 },
  exitRadius: 40,
  rewardChoices: [
    {
      id: "rapid-fire",
      label: "RAPID FIRE",
      description: "Lower sidearm cooldown for the rest of the run.",
    },
    {
      id: "reinforced-suit",
      label: "REINFORCED SUIT",
      description: "Increase max health and restore a small amount immediately.",
    },
  ],
  playerMaxHealth: 100,
  playerMoveSpeed: 164,
  playerDamageCooldownMs: 700,
  bulletSpeed: 420,
  bulletLifetimeMs: 520,
  fireCooldownMs: 180,
  rapidFireCooldownMs: 120,
  reinforcedSuitBonusHealth: 30,
  reinforcedSuitHeal: 18,
  droneHealth: 3,
  dronePatrolSpeed: 68,
  droneChaseSpeed: 102,
  droneDetectionRadius: 188,
  sentryHealth: 4,
  sentryDetectionRadius: 244,
  sentryFireCooldownMs: 920,
  sentryProjectileSpeed: 220,
  sentryProjectileLifetimeMs: 1300,
  sentryProjectileDamage: 16,
  contactDamage: 18,
  hazardPulseMs: 1800,
  hazardActiveMs: 900,
  hazardDamage: 12,
  hazardDamageCooldownMs: 450,
};
