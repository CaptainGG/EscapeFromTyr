import Phaser from "phaser";
import { GAME_WIDTH, PALETTE } from "../config/gameConfig";

export class Hud {
  private readonly chrome: Phaser.GameObjects.Graphics;
  private readonly healthText: Phaser.GameObjects.Text;
  private readonly cooldownText: Phaser.GameObjects.Text;
  private readonly objectiveText: Phaser.GameObjects.Text;
  private healthRatio = 1;
  private cooldownRatio = 1;

  constructor(scene: Phaser.Scene) {
    this.chrome = scene.add.graphics().setScrollFactor(0).setDepth(10);

    this.healthText = scene.add
      .text(12, 10, "HP 100%", {
        fontFamily: '"Lucida Console", monospace',
        fontSize: "10px",
        color: "#f5f7ff",
      })
      .setScrollFactor(0)
      .setDepth(11);

    this.cooldownText = scene.add
      .text(GAME_WIDTH / 2, 10, "SIDEARM READY", {
        fontFamily: '"Lucida Console", monospace',
        fontSize: "10px",
        color: "#f5f7ff",
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(11);

    this.objectiveText = scene.add
      .text(GAME_WIDTH - 12, 10, "Reach the junction", {
        fontFamily: '"Lucida Console", monospace',
        fontSize: "9px",
        color: "#b9c4de",
        align: "right",
        wordWrap: { width: 172 },
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(11);

    this.redraw();
  }

  setHealth(value: number, max: number): void {
    this.healthRatio = Phaser.Math.Clamp(value / max, 0, 1);
    this.healthText.setText(`HP ${Math.round(this.healthRatio * 100)}%`);
    this.redraw();
  }

  setCooldown(value: number): void {
    this.cooldownRatio = Phaser.Math.Clamp(value, 0, 1);
    this.cooldownText.setText(
      this.cooldownRatio >= 0.99
        ? "SIDEARM READY"
        : `SIDEARM ${Math.round(this.cooldownRatio * 100)}%`,
    );
    this.redraw();
  }

  setObjective(text: string): void {
    this.objectiveText.setText(text);
  }

  private redraw(): void {
    this.chrome.clear();
    this.chrome.fillStyle(PALETTE.panel, 0.9);
    this.chrome.fillRoundedRect(8, 8, GAME_WIDTH - 16, 32, 7);
    this.chrome.lineStyle(1, PALETTE.edge, 0.8);
    this.chrome.strokeRoundedRect(8, 8, GAME_WIDTH - 16, 32, 7);

    this.chrome.fillStyle(0x1a2233, 1);
    this.chrome.fillRoundedRect(12, 25, 92, 8, 3);
    this.chrome.fillStyle(PALETTE.player, 1);
    this.chrome.fillRoundedRect(12, 25, 92 * this.healthRatio, 8, 3);

    this.chrome.fillStyle(0x1a2233, 1);
    this.chrome.fillRoundedRect(GAME_WIDTH / 2 - 50, 25, 100, 8, 3);
    this.chrome.fillStyle(PALETTE.bullet, 1);
    this.chrome.fillRoundedRect(GAME_WIDTH / 2 - 50, 25, 100 * this.cooldownRatio, 8, 3);
  }
}