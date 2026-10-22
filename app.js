// Goofy Henrietta's Railroad - Modern JavaScript Game
class HenriettaRailroad {
  constructor() {
    this.currentScreen = 'title-screen';
    this.ageLevel = '5-8';
    this.score = 0;
    this.correctAnswers = 0;
    this.totalQuestions = 10;
    this.trainSpeed = 5;
    this.soundEnabled = true;
    this.currentProblem = null;
    this.trainPosition = -200;
    this.timeLeft = 100; // percentage
    this.timeInterval = null;
    this.questionTimer = null;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.loadSettings();
    this.setupSpeedSlider();
  }
  
  bindEvents() {
    // Title screen
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.ageLevel = btn.dataset.level;
        this.startGame();
      });
    });
    
    document.getElementById('btn-settings-title').addEventListener('click', () => {
      this.openSettings();
    });
    
    // Game screen
    document.getElementById('btn-back-title').addEventListener('click', () => {
      this.stopTimers();
      this.showScreen('title-screen');
      this.resetGame();
    });
    
    // Victory screen
    document.getElementById('btn-play-again').addEventListener('click', () => {
      this.resetGame();
      this.showScreen('title-screen');
    });
    
    // Settings modal
    document.querySelector('.modal-close').addEventListener('click', () => {
      this.closeSettings();
    });
    
    document.querySelector('.modal-backdrop').addEventListener('click', () => {
      this.closeSettings();
    });
    
    document.getElementById('setting-sound').addEventListener('change', (e) => {
      this.soundEnabled = e.target.value === 'on';
      localStorage.setItem('henrietta_railroad_sound', e.target.value);
    });
  }
  
  setupSpeedSlider() {
    const slider = document.getElementById('setting-speed');
    const display = document.getElementById('speed-display');
    
    slider.addEventListener('input', (e) => {
      this.trainSpeed = parseInt(e.target.value);
      display.textContent = this.trainSpeed;
      localStorage.setItem('henrietta_railroad_speed', e.target.value);
    });
  }
  
  loadSettings() {
    const speed = localStorage.getItem('henrietta_railroad_speed');
    if (speed) {
      this.trainSpeed = parseInt(speed);
      document.getElementById('setting-speed').value = speed;
      document.getElementById('speed-display').textContent = speed;
    }
    
    const sound = localStorage.getItem('henrietta_railroad_sound');
    if (sound) {
      this.soundEnabled = sound === 'on';
      document.getElementById('setting-sound').value = sound;
    }
  }
  
  startGame() {
    this.resetGame();
    this.showScreen('getready-screen');
    this.playGetReady();
  }
  
  playGetReady() {
    let count = 3;
    const countdownEl = document.getElementById('countdown');
    countdownEl.textContent = count;
    
    if (this.soundEnabled) {
      this.playSound('whistle');
    }
    
    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownEl.textContent = count;
        if (this.soundEnabled && count === 1) {
          this.playSound('whistle');
        }
      } else {
        clearInterval(countdownInterval);
        countdownEl.textContent = 'GO!';
        setTimeout(() => {
          this.showScreen('game-screen');
          this.updateGameUI();
          this.generateProblem();
          this.startTrain();
          this.startQuestionTimer();
        }, 1000);
      }
    }, 1000);
  }
  
  startTrain() {
    const trainContainer = document.getElementById('train-container');
    this.trainPosition = -200;
    trainContainer.style.left = this.trainPosition + 'px';
    
    // Animate train movement
    const moveTrain = () => {
      if (this.currentScreen !== 'game-screen') return;
      
      const speedFactor = this.trainSpeed / 5;
      this.trainPosition += speedFactor * 2;
      trainContainer.style.left = this.trainPosition + 'px';
      
      // If train passes station
      if (this.trainPosition > 400) {
        this.trainPosition = -200;
        trainContainer.style.left = this.trainPosition + 'px';
      }
      
      setTimeout(moveTrain, 50);
    };
    moveTrain();
  }
  
  generateProblem() {
    let num1, num2, answer, problemText;
    
    if (this.ageLevel === '5-8') {
      // Addition and subtraction only
      if (Math.random() < 0.6) {
        num1 = Math.floor(Math.random() * 15) + 1;
        num2 = Math.floor(Math.random() * 15) + 1;
        answer = num1 + num2;
        problemText = `${num1} + ${num2} = ?`;
      } else {
        num1 = Math.floor(Math.random() * 25) + 10;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        problemText = `${num1} - ${num2} = ?`;
      }
    } else {
      // Ages 9-12 - all operations
      const ops = ['add', 'sub', 'mul', 'div'];
      const op = ops[Math.floor(Math.random() * 4)];
      
      if (op === 'add') {
        num1 = Math.floor(Math.random() * 40) + 1;
        num2 = Math.floor(Math.random() * 40) + 1;
        answer = num1 + num2;
        problemText = `${num1} + ${num2} = ?`;
      } else if (op === 'sub') {
        num1 = Math.floor(Math.random() * 80) + 20;
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        problemText = `${num1} - ${num2} = ?`;
      } else if (op === 'mul') {
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        problemText = `${num1} × ${num2} = ?`;
      } else if (op === 'div') {
        answer = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        num1 = answer * num2;
        problemText = `${num1} ÷ ${num2} = ?`;
      }
    }
    
    this.currentProblem = { num1, num2, answer, problemText };
    document.getElementById('problem').textContent = problemText;
    this.generateAnswers(answer);
    this.resetQuestionTimer();
  }
  
  generateAnswers(correctAnswer) {
    const answers = new Set([correctAnswer]);
    
    while (answers.size < 4) {
      let wrong;
      const offset = Math.floor(Math.random() * 15) + 1;
      if (Math.random() < 0.5) {
        wrong = correctAnswer + offset;
      } else {
        wrong = Math.max(0, correctAnswer - offset);
      }
      answers.add(wrong);
    }
    
    const answerArray = Array.from(answers).sort(() => Math.random() - 0.5);
    
    const grid = document.getElementById('answer-grid');
    grid.innerHTML = '';
    
    answerArray.forEach(ans => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn-railroad';
      btn.textContent = ans;
      btn.onclick = (e) => this.checkAnswer(ans, e.target);
      grid.appendChild(btn);
    });
  }
  
  checkAnswer(selectedAnswer, btn) {
    const buttons = document.querySelectorAll('.answer-btn-railroad');
    buttons.forEach(b => b.disabled = true);
    
    this.stopQuestionTimer();
    
    if (selectedAnswer === this.currentProblem.answer) {
      btn.classList.add('correct');
      document.getElementById('feedback').textContent = 'Correct! Choo-Choo! 🚂';
      document.getElementById('feedback').style.color = '#4CAF50';
      this.score += 10;
      this.correctAnswers++;
      
      if (this.soundEnabled) {
        this.playSound('correct');
      }
      
      setTimeout(() => {
        this.nextQuestion();
      }, 1500);
    } else {
      btn.classList.add('wrong');
      document.getElementById('feedback').textContent = 'Try again! All aboard! 🚂';
      document.getElementById('feedback').style.color = '#f44336';
      
      if (this.soundEnabled) {
        this.playSound('wrong');
      }
      
      setTimeout(() => {
        document.getElementById('feedback').textContent = '';
        buttons.forEach(b => {
          b.disabled = false;
          b.classList.remove('wrong');
        });
        this.generateProblem();
        this.startQuestionTimer();
      }, 1500);
    }
    
    this.updateGameUI();
  }
  
  nextQuestion() {
    document.getElementById('feedback').textContent = '';
    
    if (this.correctAnswers >= this.totalQuestions) {
      // Game complete
      this.stopTimers();
      setTimeout(() => {
        this.showVictory();
      }, 500);
    } else {
      this.generateProblem();
      this.startQuestionTimer();
    }
  }
  
  startQuestionTimer() {
    this.timeLeft = 100;
    const timeBar = document.getElementById('time-bar-fill');
    timeBar.style.width = '100%';
    timeBar.style.background = 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)';
    
    if (this.questionTimer) clearInterval(this.questionTimer);
    
    const speedFactor = this.trainSpeed / 5;
    const intervalTime = 100 / (speedFactor * 2); // Adjust timer based on speed
    
    this.questionTimer = setInterval(() => {
      this.timeLeft -= 1;
      timeBar.style.width = this.timeLeft + '%';
      
      if (this.timeLeft <= 30) {
        timeBar.style.background = 'linear-gradient(90deg, #f44336 0%, #ff9800 100%)';
      } else if (this.timeLeft <= 50) {
        timeBar.style.background = 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)';
      }
      
      if (this.timeLeft <= 0) {
        this.timeUp();
      }
    }, intervalTime);
  }
  
  resetQuestionTimer() {
    if (this.questionTimer) {
      clearInterval(this.questionTimer);
    }
    this.startQuestionTimer();
  }
  
  stopQuestionTimer() {
    if (this.questionTimer) {
      clearInterval(this.questionTimer);
      this.questionTimer = null;
    }
  }
  
  timeUp() {
    this.stopQuestionTimer();
    document.getElementById('feedback').textContent = 'Too slow! Chugga-Chugga... 🚂';
    document.getElementById('feedback').style.color = '#f44336';
    
    if (this.soundEnabled) {
      this.playSound('wrong');
    }
    
    setTimeout(() => {
      document.getElementById('feedback').textContent = '';
      this.generateProblem();
      this.startQuestionTimer();
    }, 2000);
  }
  
  updateGameUI() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('correct').textContent = this.correctAnswers;
    document.getElementById('total').textContent = this.totalQuestions;
    
    const levelName = this.ageLevel === '5-8' ? 'Short Route' : 'Express Route';
    document.getElementById('level-name').textContent = levelName;
  }
  
  showVictory() {
    document.getElementById('final-correct').textContent = this.correctAnswers;
    document.getElementById('final-score').textContent = this.score;
    this.showScreen('victory-screen');
    
    if (this.soundEnabled) {
      this.playSound('victory');
    }
  }
  
  resetGame() {
    this.score = 0;
    this.correctAnswers = 0;
    this.trainPosition = -200;
    if (this.questionTimer) clearInterval(this.questionTimer);
  }
  
  stopTimers() {
    if (this.questionTimer) {
      clearInterval(this.questionTimer);
      this.questionTimer = null;
    }
  }
  
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    this.currentScreen = screenId;
  }
  
  openSettings() {
    document.getElementById('settings-modal').classList.add('active');
  }
  
  closeSettings() {
    document.getElementById('settings-modal').classList.remove('active');
  }
  
  playSound(type) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'whistle') {
        // Train whistle sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else if (type === 'correct') {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(784, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } else if (type === 'wrong') {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else if (type === 'victory') {
        // Victory chime
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
      }
    } catch (e) {
      // Audio not supported
    }
  }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.henriettaRailroad = new HenriettaRailroad();
});
