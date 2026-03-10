import Phaser from "phaser";
import { PALETTE } from "../config/gameConfig";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create(): void {
    this.createTextures();
    this.scene.start("menu");
  }

  private createTextures(): void {
    const graphics = this.add.graphics();

    graphics.clear();
    graphics.fillStyle(PALETTE.floor, 1);
    graphics.fillRect(0, 0, 32, 32);
    graphics.lineStyle(1, PALETTE.edge, 0.24);
    graphics.strokeRect(0, 0, 32, 32);
    graphics.lineStyle(1, PALETTE.edge, 0.18);
    graphics.strokeRect(4, 4, 24, 24);
    graphics.fillStyle(PALETTE.corridor, 1);
    graphics.fillRect(0, 13, 32, 6);
    graphics.generateTexture("floor-tile", 32, 32);

    graphics.clear();
    graphics.fillStyle(PALETTE.wall, 1);
    graphics.fillRoundedRect(0, 0, 16, 16, 2);
    graphics.lineStyle(2, PALETTE.edge, 0.95);
    graphics.strokeRoundedRect(1, 1, 14, 14, 2);
    graphics.generateTexture("wall-block", 16, 16);

    graphics.clear();
    graphics.fillStyle(PALETTE.player, 1);
    graphics.fillRoundedRect(1, 1, 14, 14, 4);
    graphics.fillStyle(0x1a2233, 1);
    graphics.fillRect(4, 3, 8, 4);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(6, 4, 4, 2);
    graphics.fillStyle(PALETTE.bullet, 1);
    graphics.fillRect(11, 7, 2, 3);
    graphics.generateTexture("player", 16, 16);

    graphics.clear();
    graphics.fillStyle(PALETTE.drone, 1);
    graphics.fillRoundedRect(0, 2, 16, 12, 4);
    graphics.fillStyle(0x32111c, 1);
    graphics.fillRect(4, 5, 8, 4);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(7, 6, 2, 2);
    graphics.generateTexture("drone", 16, 16);

    graphics.clear();
    graphics.fillStyle(PALETTE.sentry, 1);
    graphics.fillRoundedRect(1, 3, 14, 10, 3);
    graphics.fillStyle(0x2b1807, 1);
    graphics.fillRect(4, 5, 8, 4);
    graphics.fillStyle(PALETTE.sentryProjectile, 1);
    graphics.fillRect(12, 7, 2, 2);
    graphics.generateTexture("sentry", 16, 16);

    graphics.clear();
    graphics.fillStyle(PALETTE.bullet, 1);
    graphics.fillCircle(3, 3, 3);
    graphics.generateTexture("bullet", 6, 6);

    graphics.clear();
    graphics.fillStyle(PALETTE.sentryProjectile, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.lineStyle(1, PALETTE.sentry, 0.85);
    graphics.strokeCircle(4, 4, 3);
    graphics.generateTexture("sentry-bolt", 8, 8);

    graphics.clear();
    graphics.fillStyle(PALETTE.keycard, 1);
    graphics.fillRoundedRect(0, 0, 14, 10, 2);
    graphics.fillStyle(0xf5f7ff, 1);
    graphics.fillRect(3, 3, 6, 2);
    graphics.fillRect(3, 6, 4, 1);
    graphics.generateTexture("keycard", 14, 10);

    graphics.clear();
    graphics.fillStyle(PALETTE.powerNode, 0.28);
    graphics.fillCircle(12, 12, 12);
    graphics.fillStyle(PALETTE.powerNode, 1);
    graphics.fillRoundedRect(6, 4, 12, 16, 3);
    graphics.fillStyle(0xf5f7ff, 1);
    graphics.fillRect(10, 7, 4, 10);
    graphics.generateTexture("power-node-off", 24, 24);

    graphics.clear();
    graphics.fillStyle(PALETTE.powerNodeActive, 0.34);
    graphics.fillCircle(12, 12, 12);
    graphics.fillStyle(PALETTE.powerNodeActive, 1);
    graphics.fillRoundedRect(6, 4, 12, 16, 3);
    graphics.fillStyle(0xf5f7ff, 1);
    graphics.fillRect(10, 7, 4, 10);
    graphics.generateTexture("power-node-on", 24, 24);

    graphics.clear();
    graphics.fillStyle(PALETTE.exitLocked, 1);
    graphics.fillRect(0, 0, 28, 40);
    graphics.fillStyle(0x231d2e, 1);
    graphics.fillRect(6, 4, 16, 32);
    graphics.fillStyle(0xff6b6b, 0.9);
    graphics.fillRect(12, 6, 4, 28);
    graphics.generateTexture("exit-locked", 28, 40);

    graphics.clear();
    graphics.fillStyle(PALETTE.exitUnlocked, 1);
    graphics.fillRect(0, 0, 28, 40);
    graphics.fillStyle(0x123125, 1);
    graphics.fillRect(6, 4, 16, 32);
    graphics.fillStyle(0xf5f7ff, 0.95);
    graphics.fillRect(12, 6, 4, 28);
    graphics.generateTexture("exit-open", 28, 40);

    graphics.destroy();
  }
}
