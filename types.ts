
export type EnemyType = "grunt" | "swordsman" | "heavy" | "necromancer" | "necromancer_minion" | "berserker" | "loyalist" | "origin_enforcer" | "commander" | "king" | "overseer_protector";
export type ToolType = "sentry" | "shocker" | "blaster" | "repeater" | "cannon" | "healer" | "sell";

export interface UpgradeState {
  dmg: number;
  range: number;
  core: number;
  coin: number;
}

export interface Dialogue {
  wave: number;
  name: string;
  text: string;
  color: string;
}

export interface GameState {
  hp: number;
  maxHp: number;
  credits: number;
  wave: number;
  threatsRemaining: number;
  unitCount: number;
  maxUnits: number;
  techLevel: number;
}
