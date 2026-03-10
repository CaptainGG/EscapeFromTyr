import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, PALETTE } from "../config/gameConfig";
import { stationRunData } from "../config/levelData";
import type { EnemySpawn, EnemyType, HazardZone, Obstacle, Point, RewardOption, RoomVariant } from "../types/game";
import { Hud } from "../ui/Hud";

type EnemySprite = Phaser.Physics.Arcade.Sprite & {
  enemyType: EnemyType;
  patrolIndex?: number;
  patrolPoints?: Phaser.Math.Vector2[];
  health?: number;
  homeRotation?: number;
  lastShotAt?: number;
};

type BulletImage = Phaser.Physics.Arcade.Image & {
  bornAt?: number;
};

type HazardVisual = {
  zone: HazardZone;
  lane: Phaser.GameObjects.Rectangle;
  pulse: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
};

export class RunScene extends Phaser.Scene {
  private readonly run = stationRunData;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private moveKeys!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private interactKey!: Phaser.Input.Keyboard.Key;
  private restartKey!: Phaser.Input.Keyboard.Key;
  private choiceKeys!: {
    one: Phaser.Input.Keyboard.Key;
    two: Phaser.Input.Keyboard.Key;
    numpadOne: Phaser.Input.Keyboard.Key;
    numpadTwo: Phaser.Input.Keyboard.Key;
  };
  private player!: Phaser.Physics.Arcade.Sprite;
  private bullets!: Phaser.Physics.Arcade.Group;
  private enemyProjectiles!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private keycard!: Phaser.GameObjects.Image;
  private powerNode!: Phaser.GameObjects.Image;
  private exitDoor!: Phaser.GameObjects.Image;
  private interactPrompt!: Phaser.GameObjects.Text;
  private overlayPanel!: Phaser.GameObjects.Rectangle;
  private overlayTitle!: Phaser.GameObjects.Text;
  private overlayBody!: Phaser.GameObjects.Text;
  private hud!: Hud;
  private hazardVisuals: HazardVisual[] = [];
  private selectedVariant!: RoomVariant;
  private activeObstacles: Obstacle[] = [];
  private activeHazards: HazardZone[] = [];
  private activeEnemySpawns: EnemySpawn[] = [];
  private currentKeycardPosition!: Point;
  private maxHealth = this.run.playerMaxHealth;
  private health = this.run.playerMaxHealth;
  private currentFireCooldownMs = this.run.fireCooldownMs;
  private hasKeycard = false;
  private powerNodeActive = false;
  private isEnded = false;
  private isChoosingReward = false;
  private selectedUpgradeLabel = "NONE";
  private lastDamageAt = -9999;
  private lastHazardDamageAt = -9999;
  private lastShotAt = -9999;
  private powerNodeHoldStartedAt = -1;
  private runStartedAt = 0;
  private enemiesDestroyed = 0;
  private hazardHits = 0;
  private totalDamageTaken = 0;

  constructor() {
    super("run");
  }

  create(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error("Keyboard input is required for Station Escape.");
    }

    this.selectedVariant = Phaser.Utils.Array.GetRandom(this.run.middleRoomVariants);
    this.activeObstacles = [...this.run.baseObstacles, ...this.selectedVariant.obstacles];
    this.activeHazards = [...this.selectedVariant.hazards];
    this.activeEnemySpawns = [...this.run.fixedEnemySpawns, ...this.selectedVariant.enemySpawns];
    this.currentKeycardPosition = { ...this.selectedVariant.keycardPosition };
    this.maxHealth = this.run.playerMaxHealth;
    this.health = this.run.playerMaxHealth;
    this.currentFireCooldownMs = this.run.fireCooldownMs;
    this.selectedUpgradeLabel = "NONE";
    this.hasKeycard = false;
    this.powerNodeActive = false;
    this.isEnded = false;
    this.isChoosingReward = false;
    this.lastDamageAt = -9999;
    this.lastHazardDamageAt = -9999;
    this.lastShotAt = -9999;
    this.powerNodeHoldStartedAt = -1;
    this.enemiesDestroyed = 0;
    this.hazardHits = 0;
    this.totalDamageTaken = 0;
    this.hazardVisuals = [];
    this.runStartedAt = this.time.now;

