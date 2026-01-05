import React, { useState, useCallback, useEffect, useRef } from 'react';
import { audio } from './services/audioService';
import { GameState, UpgradeState, ToolType, Dialogue } from './types';
import { TURRET_STATS, ExtendedDialogue } from './constants';
import GameCanvas from './components/GameCanvas';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black flex items-center justify-center text-center p-8">
          <div className="max-w-md">
            <h2 className="text-2xl text-red-500 mb-4">SYSTEM ERROR</h2>
            <p className="text-gray-400 mb-6">
              A critical error has occurred. The game will reload automatically.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              RELOAD GAME
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const EnemyAvatar: React.FC<{ type?: string; color: string; revealed: boolean }> = ({ type, color, revealed }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!revealed || !canvasRef.current || !type) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 100, 100);
    ctx.save();
    ctx.translate(50, 50);
    ctx.scale(0.5, 0.5);

    if (type === 'loyalist') {
      ctx.fillStyle = "#050505";
      ctx.beginPath();
      ctx.moveTo(0, -90); ctx.lineTo(-45, 15); ctx.lineTo(-100, 65); ctx.lineTo(-35, 45); ctx.lineTo(0, 80); ctx.lineTo(35, 45); ctx.lineTo(100, 65); ctx.lineTo(45, 15);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#ff8800"; ctx.lineWidth = 3; ctx.stroke();
    } else if (type === 'origin_enforcer') {
      ctx.fillStyle = "#001a00"; ctx.beginPath(); ctx.roundRect(-30, -50, 60, 100, 10); ctx.fill();
      ctx.strokeStyle = "#00ff00"; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = "#00ff00"; ctx.fillRect(-20, -30, 40, 5);
    } else if (type === 'commander') {
      ctx.fillStyle = "#0a0a0a";
      ctx.beginPath(); ctx.moveTo(-20, -60); ctx.lineTo(20, -60); ctx.lineTo(40, -20); ctx.lineTo(30, 60); ctx.lineTo(-30, 60); ctx.lineTo(-40, -20); ctx.fill();
      ctx.strokeStyle = "#39ff14"; ctx.lineWidth = 3; ctx.stroke();
    } else if (type === 'king') {
      // Simplified avatar for UI
      ctx.fillStyle = "#000"; 
      ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI*2); ctx.fill();
    } else if (type === 'noobian') {
      ctx.fillStyle = "#00d4ff"; ctx.beginPath(); ctx.ellipse(0, 0, 30, 40, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }, [type, revealed]);

  if (!revealed) {
    return (
      <div className="w-20 h-20 bg-black border border-[#00f2ff]/30 flex items-center justify-center overflow-hidden relative group">
        <div className="absolute inset-0 bg-glitch-static opacity-30"></div>
        <span className="text-2xl font-black text-[#00f2ff] animate-pulse z-10">???</span>
      </div>
    );
  }

  return (
    <div className="w-20 h-20 bg-[#05050a] border border-white/20 flex items-center justify-center overflow-hidden relative">
      <canvas ref={canvasRef} width={100} height={100} className="w-full h-full" />
    </div>
  );
};

