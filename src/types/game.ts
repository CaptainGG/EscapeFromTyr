export interface Point {
  x: number;
  y: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoomDefinition {
  name: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type EnemyType = "drone" | "sentry";

export interface EnemySpawn {
  type: EnemyType;
  x: number;
  y: number;
  patrolPoints?: Point[];
  rotation?: number;
}

export interface HazardZone {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  pulseOffsetMs: number;
}

export interface RewardOption {
  id: "rapid-fire" | "reinforced-suit";
  label: string;
  description: string;
}

export interface RoomVariant {
  id: string;
  label: string;
  obstacles: Obstacle[];
  hazards: HazardZone[];
  enemySpawns: EnemySpawn[];
  keycardPosition: Point;
}

export interface StationRunData {
  worldWidth: number;
  worldHeight: number;
  rooms: RoomDefinition[];
  baseObstacles: Obstacle[];
  fixedEnemySpawns: EnemySpawn[];
  middleRoomVariants: RoomVariant[];
  playerSpawn: Point;
  keycardRadius: number;
  powerNodePosition: Point;
  powerNodeRadius: number;
  powerNodeHoldMs: number;
  exitPosition: Point;
  exitRadius: number;
  rewardChoices: RewardOption[];
  playerMaxHealth: number;
  playerMoveSpeed: number;
  playerDamageCooldownMs: number;
  bulletSpeed: number;
  bulletLifetimeMs: number;
  fireCooldownMs: number;
  rapidFireCooldownMs: number;
  reinforcedSuitBonusHealth: number;
  reinforcedSuitHeal: number;
  droneHealth: number;
  dronePatrolSpeed: number;
  droneChaseSpeed: number;
  droneDetectionRadius: number;
  sentryHealth: number;
  sentryDetectionRadius: number;
  sentryFireCooldownMs: number;
  sentryProjectileSpeed: number;
  sentryProjectileLifetimeMs: number;
  sentryProjectileDamage: number;
  contactDamage: number;
  hazardPulseMs: number;
  hazardActiveMs: number;
  hazardDamage: number;
  hazardDamageCooldownMs: number;
}