    this.cursors = keyboard.createCursorKeys();
    this.moveKeys = {
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.interactKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.restartKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.choiceKeys = {
      one: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      two: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      numpadOne: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE),
      numpadTwo: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO),
    };

    this.physics.world.resume();
    this.physics.world.setBounds(0, 0, this.run.worldWidth, this.run.worldHeight);
    this.cameras.main.setBounds(0, 0, this.run.worldWidth, this.run.worldHeight);
    this.cameras.main.setBackgroundColor(PALETTE.background);

    this.drawStation();
    this.createWalls();
    this.createActors();
    this.createInteractables();
    this.createUi();
    this.wireCollisions();

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.hud.setHealth(this.health, this.maxHealth);
    this.hud.setCooldown(1);
    this.updateObjective();
    this.updateExitState();
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.restartKey) && this.isEnded) {
      this.scene.restart();
      return;
    }

    if (this.isEnded) {
      return;
    }

    if (this.isChoosingReward) {
      this.handleRewardChoice();
      return;
    }

    this.updatePlayerMovement();
    this.updateFacing();
    this.updateFiring();
    this.updateBullets();
    this.updateEnemies();
    this.updateHazards();
    this.updateInteractions();
    this.updateCooldownDisplay();
  }

  private drawStation(): void {
    for (let x = 0; x < this.run.worldWidth; x += 32) {
      for (let y = 0; y < this.run.worldHeight; y += 32) {
        this.add.image(x, y, "floor-tile").setOrigin(0);
      }
    }

    this.add.rectangle(0, 0, this.run.worldWidth, 20, PALETTE.wall).setOrigin(0);
    this.add.rectangle(0, this.run.worldHeight - 20, this.run.worldWidth, 20, PALETTE.wall).setOrigin(0);
    this.add.rectangle(0, 0, 20, this.run.worldHeight, PALETTE.wall).setOrigin(0);
    this.add.rectangle(this.run.worldWidth - 20, 0, 20, this.run.worldHeight, PALETTE.wall).setOrigin(0);

    for (const room of this.run.rooms) {
      const tint = room.name === "arrival" ? 0x102338 : room.name === "junction" ? 0x1a1f38 : 0x102d2b;
      this.add.rectangle(room.x, room.y, room.width, room.height, tint, 0.32).setOrigin(0);
      this.add.rectangle(room.x, room.y, room.width, room.height).setOrigin(0).setStrokeStyle(2, PALETTE.edge, 0.6);
      this.add
        .text(room.x + 14, room.y + 12, room.label, {
          fontFamily: '"Lucida Console", monospace',
          fontSize: "10px",
          color: room.name === "bay" ? "#90f4b2" : room.name === "junction" ? "#ffb3b3" : "#5edbff",
        })
        .setAlpha(0.95);
    }

    this.drawArrivalLandmarks();
    this.drawSecurityLandmarks();
    this.drawBayLandmarks();

    const corridorLines = this.add.graphics();
    corridorLines.lineStyle(3, PALETTE.edge, 0.26);
    corridorLines.strokeLineShape(new Phaser.Geom.Line(436, 360, 520, 360));
    corridorLines.strokeLineShape(new Phaser.Geom.Line(988, 360, 1068, 360));
  }

  private drawArrivalLandmarks(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(PALETTE.bullet, 0.12);
    graphics.fillRect(108, 252, 124, 18);
    graphics.fillStyle(PALETTE.player, 0.16);
    graphics.fillRect(118, 446, 172, 12);
    graphics.lineStyle(2, PALETTE.player, 0.5);
    graphics.strokeRect(102, 280, 40, 142);
    graphics.strokeRect(330, 278, 34, 146);
    graphics.lineStyle(2, PALETTE.bullet, 0.35);
    graphics.strokeLineShape(new Phaser.Geom.Line(122, 468, 290, 468));
    graphics.strokeLineShape(new Phaser.Geom.Line(122, 476, 290, 476));
  }

  private drawSecurityLandmarks(): void {
    const graphics = this.add.graphics();

    if (this.selectedVariant.id === "pressure") {
      graphics.fillStyle(0x331822, 0.28);
      graphics.fillRect(562, 198, 388, 314);
      graphics.fillStyle(PALETTE.drone, 0.14);
      graphics.fillRect(600, 206, 118, 18);
      graphics.fillRect(802, 206, 110, 18);
      graphics.fillStyle(PALETTE.bullet, 0.1);
      graphics.fillRect(598, 402, 302, 16);
      graphics.lineStyle(2, PALETTE.drone, 0.46);
      graphics.strokeRect(612, 470, 130, 28);
      graphics.strokeRect(768, 470, 130, 28);
    } else {
      graphics.fillStyle(0x1a213c, 0.28);
      graphics.fillRect(562, 198, 388, 314);
      graphics.fillStyle(PALETTE.sentry, 0.12);
      graphics.fillRect(726, 200, 62, 268);
      graphics.fillStyle(PALETTE.bullet, 0.08);
      graphics.fillRect(594, 298, 330, 16);
      graphics.lineStyle(2, PALETTE.sentry, 0.42);
      graphics.strokeRect(594, 470, 136, 28);
      graphics.strokeRect(816, 214, 96, 26);
    }

    this.add
      .text(952, 184, this.selectedVariant.label, {
        fontFamily: '"Lucida Console", monospace',
        fontSize: "9px",
        color: this.selectedVariant.id === "pressure" ? "#ff9c9c" : "#ffcf9a",
      })
      .setOrigin(1, 0)
      .setAlpha(0.95);
  }

  private drawBayLandmarks(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(PALETTE.exitUnlocked, 0.1);
    graphics.fillRect(1264, 168, 164, 54);
    graphics.fillStyle(PALETTE.exitUnlocked, 0.08);
    graphics.fillCircle(1336, 360, 118);
    graphics.lineStyle(2, PALETTE.exitUnlocked, 0.28);
    graphics.strokeCircle(1336, 360, 90);
    graphics.strokeCircle(1336, 360, 56);
    graphics.fillStyle(PALETTE.powerNode, 0.12);
    graphics.fillCircle(this.run.powerNodePosition.x, this.run.powerNodePosition.y, 46);
    graphics.lineStyle(2, PALETTE.powerNode, 0.38);
    graphics.strokeCircle(this.run.powerNodePosition.x, this.run.powerNodePosition.y, 32);
    graphics.fillStyle(PALETTE.player, 0.12);
    graphics.fillRect(1188, 544, 224, 14);
  }

  private createWalls(): void {
    this.walls = this.physics.add.staticGroup();

    for (const obstacle of this.activeObstacles) {
      const wall = this.physics.add
        .staticImage(obstacle.x, obstacle.y, "wall-block")
        .setDisplaySize(obstacle.width, obstacle.height)
        .refreshBody();
      this.walls.add(wall);
    }
  }

  private createActors(): void {
    this.player = this.physics.add.sprite(this.run.playerSpawn.x, this.run.playerSpawn.y, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setDamping(false);
    this.player.setDrag(0, 0);
    this.player.setMaxVelocity(this.run.playerMoveSpeed, this.run.playerMoveSpeed);
    this.player.setDepth(4);

    this.bullets = this.physics.add.group({ maxSize: 40 });
    this.enemyProjectiles = this.physics.add.group({ maxSize: 16 });
    this.enemies = this.physics.add.group();

    for (const spawn of this.activeEnemySpawns) {
      const texture = spawn.type === "sentry" ? "sentry" : "drone";
      const enemy = this.physics.add.sprite(spawn.x, spawn.y, texture) as EnemySprite;
      enemy.enemyType = spawn.type;
      enemy.setCollideWorldBounds(true);
      enemy.setDepth(4);
      enemy.health = spawn.type === "sentry" ? this.run.sentryHealth : this.run.droneHealth;
      enemy.lastShotAt = Phaser.Math.Between(-this.run.sentryFireCooldownMs, 0);

      if (spawn.type === "drone") {
        enemy.setDamping(true);
        enemy.setDrag(460, 460);
        enemy.setMaxVelocity(this.run.droneChaseSpeed, this.run.droneChaseSpeed);
        enemy.patrolIndex = 0;
        enemy.patrolPoints = (spawn.patrolPoints ?? []).map((point) => new Phaser.Math.Vector2(point.x, point.y));
      } else {
        enemy.setImmovable(true);
        enemy.homeRotation = spawn.rotation ?? 0;
        enemy.setRotation(enemy.homeRotation);
      }

      this.enemies.add(enemy);
    }
  }

  private createInteractables(): void {
    this.keycard = this.add.image(this.currentKeycardPosition.x, this.currentKeycardPosition.y, "keycard").setDepth(3);
    this.powerNode = this.add
      .image(this.run.powerNodePosition.x, this.run.powerNodePosition.y, "power-node-off")
      .setDepth(3);
    this.exitDoor = this.add.image(this.run.exitPosition.x, this.run.exitPosition.y, "exit-locked").setDepth(3);

    this.interactPrompt = this.add
      .text(0, 0, "", {
        fontFamily: '"Lucida Console", monospace',
        fontSize: "10px",
        color: "#f5f7ff",
        backgroundColor: "#0f1422",
        padding: { left: 5, right: 5, top: 3, bottom: 3 },
      })
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(15);

    for (const zone of this.activeHazards) {
      const lane = this.add.rectangle(zone.x, zone.y, zone.width, zone.height, PALETTE.player, 0.1).setOrigin(0);
      const pulse = this.add.rectangle(zone.x, zone.y, zone.width, zone.height, PALETTE.drone, 0.08).setOrigin(0);
      const label = this.add
        .text(zone.x + zone.width / 2, zone.y - 16, zone.label, {
          fontFamily: '"Lucida Console", monospace',
          fontSize: "9px",
          color: "#ffb3b3",
        })
        .setOrigin(0.5)
        .setAlpha(0.85);

      const stripes = this.add.graphics();
      stripes.lineStyle(2, PALETTE.player, 0.55);
      const step = zone.width >= zone.height ? 18 : 16;
      if (zone.width >= zone.height) {
        for (let x = zone.x; x <= zone.x + zone.width; x += step) {
          stripes.strokeLineShape(new Phaser.Geom.Line(x, zone.y, x + 12, zone.y + zone.height));
        }
      } else {
        for (let y = zone.y; y <= zone.y + zone.height; y += step) {
          stripes.strokeLineShape(new Phaser.Geom.Line(zone.x, y, zone.x + zone.width, y + 12));
        }
      }

      this.hazardVisuals.push({ zone, lane, pulse, label });
    }
  }

  private createUi(): void {
    this.hud = new Hud(this);

    this.overlayPanel = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 8, 340, 152, PALETTE.panel, 0.95)
      .setScrollFactor(0)
      .setDepth(20)
      .setVisible(false);
    this.overlayPanel.setStrokeStyle(1, PALETTE.edge, 1);

    this.overlayTitle = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "", {
        fontFamily: '"Lucida Console", monospace',
        fontSize: "18px",
        color: "#f5f7ff",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(21)
      .setVisible(false);

    this.overlayBody = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, "", {
        fontFamily: '"Lucida Console", monospace',
        fontSize: "10px",
        color: "#b9c4de",
        align: "center",
        lineSpacing: 4,
        wordWrap: { width: 300 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(21)
      .setVisible(false);
  }

  private wireCollisions(): void {
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.enemies, this.walls);
    this.physics.add.collider(this.bullets, this.walls, (bullet) => {
      bullet.destroy();
    });
    this.physics.add.collider(this.enemyProjectiles, this.walls, (projectile) => {
      projectile.destroy();
    });
    this.physics.add.overlap(this.player, this.enemies, () => this.applyContactDamage());
    this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
      bullet.destroy();
      this.damageEnemy(enemy as EnemySprite);
    });
    this.physics.add.overlap(this.player, this.enemyProjectiles, (_player, projectile) => {
      projectile.destroy();
      this.applyProjectileDamage();
    });
  }

  private updatePlayerMovement(): void {
    const x =
      (this.cursors.left?.isDown || this.moveKeys.left.isDown ? -1 : 0) +
      (this.cursors.right?.isDown || this.moveKeys.right.isDown ? 1 : 0);
    const y =
      (this.cursors.up?.isDown || this.moveKeys.up.isDown ? -1 : 0) +
      (this.cursors.down?.isDown || this.moveKeys.down.isDown ? 1 : 0);
    const direction = new Phaser.Math.Vector2(x, y);

    if (direction.lengthSq() === 0) {
      this.player.setVelocity(0, 0);
      return;
    }

    direction.normalize();
    this.player.setVelocity(direction.x * this.run.playerMoveSpeed, direction.y * this.run.playerMoveSpeed);
  }

  private updateFacing(): void {
    const pointer = this.input.activePointer;
    const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
    this.player.setRotation(angle);
  }

  private updateFiring(): void {
    if (!this.input.activePointer.isDown) {
      return;
    }

    if (this.time.now - this.lastShotAt < this.currentFireCooldownMs) {
      return;
    }

    this.lastShotAt = this.time.now;
    const pointer = this.input.activePointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
    const direction = new Phaser.Math.Vector2(pointer.x - this.player.x, pointer.y - this.player.y);
    if (direction.lengthSq() === 0) {
      return;
    }

    direction.normalize();
    const bullet = this.physics.add.image(
      this.player.x + direction.x * 12,
      this.player.y + direction.y * 12,
      "bullet",
    ) as BulletImage;
    bullet.setDepth(3);
    bullet.setVelocity(direction.x * this.run.bulletSpeed, direction.y * this.run.bulletSpeed);
    bullet.bornAt = this.time.now;
    this.bullets.add(bullet);

    this.tweens.add({
      targets: this.player,
      alpha: 0.8,
      yoyo: true,
      duration: 60,
      repeat: 0,
      onComplete: () => this.player.setAlpha(1),
    });
  }

  private updateBullets(): void {
    for (const child of this.bullets.getChildren()) {
      const bullet = child as BulletImage;
      if (bullet.bornAt && this.time.now - bullet.bornAt > this.run.bulletLifetimeMs) {
        bullet.destroy();
      }
    }

    for (const child of this.enemyProjectiles.getChildren()) {
      const projectile = child as BulletImage;
      if (projectile.bornAt && this.time.now - projectile.bornAt > this.run.sentryProjectileLifetimeMs) {
        projectile.destroy();
      }
    }
  }

  private updateEnemies(): void {
    for (const child of this.enemies.getChildren()) {
      const enemy = child as EnemySprite;
      if (enemy.enemyType === "drone") {
        this.updateDrone(enemy);
      } else {
        this.updateSentry(enemy);
      }
    }
  }

  private updateDrone(drone: EnemySprite): void {
    const distance = Phaser.Math.Distance.Between(drone.x, drone.y, this.player.x, this.player.y);

    if (distance <= this.run.droneDetectionRadius) {
      drone.setTint(PALETTE.droneAlert);
      this.physics.moveToObject(drone, this.player, this.run.droneChaseSpeed);
      return;
    }

    drone.clearTint();
    const patrolPoints = drone.patrolPoints ?? [];
    if (patrolPoints.length === 0) {
      drone.setVelocity(0, 0);
      return;
    }

    const target = patrolPoints[drone.patrolIndex ?? 0];
    if (Phaser.Math.Distance.Between(drone.x, drone.y, target.x, target.y) < 10) {
      drone.patrolIndex = ((drone.patrolIndex ?? 0) + 1) % patrolPoints.length;
    }

    const nextTarget = patrolPoints[drone.patrolIndex ?? 0];
    this.physics.moveTo(drone, nextTarget.x, nextTarget.y, this.run.dronePatrolSpeed);
  }

  private updateSentry(sentry: EnemySprite): void {
    sentry.setVelocity(0, 0);
    const distance = Phaser.Math.Distance.Between(sentry.x, sentry.y, this.player.x, this.player.y);
    const hasSight = distance <= this.run.sentryDetectionRadius && this.hasLineOfSight(sentry, this.player);

    if (!hasSight) {
      sentry.clearTint();
      const wobble = Math.sin(this.time.now / 500 + sentry.x * 0.01) * 0.28;
      sentry.setRotation((sentry.homeRotation ?? 0) + wobble);
      return;
    }

    const angle = Phaser.Math.Angle.Between(sentry.x, sentry.y, this.player.x, this.player.y);
    sentry.setRotation(angle);
    sentry.setTint(PALETTE.sentryProjectile);

    if (this.time.now - (sentry.lastShotAt ?? -9999) < this.run.sentryFireCooldownMs) {
      return;
    }

    sentry.lastShotAt = this.time.now;
    const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
    const projectile = this.physics.add.image(
      sentry.x + direction.x * 14,
      sentry.y + direction.y * 14,
      "sentry-bolt",
    ) as BulletImage;
    projectile.setVelocity(direction.x * this.run.sentryProjectileSpeed, direction.y * this.run.sentryProjectileSpeed);
    projectile.setDepth(3);
    projectile.bornAt = this.time.now;
    this.enemyProjectiles.add(projectile);
    this.cameras.main.shake(60, 0.0012, true);
  }

  private updateHazards(): void {
    for (const hazard of this.hazardVisuals) {
      const active = this.isHazardActive(hazard.zone);
      hazard.pulse.setAlpha(active ? 0.42 : 0.08);
      hazard.label.setColor(active ? "#ffc7c7" : "#b9c4de");

      if (!active) {
        continue;
      }

      const hazardRect = new Phaser.Geom.Rectangle(hazard.zone.x, hazard.zone.y, hazard.zone.width, hazard.zone.height);
      if (!hazardRect.contains(this.player.x, this.player.y)) {
        continue;
      }

      if (this.time.now - this.lastHazardDamageAt < this.run.hazardDamageCooldownMs) {
        continue;
      }

      this.lastHazardDamageAt = this.time.now;
      this.hazardHits += 1;
      this.applyDamage(this.run.hazardDamage);
      this.cameras.main.flash(80, 255, 200, 120, false);
    }
  }

  private isHazardActive(zone: HazardZone): boolean {
    return (this.time.now + zone.pulseOffsetMs) % this.run.hazardPulseMs < this.run.hazardActiveMs;
  }

  private updateInteractions(): void {
    const keycardDistance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.currentKeycardPosition.x,
      this.currentKeycardPosition.y,
    );
    const powerNodeDistance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.run.powerNodePosition.x,
      this.run.powerNodePosition.y,
    );
    const exitDistance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.run.exitPosition.x,
      this.run.exitPosition.y,
    );

    const nearKeycard = !this.hasKeycard && this.keycard.active && keycardDistance <= this.run.keycardRadius;
    const nearPowerNode = this.hasKeycard && !this.powerNodeActive && powerNodeDistance <= this.run.powerNodeRadius;
    const nearExit = exitDistance <= this.run.exitRadius;

    if (nearKeycard) {
      this.interactPrompt
        .setPosition(this.currentKeycardPosition.x, this.currentKeycardPosition.y - 22)
        .setText("PRESS E TO TAKE KEYCARD")
        .setVisible(true);
    } else if (nearPowerNode) {
      if (this.interactKey.isDown) {
        if (this.powerNodeHoldStartedAt < 0) {
          this.powerNodeHoldStartedAt = this.time.now;
        }
      } else {
        this.powerNodeHoldStartedAt = -1;
      }

      const holdRatio = this.powerNodeHoldStartedAt < 0
        ? 0
        : Phaser.Math.Clamp((this.time.now - this.powerNodeHoldStartedAt) / this.run.powerNodeHoldMs, 0, 1);
      this.interactPrompt
        .setPosition(this.run.powerNodePosition.x, this.run.powerNodePosition.y - 28)
        .setText(`HOLD E TO RESTORE POWER ${Math.round(holdRatio * 100)}%`)
        .setVisible(true);

      if (holdRatio >= 1) {
        this.activatePowerNode();
        this.powerNodeHoldStartedAt = -1;
      }
    } else if (nearExit) {
      this.powerNodeHoldStartedAt = -1;
      const exitText = !this.hasKeycard
        ? "EXIT LOCKED - NEED KEYCARD"
        : !this.powerNodeActive
          ? "EXIT LOCKED - RESTORE POWER"
          : "PRESS E TO BOARD SHUTTLE";
      this.interactPrompt
        .setPosition(this.run.exitPosition.x, this.run.exitPosition.y - 38)
        .setText(exitText)
        .setVisible(true);
    } else {
      this.powerNodeHoldStartedAt = -1;
      this.interactPrompt.setVisible(false);
    }

    if (!Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      return;
    }

    if (nearKeycard) {
      this.collectKeycard();
      return;
    }

    if (nearExit && this.hasKeycard && this.powerNodeActive) {
      this.completeRun();
    }
  }

  private updateCooldownDisplay(): void {
    const elapsed = this.time.now - this.lastShotAt;
    const ratio = this.lastShotAt < 0 ? 1 : Phaser.Math.Clamp(elapsed / this.currentFireCooldownMs, 0, 1);
    this.hud.setCooldown(ratio);
  }

  private collectKeycard(): void {
    this.hasKeycard = true;
    this.keycard.destroy();
    this.updateObjective();
    this.cameras.main.flash(120, 181, 156, 255, false);
    this.showRewardChoice();
  }

  private activatePowerNode(): void {
    this.powerNodeActive = true;
    this.powerNode.setTexture("power-node-on");
    this.updateExitState();
    this.updateObjective();
    this.cameras.main.flash(120, 144, 244, 178, false);
  }

  private updateExitState(): void {
    this.exitDoor.setTexture(this.hasKeycard && this.powerNodeActive ? "exit-open" : "exit-locked");
  }

  private showRewardChoice(): void {
    this.isChoosingReward = true;
    this.interactPrompt.setVisible(false);
    this.player.setVelocity(0, 0);
    this.bullets.clear(true, true);
    this.enemyProjectiles.clear(true, true);
    for (const child of this.enemies.getChildren()) {
      (child as Phaser.Physics.Arcade.Sprite).setVelocity(0, 0);
    }
    this.physics.world.pause();
    this.hud.setObjective("Choose one run upgrade");

    const [firstReward, secondReward] = this.run.rewardChoices;
    this.showOverlay(
      "CHOOSE ONE UPGRADE",
      `1  ${firstReward.label}\n${firstReward.description}\n\n2  ${secondReward.label}\n${secondReward.description}`,
    );
  }

  private handleRewardChoice(): void {
    const chooseOne = Phaser.Input.Keyboard.JustDown(this.choiceKeys.one) || Phaser.Input.Keyboard.JustDown(this.choiceKeys.numpadOne);
    const chooseTwo = Phaser.Input.Keyboard.JustDown(this.choiceKeys.two) || Phaser.Input.Keyboard.JustDown(this.choiceKeys.numpadTwo);

    if (!chooseOne && !chooseTwo) {
      return;
    }

    const reward = chooseOne ? this.run.rewardChoices[0] : this.run.rewardChoices[1];
    this.applyRewardChoice(reward);
    this.hideOverlay();
    this.physics.world.resume();
    this.isChoosingReward = false;
    this.updateObjective();
  }

  private applyRewardChoice(reward: RewardOption): void {
    this.selectedUpgradeLabel = reward.label;

    if (reward.id === "rapid-fire") {
      this.currentFireCooldownMs = this.run.rapidFireCooldownMs;
      return;
    }

    this.maxHealth = this.run.playerMaxHealth + this.run.reinforcedSuitBonusHealth;
    this.health = Math.min(this.maxHealth, this.health + this.run.reinforcedSuitHeal + this.run.reinforcedSuitBonusHealth);
    this.hud.setHealth(this.health, this.maxHealth);
  }

  private damageEnemy(enemy: EnemySprite): void {
    const defaultHealth = enemy.enemyType === "sentry" ? this.run.sentryHealth : this.run.droneHealth;
    enemy.health = (enemy.health ?? defaultHealth) - 1;
    enemy.setTintFill(0xffffff);
    this.time.delayedCall(60, () => {
      if (enemy.active) {
        enemy.clearTint();
      }
    });

    if ((enemy.health ?? 0) <= 0) {
      this.enemiesDestroyed += 1;
      enemy.destroy();
      this.updateObjective();
    }
  }

  private applyContactDamage(): void {
    if (this.time.now - this.lastDamageAt < this.run.playerDamageCooldownMs) {
      return;
    }

    this.lastDamageAt = this.time.now;
    this.applyDamage(this.run.contactDamage);
    this.cameras.main.flash(120, 255, 107, 107, false);
  }

  private applyProjectileDamage(): void {
    if (this.time.now - this.lastDamageAt < this.run.playerDamageCooldownMs) {
      return;
    }

    this.lastDamageAt = this.time.now;
    this.applyDamage(this.run.sentryProjectileDamage);
    this.cameras.main.flash(100, 255, 190, 120, false);
  }

  private applyDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    this.totalDamageTaken += amount;
    this.player.setTintFill(0xffffff);
    this.hud.setHealth(this.health, this.maxHealth);

    this.time.delayedCall(100, () => {
      if (this.player.active) {
        this.player.clearTint();
      }
    });

    if (this.health <= 0) {
      this.failRun();
    }
  }

  private updateObjective(): void {
    if (!this.hasKeycard) {
      this.hud.setObjective("Secure the keycard from the junction");
      return;
    }

    if (this.isChoosingReward) {
      this.hud.setObjective("Choose one run upgrade");
      return;
    }

    if (!this.powerNodeActive) {
      this.hud.setObjective("Restore power at the shuttle node");
      return;
    }

    this.hud.setObjective("Board the shuttle and press E");
  }

  private failRun(): void {
    this.freezeRun();
    this.showOverlay(
      "RUN FAILED",
      `Time  ${this.formatRunTime()}\nRoute  ${this.selectedVariant.label}\nUpgrade  ${this.selectedUpgradeLabel}\nPress R to restart.`,
    );
  }

  private completeRun(): void {
    this.freezeRun();
    this.cameras.main.flash(220, 144, 244, 178, false);
    this.showOverlay(
      "EXTRACTION COMPLETE",
      `Final Time  ${this.formatRunTime()}\nRoute  ${this.selectedVariant.label}\nUpgrade  ${this.selectedUpgradeLabel}\nHostiles Down  ${this.enemiesDestroyed}\nHazard Hits  ${this.hazardHits}\nDamage Taken  ${this.totalDamageTaken}\nPress R to run again.`,
    );
  }

  private freezeRun(): void {
    this.isEnded = true;
    this.isChoosingReward = false;
    this.physics.world.resume();
    this.player.setVelocity(0, 0);
    this.interactPrompt.setVisible(false);
    this.bullets.clear(true, true);
    this.enemyProjectiles.clear(true, true);
    for (const child of this.enemies.getChildren()) {
      (child as Phaser.Physics.Arcade.Sprite).setVelocity(0, 0);
    }
  }

  private formatRunTime(): string {
    const elapsed = Math.max(0, this.time.now - this.runStartedAt);
    const totalSeconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  private showOverlay(title: string, body: string): void {
    this.overlayPanel.setVisible(true);
    this.overlayTitle.setText(title).setVisible(true);
    this.overlayBody.setText(body).setVisible(true);
  }

  private hideOverlay(): void {
    this.overlayPanel.setVisible(false);
    this.overlayTitle.setVisible(false);
    this.overlayBody.setVisible(false);
  }

  private hasLineOfSight(from: { x: number; y: number }, to: { x: number; y: number }): boolean {
    const line = new Phaser.Geom.Line(from.x, from.y, to.x, to.y);

    return !this.activeObstacles.some((obstacle) => {
      const rect = new Phaser.Geom.Rectangle(
        obstacle.x - obstacle.width / 2 + 4,
        obstacle.y - obstacle.height / 2 + 4,
        Math.max(4, obstacle.width - 8),
        Math.max(4, obstacle.height - 8),
      );
      return Phaser.Geom.Intersects.LineToRectangle(line, rect);
    });
  }
}



