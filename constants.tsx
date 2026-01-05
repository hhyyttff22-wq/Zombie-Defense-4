
import { Dialogue, EnemyType } from './types';

export const CORE_X = 900;
export const CORE_Y = 600;
export const CORE_RADIUS = 100;
export const CANVAS_WIDTH = 1800;
export const CANVAS_HEIGHT = 1200;

export interface ExtendedDialogue extends Dialogue {
  type?: EnemyType | 'noobian';
}

export const DIALOGUE_SCRIPT: ExtendedDialogue[] = [
  { wave: 1, name: "Noobian Commander", type: 'noobian', text: "Leader, our enemies are commencing a full scale incursion on our core defend it.", color: "#00d4ff" },
  { wave: 2, name: "???", type: 'swordsman', text: "Aegis Knights in position. Sending them out now.", color: "#39ff14" },
  { wave: 3, name: "???", type: 'necromancer', text: "Deploy our Necromancers, let them finish the job.", color: "#39ff14" },
  { wave: 4, name: "Noobian Commander", type: 'noobian', text: "Leader. They're ramping up their attacks from this point on, our communication is cutting out.", color: "#00d4ff" },
  { wave: 5, name: "???", type: 'loyalist', text: "Interceptor, why is the core still standing? send out more troops!", color: "#39ff14" },
  { wave: 6, name: "Interceptor", type: 'loyalist', text: "Understood, sending out berserkers.", color: "#39ff14" },
  { wave: 9, name: "Interceptor", type: 'loyalist', text: "Commander, let me fight them myself. I'll take care of the core.", color: "#39ff14" },
  { wave: 10, name: "Interceptor", type: 'loyalist', text: "Deploying lasers! For Legion of the Void!", color: "#39ff14" },
  { wave: 11, name: "???", type: 'commander', text: "We lost Interceptor? he went there without most reinforcements, not our fault hes dead.", color: "#39ff14" },
  { wave: 12, name: "Origin Enforcer", type: 'origin_enforcer', text: "Commander, I'll take care of this.", color: "#00ff00" },
  { wave: 13, name: "???", type: 'commander', text: "Origin Enforcer is marked KIA, Overseer, what do you propose?", color: "#39ff14" },
  { wave: 14, name: "???", type: 'king', text: "What? I'm supposed to fight them? Fine.", color: "#39ff14" },
  { wave: 15, name: "Zombie Commander", type: 'commander', text: "Hello, 'leader', your core stands no chance against me and my army.", color: "#39ff14" },
  { wave: 16, name: "???", type: 'king', text: "He was useless to me.", color: "#ffffff" },
  { wave: 19, name: "???", type: 'king', text: "Everyone I was working with is dead, thanks to you. Ohh I'm gonna enjoy this.", color: "#39ff14" },
  { wave: 20, name: "The Overseer", type: 'king', text: "THAT CORE IS MINE!", color: "#ffffff" }
];

// Fixed: Increased intervals to 60-40 range for early waves to prevent "all at once" spawning
// Wave 20 nerfed: 95 enemies, slower spawn interval (25) to make the boss fight manageable
export const WAVE_CONFIGS = [
  { count: 15, interval: 60 }, { count: 30, interval: 55 }, { count: 45, interval: 50 },
  { count: 60, interval: 48 },  { count: 70, interval: 45 },  { count: 80, interval: 42 },
  { count: 90, interval: 40 },  { count: 100, interval: 38 },  { count: 110, interval: 35 },
  { count: 120, interval: 32 },  { count: 130, interval: 30 },  { count: 140, interval: 28 },
  { count: 150, interval: 25 }, { count: 160, interval: 22 }, { count: 180, interval: 20 },
  { count: 200, interval: 18 }, { count: 220, interval: 15 }, { count: 250, interval: 12 },
  { count: 300, interval: 10 }, { count: 95, interval: 25 },
];

export const TURRET_STATS = {
  sentry: { name: "SENTRY", cost: 250, color: "#00d4ff", hp: 150, dmg: 90, cd: 25, range: 550 },
  // Shotgunner Buff: Increased pellet damage and reduced cooldown to make it better than Sentry
  blaster: { name: "SHOTGUNNER", cost: 450, color: "#ff4400", hp: 180, dmg: 70, cd: 35, range: 420 },
  // Shocker -> Taser
  shocker: { name: "TASER", cost: 550, color: "#00ffcc", hp: 200, dmg: 35, cd: 180, range: 420 },
  // Repeater -> Chaingunner (Buffed base damage for better late-game performance)
  repeater: { name: "CHAINGUNNER", cost: 650, color: "#ffff00", hp: 180, dmg: 55, cd: 10, range: 520 },
  // Cannon Buff: CD 200 -> 180, DMG 3000 -> 2500 (Balance nerf)
  cannon: { name: "PLASMA SNIPER", cost: 2500, color: "#a020f0", hp: 500, dmg: 2500, cd: 180, range: 1100 },
  // Healer -> Caduceus (Cheaper cost)
  healer: { name: "CADUCEUS", cost: 650, color: "#ffffff", hp: 120, dmg: 20, cd: 480, range: 200 }
};
