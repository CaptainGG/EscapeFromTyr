import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, PALETTE } from "../config/gameConfig";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(PALETTE.background);

    this.add
      .text(GAME_WIDTH / 2, 60, "STATION ESCAPE", {
        fontFamily: '"Lucida Console", monospace',
        fontSize: "34px",
        color: "#f5f7ff",
      })
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        104,
        "Fight through a failing station, grab clearance, restore power, and reach the last shuttle out.",
        {
          align: "center",
          fontFamily: '"Lucida Console", monospace',
          fontSize: "12px",
          color: "#b9c4de",
          wordWrap: { width: 320 },
        },
      )
      .setOrigin(0.5);

    this.add
      .text(
        GAME_WIDTH / 2,
        170,
        "MOVE  WASD / ARROWS\nFIRE  MOUSE\nINTERACT  E\nCHOOSE  1 / 2\nRESTART  R",
        {
          align: "center",
          fontFamily: '"Lucida Console", monospace',
          fontSize: "11px",
          color: "#90f4b2",
          lineSpacing: 6,
        },
      )
      .setOrigin(0.5);

    const prompt = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 26, "PRESS ENTER OR SPACE", {
        fontFamily: '"Lucida Console", monospace',
        fontSize: "11px",
        color: "#ffc857",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.3,
      yoyo: true,
      repeat: -1,
      duration: 700,
    });

    this.input.keyboard?.once("keydown-ENTER", () => this.startRun());
    this.input.keyboard?.once("keydown-SPACE", () => this.startRun());
  }

  private startRun(): void {
    this.scene.start("run");
  }
}