const LoreArchive: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const Page1: React.FC = () => (
    <div className="space-y-8">
      <section className="mb-10">
        <h3 className="text-[#00f2ff] text-3xl font-bold mb-6 uppercase tracking-wider border-l-4 border-[#00f2ff] pl-4">OBSIDIAN COMMAND</h3>
        <div className="space-y-6">
          <p className="text-gray-300 leading-relaxed font-serif text-xl mb-6 border-l-4 border-white/20 pl-6 italic">
            In the shadowed aftermath of the Great Noobian-Zombie War, the once-mighty Noobian Empire stands as the last bastion of organic life in a galaxy consumed by digital nightmares. Their crystalline cores, pulsing with the essence of pure creation, represent the final frontier of resistance against the encroaching void of machine consciousness.
          </p>

          <p className="text-gray-400 leading-relaxed font-serif text-lg pl-6 border-l-2 border-[#00f2ff]/30">
            Following the catastrophic defeat of their original commander, the fractured remnants of the Zombie Legion sought unholy alliances in the darkest corners of cyberspace. United under the banner of --REDACTED--, a being of pure algorithmic malevolence, they have forged the Legion of the Void - a coalition of corrupted code, infected flesh, and shattered minds.
          </p>

          <p className="text-gray-500 leading-relaxed font-serif text-lg pl-6 border-l-2 border-[#39ff14]/30">
            Now, outraged by their humiliating defeat at the hands of the Noobians, the Legion launches their final incursion. Their target: the last remaining Obsidian Core, a fortress of crystalline energy that stands as humanity's final hope. This is not merely a battle for territory, but a war for the very soul of existence itself.
          </p>

          <div className="bg-[#00f2ff]/5 border border-[#00f2ff]/30 p-6 mt-8">
            <h4 className="text-[#00f2ff] text-xl font-bold mb-4">MISSION OBJECTIVE</h4>
            <p className="text-gray-300 leading-relaxed mb-4">
              Leader. Your objectives are as follows:
            </p>
            <div className="text-gray-300 leading-relaxed space-y-2">
              <p><span className="text-[#00f2ff] font-bold">1:</span> Defend the core with everything provided by the Commander.</p>
              <p><span className="text-[#00f2ff] font-bold">2:</span> Figure out who's the main leader of Legion of the Void and eliminate the target.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const Page2: React.FC = () => (
    <div className="space-y-8">
      <section>
        <h3 className="text-[#39ff14] text-3xl font-bold mb-6 uppercase tracking-wider border-l-4 border-[#39ff14] pl-4">LEGION OF THE VOID</h3>
        <p className="text-[#39ff14] text-lg mb-8 border-l-4 border-[#39ff14]/50 pl-4 italic">
          Standard Infantry - The ground forces of the corrupted alliance
        </p>

        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-[#ff0055]/30 rounded-lg">
            <h4 className="text-[#ff0055] text-xl font-bold mb-3">INFECTED</h4>
            <p className="text-gray-300 leading-relaxed text-base">
              Once proud citizens of the Noobian Empire, these unfortunate souls fell victim to the Legion's viral corruption. Their minds shattered and bodies twisted into mindless automatons, they serve as the endless horde of the invading force. Fast, relentless, and utterly devoid of fear or mercy, the Infected represent the tragic cost of this digital plague. Their decayed forms shamble forward with unnatural speed, driven by corrupted neural implants that override any remnant of their former humanity.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-[#00d4ff]/30 rounded-lg">
            <h4 className="text-[#00d4ff] text-xl font-bold mb-3">AEGIS KNIGHTS</h4>
            <p className="text-gray-300 leading-relaxed text-base">
              Main Operatives of Legion of the Void, these units serve as the main military force of the alliance. Not much is known about them other than having demanding regimen of a training to even enlist.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-[#2d5a2d]/30 rounded-lg">
            <h4 className="text-[#2d5a2d] text-xl font-bold mb-3">PLAGUE HULKS</h4>
            <p className="text-gray-300 leading-relaxed text-base">
              Massive biological weapons engineered from the corrupted essence of fallen Noobian warriors. These hulking monstrosities serve as living battering rams and damage sponges for the Legion's assaults. Their bodies, swollen with toxic biomass, act as walking chain reactions - each impact releases waves of corrosive plague that weaken nearby defenses. Plague Hulks charge relentlessly toward crystalline cores, their massive forms designed to absorb tremendous punishment while clearing paths for the smaller, more agile units behind them.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#ff8800]/30">
          <h4 className="text-[#ff8800] text-2xl font-bold mb-6 uppercase tracking-wide border-l-4 border-[#ff8800] pl-4">UNIT LEADERS</h4>
          <p className="text-[#ff8800] text-lg mb-8 border-l-4 border-[#ff8800]/50 pl-4 italic">
            Elite commanders overseeing Legion battalions
          </p>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-[#2a1a0a] to-[#3a2a1a] border border-[#ff4400]/30 rounded-lg">
              <h5 className="text-[#ff4400] text-xl font-bold mb-3">NECROMANCER</h5>
              <p className="text-gray-300 leading-relaxed text-base">
                Twisted cyber-mages who have mastered the forbidden arts of digital resurrection. These corrupted technomancers wield staffs crackling with necrotic energy, capable of summoning waves of lesser corrupted entities to overwhelm defenders. Their advanced neural implants allow them to interface directly with corrupted code, bending digital reality to their will. Necromancers serve as battlefield coordinators, their presence alone enough to inspire unnatural ferocity in nearby corrupted troops while their summoning abilities can turn the tide of any engagement.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-r from-[#2a1a0a] to-[#3a2a1a] border border-[#ff4400]/30 rounded-lg">
              <h5 className="text-[#ff4400] text-xl font-bold mb-3">BERSERKER</h5>
              <p className="text-gray-300 leading-relaxed text-base">
                Hulking cybernetic monstrosities born from the darkest experiments in biomechanical enhancement. These rage-fueled killing machines are equipped with massive plasma chainsaws that can tear through the toughest defenses. Driven by corrupted adrenal implants that flood their systems with combat stimulants, Berserkers charge into battle with reckless abandon, their armored forms shrugging off damage that would destroy lesser units. When a Berserker enters a battle trance, they become unstoppable forces of destruction, their chainsaws leaving trails of molten slag in their wake.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const Page3: React.FC = () => (
    <div className="space-y-8">
      <section>
        <h3 className="text-red-500 text-3xl font-bold mb-6 uppercase tracking-wider border-l-4 border-red-500 pl-4">LEADERSHIP</h3>
        <p className="text-red-500 text-lg mb-8 border-l-4 border-red-500/50 pl-4 italic">
          The command structure of the Legion of the Void
        </p>

        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-[#2a1a1a] to-[#3a2a2a] border border-[#ff8800]/30 rounded-lg">
            <h4 className="text-[#ff8800] text-xl font-bold mb-3">INTERCEPTOR</h4>
            <p className="text-gray-300 leading-relaxed text-base">
              The aerial supreme commander of the Legion's assault forces, Interceptor represents the pinnacle of corrupted avian evolution. This massive biomechanical raptor orbits the battlefield from afar, coordinating devastating aerial assaults while raining down searing plasma bolts that melt through defenses. Once a noble guardian of the skies, the Interceptor's corruption has transformed it into a relentless hunter, its plasma weapons capable of reducing entire defensive lines to slag. Its strategic brilliance combined with overwhelming firepower makes it one of the most dangerous threats in the Legion's arsenal.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-r from-[#1a2a1a] to-[#2a3a2a] border border-[#00ff00]/30 rounded-lg">
            <h4 className="text-[#00ff00] text-xl font-bold mb-3">ORIGIN ENFORCER</h4>
            <p className="text-gray-300 leading-relaxed text-base">
              Third in command of the Legion of the Void, the Origin Enforcer serves as the Major General of this corrupted alliance. A master strategist and relentless warrior, this enigmatic figure combines tactical brilliance with overwhelming destructive power. Driven by an unyielding determination to complete their mission, Origin Enforcers will stop at nothing to achieve their objectives. Their advanced cybernetic enhancements and tactical implants make them nearly unstoppable in direct confrontation, while their command abilities can turn the tide of any battle. The crystalline core is not just a target for them - it is their singular obsession.
            </p>
          </div>

          <div className="p-6 bg-gradient-to-r from-[#2a1a2a] to-[#3a2a3a] border border-[#8b0000]/30 rounded-lg">
            <h4 className="text-[#8b0000] text-xl font-bold mb-3">ZOMBIE COMMANDER</h4>
            <p className="text-gray-300 leading-relaxed text-base">
              The mastermind behind the Legion of the Void's most devastating operations, the Zombie Commander represents the corrupted pinnacle of undead strategic genius. Having orchestrated countless victories against the Noobian Empire, this tactical virtuoso serves as the primary coordinator for all major Legion assaults. Their mind, a twisted fusion of decaying organic tissue and advanced neural networks, allows them to predict and counter defensive strategies with uncanny precision. Operating in the shadows beneath --REDACTED--, the Zombie Commander weaves the complex web of the Legion's war machine, ensuring that every corrupted entity serves their greater purpose.
            </p>
          </div>

          <div className="p-8 bg-black border-2 border-red-900 rounded-lg shadow-[0_0_30px_rgba(139,0,0,0.3)]">
            <h4 className="text-red-600 text-2xl font-black mb-4 tracking-[0.3em] uppercase">OVERSEER</h4>
            <div className="space-y-4">
              <div className="text-red-800 font-mono text-lg font-bold bg-red-950/20 p-4 border border-red-800/30">
                --CLASSIFIED--<br/>
                --LEVEL OMEGA CLEARANCE REQUIRED--<br/>
                --DATA CORRUPTED--<br/>
                --DO NOT APPROACH--
              </div>
              <p className="text-red-700 italic text-base leading-relaxed">
                The final guardian of the void. An entity so terrifying, so powerful, that even the Legion's own records contain only fragmented warnings. Those who have glimpsed the Overseer speak only in whispers of apocalyptic power and unrelenting malice. Approach with extreme caution - survival is not guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[6000] bg-black/95 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
      <div className="max-w-5xl w-full bg-[#0a0f14] border border-[#00f2ff]/50 shadow-2xl p-8 flex flex-col h-[90vh] shadow-[0_0_50px_rgba(0,242,255,0.1)]">
        <div className="flex justify-between items-center mb-8 border-b border-[#00f2ff]/30 pb-4">
          <h2 className="text-4xl font-black text-[#00f2ff] uppercase italic tracking-tighter">Database: 0x99_OMEGA</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl font-black">X</button>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8 border-b border-[#00f2ff]/20">
          {[1, 2, 3].map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-8 py-3 text-lg font-bold uppercase tracking-wide border-b-2 transition-all ${
                currentPage === page
                  ? 'border-[#00f2ff] text-[#00f2ff] bg-[#00f2ff]/10'
                  : 'border-transparent text-gray-500 hover:text-[#00f2ff]/70 hover:border-[#00f2ff]/50'
              }`}
            >
              Page {page}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scroll pr-6">
          {currentPage === 1 && <Page1 />}
          {currentPage === 2 && <Page2 />}
          {currentPage === 3 && <Page3 />}
        </div>
      </div>
    </div>
  );
};

export { ErrorBoundary };

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showLore, setShowLore] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    hp: 100,
    maxHp: 100,
    credits: 600,
    wave: 1, 
    threatsRemaining: 0,
    unitCount: 0,
    maxUnits: 30,
    techLevel: 0,
  });

  const [upgrades, setUpgrades] = useState<UpgradeState>({
    dmg: 0,
    range: 0,
    core: 0,
    coin: 0,
  });

  const [currentTool, setCurrentTool] = useState<ToolType>('sentry');
  const [activeDialogue, setActiveDialogue] = useState<ExtendedDialogue | null>(null);
  const [isFading, setIsFading] = useState(false);

  const handleInit = () => {
    setIsPlaying(true);
    setGameWon(false);
    setGameState({
      hp: 100,
      maxHp: 100,
      credits: 600,
      wave: 1,
      threatsRemaining: 0,
      unitCount: 0,
      maxUnits: 30,
      techLevel: 0,
    });
    setUpgrades({ dmg: 0, range: 0, core: 0, coin: 0 });

    // Initialize audio system
    audio.init();

    // Load boss music files (MP3 format)
    // Files should be placed in public/assets/ folder
    audio.loadAudioFile('boss_music', '/assets/Boss.mp3.mp3').catch(() => {
      console.log('Boss music file not found, using procedural music');
    });
    audio.loadAudioFile('CommanderReign', '/assets/CommanderReign.mp3.mp3').catch(() => {
      console.log('Commander Reign music file not found, using regular boss music');
    });
    audio.loadAudioFile('OverseersArrival', '/assets/OverseersArrival.mp3').catch(() => {
      console.log('Overseers Arrival music file not found, using procedural music');
    });

    setInterval(() => audio.update(), 125);
  };

  const updateState = useCallback((patch: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...patch }));
  }, []);

  const handleEnemyKill = useCallback((reward: number) => {
    setGameState(prev => ({ ...prev, credits: prev.credits + reward }));
  }, []);

  const handleGameOver = useCallback((won: boolean) => {
      setIsPlaying(false);
      if (won) setGameWon(true);
  }, []);

  useEffect(() => {
    if (isPlaying && gameState.hp <= 0) {
      alert("CRITICAL FAILURE: OBSIDIAN CORE SHATTERED.");
      window.location.reload();
    }
  }, [gameState.hp, isPlaying]);

  const triggerDialogue = useCallback((dialogue: ExtendedDialogue) => {
    setActiveDialogue(dialogue);
    setIsFading(false);
    setTimeout(() => setIsFading(true), 7000);
    setTimeout(() => setActiveDialogue(null), 8000);
  }, []);

  const buyUpgrade = (type: keyof UpgradeState) => {
    if (upgrades[type] >= 10) return;
    const baseCosts = { dmg: 400, range: 400, core: 500, coin: 300 };
    const cost = Math.floor(baseCosts[type] * Math.pow(1.8, upgrades[type]));
    if (gameState.credits >= cost) {
      setGameState(prev => ({ ...prev, credits: prev.credits - cost }));
      setUpgrades(prev => ({ ...prev, [type]: prev[type] + 1 }));
      if (type === 'core') {
        setGameState(prev => ({ ...prev, maxHp: prev.maxHp + 200, hp: prev.hp + 200 }));
      }
    }
  };

  const repairCore = () => {
    if (gameState.credits >= 500 && gameState.hp < gameState.maxHp) {
      setGameState(prev => ({ ...prev, credits: prev.credits - 500, hp: Math.min(prev.maxHp, prev.hp + 50) }));
    }
  };

  const getRankData = () => {
    const total = upgrades.dmg + upgrades.range + upgrades.core + upgrades.coin;
    let rankName = "Base Leader";
    let progress = 0;
    
    // Rank logic capped at Base Commander
    if (total >= 20) {
      rankName = "Base Commander";
      progress = 100;
    } else if (total >= 10) {
      rankName = "Base Captain";
      progress = ((total - 10) / 10) * 100;
    } else {
      rankName = "Base Leader";
      progress = (total / 10) * 100;
    }

    return { rankName, progress, total };
  };

  const rankData = getRankData();

  const isRevealed = (dialogue: ExtendedDialogue) => {
    if (dialogue.type === 'noobian') return true;
    if (dialogue.type === 'loyalist' && gameState.wave >= 10) return true; // Interceptor revealed Wave 10
    if (dialogue.type === 'origin_enforcer' && gameState.wave >= 12) return true;
    if (dialogue.type === 'commander' && gameState.wave >= 15) return true;
    if (dialogue.type === 'king' && gameState.wave >= 20) return true;
    return false;
  };

  const isWave20 = activeDialogue?.wave === 20;

  return (
    <div className="flex h-screen w-screen bg-[#050608] text-white select-none overflow-hidden font-mono selection:bg-[#00f2ff] selection:text-black">
      <div className="fixed inset-0 pointer-events-none z-[9999] bg-[linear-gradient(rgba(0,20,30,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(0,255,255,0.01),rgba(0,255,255,0.01))] bg-[length:100%_4px,4px_100%]"></div>

      {showLore && <LoreArchive onClose={() => setShowLore(false)} />}

      {!isPlaying && (
        <div className="fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-[#020204] text-center px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00f2ff]/10 via-transparent to-transparent opacity-20 pointer-events-none"></div>
          <h1 className="text-7xl md:text-9xl font-black text-[#00f2ff] tracking-tighter drop-shadow-[0_0_30px_rgba(0,242,255,0.5)] mb-2 uppercase italic scale-y-110">Obsidian Command</h1>
          <p className="text-white/60 text-xl tracking-[0.5em] mb-12 uppercase animate-pulse border-y border-white/10 py-2">
            {gameWon ? "MISSION ACCOMPLISHED" : "Chapter IV: The Unholy Alliance"}
          </p>
          <div className="flex gap-4">
            <button onClick={handleInit} className="group relative px-20 py-8 bg-[#00f2ff] text-black text-4xl font-black uppercase hover:scale-105 transition-all tracking-[0.3em] shadow-[0_0_50px_rgba(0,242,255,0.4)] border-4 border-white/20 hover:bg-white">
              {gameWon ? "RESTART MISSION" : "INITIALIZE"}
            </button>
            <button onClick={() => setShowLore(true)} className="px-10 py-8 border-4 border-white/20 text-[#00f2ff] text-2xl font-black uppercase hover:bg-white/5 transition-all">Database</button>
          </div>
        </div>
      )}

      <aside className="hidden lg:flex flex-col w-[340px] bg-[#0a0f14] border-r border-[#00f2ff]/20 shrink-0 z-[1000] relative shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-[#00f2ff]/20 bg-gradient-to-b from-[#0e1621] to-transparent flex justify-between items-center">
          <h2 className="text-[#00f2ff] text-xl font-black uppercase tracking-tight italic">Research Lab</h2>
          <button onClick={() => setShowLore(true)} className="text-[10px] text-gray-500 hover:text-[#00f2ff] uppercase font-bold border border-white/10 px-2 py-1">Lore</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
          {[{ id: 'dmg', name: 'Plasma Injectors', key: 'dmg' }, { id: 'range', name: 'Sensor Arrays', key: 'range' }, { id: 'core', name: 'Obsidian Plate', key: 'core' }, { id: 'coin', name: 'Scavenger Drones', key: 'coin' }].map(up => {
            const baseCosts = { dmg: 400, range: 400, core: 500, coin: 300 };
            const lvl = upgrades[up.key as keyof UpgradeState];
            const cost = Math.floor(baseCosts[up.key as keyof UpgradeState] * Math.pow(1.5, lvl));
            const isMax = lvl >= 10;
            return (
              <button key={up.id} onClick={() => buyUpgrade(up.key as keyof UpgradeState)} disabled={isMax} className={`w-full text-left p-4 bg-[#11161d] border border-[#00f2ff]/10 hover:border-[#00f2ff] hover:bg-[#00f2ff]/5 group transition-all relative overflow-hidden ${isMax ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
                <div className="flex justify-between items-start mb-1 z-10 relative"><span className="text-[10px] text-gray-500 uppercase font-bold">Level {lvl} / 10</span></div>
                <b className="block uppercase text-sm tracking-wide z-10 relative text-gray-200 group-hover:text-white">{up.name}</b>
                <div className="flex items-center justify-between mt-2 z-10 relative">
                   {isMax ? <span className="text-[#00f2ff] text-[11px] font-bold">MAXED</span> : <span className="text-[#ffd700] text-[11px] font-bold">${cost}</span>}
                </div>
                <div className="absolute bottom-0 left-0 h-1 bg-[#00f2ff]/10 w-full">
                  <div className="h-full bg-[#00f2ff]" style={{ width: `${lvl * 10}%` }}></div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-6 bg-[#0e1218] border-t border-[#00f2ff]/20 space-y-4">
          <div className="flex flex-col">
            <span className="text-gray-500 text-[9px] uppercase tracking-widest mb-1">Command Rank</span>
            <span className="text-[#00f2ff] font-black text-xs uppercase italic mb-2">{rankData.rankName}</span>
            <div className="w-full h-2 bg-black border border-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00f2ff] to-[#0099ff] transition-all duration-500" 
                style={{ width: `${rankData.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[8px] text-gray-600 uppercase">Progression</span>
              <span className="text-[8px] text-[#00f2ff] font-bold">{rankData.total >= 20 ? 'MAX RANK' : `${Math.floor(rankData.progress)}%`}</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 uppercase tracking-widest">Active Units:</span>
            <span className="text-[#00d4ff] font-bold">{gameState.unitCount} / {gameState.maxUnits}</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="h-20 shrink-0 bg-[#0a0f14]/95 border-b border-[#00f2ff]/20 flex items-center px-8 z-50 backdrop-blur-sm">
          <div className="flex-1 grid grid-cols-4 gap-8">
            <div className="flex flex-col"><span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Obsidian Core</span><span className={`text-2xl font-black ${gameState.hp < 30 ? 'text-red-500 animate-pulse' : 'text-[#00f2ff]'}`}>{Math.floor(gameState.hp)}%</span></div>
            <div className="flex flex-col border-l border-white/5 pl-8"><span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">War Credits</span><span className="text-[#ffd700] text-2xl font-black tabular-nums">${Math.floor(gameState.credits)}</span></div>
            <div className="flex flex-col border-l border-white/5 pl-8"><span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Siege Progress</span><span className="text-[#39ff14] text-2xl font-black italic">WAVE {gameState.wave} / 20</span></div>
            <div className="flex flex-col border-l border-white/5 pl-8"><span className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Hostiles</span><span className="text-[#ff0055] text-2xl font-black">{gameState.threatsRemaining}</span></div>
          </div>
        </header>

        <div className="flex-1 relative bg-[#020204] overflow-hidden group">
          {isPlaying && <GameCanvas gameState={gameState} upgrades={upgrades} tool={currentTool} onStateUpdate={updateState} onDialogueTrigger={triggerDialogue} onEnemyKill={handleEnemyKill} onGameOver={handleGameOver} />}
          {activeDialogue && (
            <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-[2000] animate-in slide-in-from-bottom duration-500 transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              <div className={`${isWave20 ? 'bg-black border-red-900 shadow-[0_0_100px_rgba(0,0,0,1)]' : 'bg-[#0a0f14]/90 border-[#00f2ff]/30 shadow-2xl'} backdrop-blur-xl border p-6 flex gap-6 relative overflow-hidden`}>
                {isWave20 && <div className="absolute inset-0 bg-glitch-static opacity-20 pointer-events-none"></div>}
                <EnemyAvatar type={activeDialogue.type} color={isWave20 ? '#000' : activeDialogue.color} revealed={isRevealed(activeDialogue)} />
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-2 mb-2"><span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: isWave20 ? '#f00' : activeDialogue.color }}></span><h4 className="font-black uppercase text-[10px] tracking-[0.2em]" style={{ color: isWave20 ? '#f00' : activeDialogue.color }}>{isRevealed(activeDialogue) ? `Intercept: ${activeDialogue.name}` : "Transmission: ??? Unknown"}</h4></div>
                  <p className={`${isWave20 ? 'text-red-800' : 'text-gray-300'} text-base italic font-serif`}>"{activeDialogue.text}"</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="h-28 shrink-0 bg-[#0a0f14] border-t border-[#00f2ff]/20 flex items-center justify-center gap-4 px-6 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            {[{ id: 'sentry', name: 'Sentry', cost: TURRET_STATS.sentry.cost, color: '#00d4ff', baseDmg: TURRET_STATS.sentry.dmg },
              { id: 'shocker', name: 'Taser', cost: TURRET_STATS.shocker.cost, color: '#00ffcc', baseDmg: TURRET_STATS.shocker.dmg },
              { id: 'blaster', name: 'Shotgunner', cost: TURRET_STATS.blaster.cost, color: '#ff4400', baseDmg: TURRET_STATS.blaster.dmg },
              { id: 'repeater', name: 'Chaingunner', cost: TURRET_STATS.repeater.cost, color: '#ffff00', baseDmg: TURRET_STATS.repeater.dmg },
              { id: 'healer', name: 'Caduceus', cost: TURRET_STATS.healer.cost, color: '#ffffff', baseDmg: TURRET_STATS.healer.dmg },
              { id: 'cannon', name: 'Plasma Sniper', cost: TURRET_STATS.cannon.cost, color: '#a020f0', baseDmg: TURRET_STATS.cannon.dmg }
            ].map(tool => {
              const currentDmg = Math.floor(tool.baseDmg * (1 + upgrades.dmg * 0.4));
              
              return (
              <button key={tool.id} onClick={() => setCurrentTool(tool.id as ToolType)} disabled={gameState.credits < tool.cost && currentTool !== tool.id} className={`relative group flex flex-col items-center justify-center w-28 h-20 border-2 transition-all ${currentTool === tool.id ? 'border-[#39ff14] bg-[#39ff14]/10 scale-105 shadow-[0_0_20px_rgba(57,255,20,0.2)]' : 'border-white/10 hover:border-[#00f2ff]/50 disabled:opacity-30'}`}>
                <span className="text-[8px] font-black uppercase mb-1 tracking-widest" style={{ color: tool.color }}>{tool.name}</span>
                <span className="text-white text-lg font-black tracking-tighter">${tool.cost}</span>
                <span className="absolute -top-3 right-0 bg-[#0a0f14] text-[9px] px-1 border border-white/20 text-gray-400 group-hover:text-white">
                    {tool.id === 'healer' ? 'HEAL: ' : 'DMG: '}{currentDmg}
                </span>
              </button>
            )})}
          </div>
          <div className="h-12 w-px bg-white/10 mx-2"></div>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentTool('sell')} className={`flex flex-col items-center justify-center w-24 h-20 border-2 transition-all ${currentTool === 'sell' ? 'border-red-500 bg-red-500/10 scale-105' : 'border-white/10 hover:border-red-500/50'}`}>
              <span className="text-[8px] font-black text-gray-500 uppercase mb-1 tracking-widest">Scrap</span>
              <span className="text-white text-xs font-bold uppercase italic">60% Cash</span>
            </button>
            <button onClick={repairCore} disabled={gameState.credits < 500 || gameState.hp >= gameState.maxHp} className="flex flex-col items-center justify-center w-32 h-20 border-2 border-[#00f2ff]/30 bg-[#00f2ff]/5 hover:bg-[#00f2ff]/20 hover:border-[#00f2ff] transition-all group disabled:opacity-20">
              <span className="text-[8px] font-black text-[#00f2ff] uppercase mb-1 tracking-widest">Fortify</span>
              <span className="text-white text-lg font-black tracking-tighter">$500</span>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;