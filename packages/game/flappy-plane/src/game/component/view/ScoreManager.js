import { EventEmitter } from 'pixi.js';
import { SoundPlayer } from '../../core/SoundPlayer';
export class ScoreManager extends EventEmitter {
    constructor() {
        super();
        Object.defineProperty(this, "score", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "highScore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "SCORE_KEY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'flappyBird_score'
        });
        Object.defineProperty(this, "HIGH_SCORE_KEY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'flappyBird_highScore'
        });
        Object.defineProperty(this, "soundPlayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.loadScoresFromStorage();
        this.soundPlayer = SoundPlayer.getInstance();
    }
    static getInstance() {
        if (!ScoreManager.instance) {
            ScoreManager.instance = new ScoreManager();
        }
        return ScoreManager.instance;
    }
    loadScoresFromStorage() {
        try {
            const savedHighScore = localStorage.getItem(this.HIGH_SCORE_KEY);
            if (savedHighScore) {
                this.highScore = parseInt(savedHighScore, 10);
            }
        }
        catch (error) {
            console.error('로컬 스토리지에서 점수를 불러오는 중 오류가 발생했습니다:', error);
        }
    }
    saveScoresToStorage() {
        try {
            localStorage.setItem(this.SCORE_KEY, this.score.toString());
            localStorage.setItem(this.HIGH_SCORE_KEY, this.highScore.toString());
        }
        catch (error) {
            console.error('로컬 스토리지에 점수를 저장하는 중 오류가 발생했습니다:', error);
        }
    }
    // 현재 점수를 가져옵니다
    getScore() {
        return this.score;
    }
    getHighScore() {
        return this.highScore;
    }
    setScore(score) {
        this.score = score;
        this.updateHighScore();
        this.saveScoresToStorage();
        this.emit('scoreChanged', this.score);
        this.emit('highScoreChanged', this.highScore);
    }
    // 점수를 1점 증가
    incrementScore() {
        this.score += 1;
        if (this.score % 5 === 0) {
            this.soundPlayer.play('levelup');
        }
        this.updateHighScore();
        this.saveScoresToStorage();
        this.emit('scoreChanged', this.score);
        this.emit('highScoreChanged', this.highScore);
    }
    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }
    resetScore() {
        this.score = 0;
        this.saveScoresToStorage();
        this.emit('scoreChanged', this.score);
    }
}
