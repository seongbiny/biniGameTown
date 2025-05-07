export class SoundPlayer {
  private static instance: SoundPlayer;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): SoundPlayer {
    if (!SoundPlayer.instance) {
      SoundPlayer.instance = new SoundPlayer();
    }
    return SoundPlayer.instance;
  }

  private init(): void {
    const levelupSound = new Audio('./assets/sounds/levelup.wav');
    const gameoverSound = new Audio('./assets/sounds/gameover.wav');
    const passSound = new Audio('./assets/sounds/pass.wav');

    this.sounds.set('levelup', levelupSound);
    this.sounds.set('gameover', gameoverSound);
    this.sounds.set('pass', passSound);

    this.preloadAudio();
  }

  private preloadAudio(): void {
    this.sounds.forEach((sound) => {
      sound.load();
    });
  }

  public play(soundName: string): void {
    if (this.isMuted) return;

    const sound = this.sounds.get(soundName);
    if (!sound) return;

    const newSound = new Audio(sound.src);
    newSound.volume = sound.volume;
    newSound
      .play()
      .catch((error) => console.error(`사운드 재생 오류: ${soundName}`, error));
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }
}
