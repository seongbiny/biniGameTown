export class SoundPlayer {
    constructor() {
        Object.defineProperty(this, "sounds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "isMuted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.init();
    }
    static getInstance() {
        if (!SoundPlayer.instance) {
            SoundPlayer.instance = new SoundPlayer();
        }
        return SoundPlayer.instance;
    }
    init() {
        const levelupSound = new Audio('./assets/sounds/levelup.wav');
        const gameoverSound = new Audio('./assets/sounds/gameover.wav');
        const passSound = new Audio('./assets/sounds/pass.wav');
        this.sounds.set('levelup', levelupSound);
        this.sounds.set('gameover', gameoverSound);
        this.sounds.set('pass', passSound);
        this.preloadAudio();
    }
    preloadAudio() {
        this.sounds.forEach((sound) => {
            sound.load();
        });
    }
    play(soundName) {
        if (this.isMuted)
            return;
        const sound = this.sounds.get(soundName);
        if (!sound)
            return;
        const newSound = new Audio(sound.src);
        newSound.volume = sound.volume;
        newSound
            .play()
            .catch((error) => console.error(`사운드 재생 오류: ${soundName}`, error));
    }
    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
    isSoundMuted() {
        return this.isMuted;
    }
}
