// Hooray for Henrietta - Modern JavaScript Game
class HenriettaGame {
  constructor() {
    this.currentScreen = 'title-screen';
    this.ageLevel = '5-8';
    this.currentStep = 0;
    this.completedSteps = [];
    this.score = 0;
    this.lives = 3;
    this.timePerQuestion = 60;
    this.timerInterval = null;
    this.currentTime = 60;
    this.soundEnabled = true;
    this.currentProblem = null;
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.loadSettings();
    this.updateLevelDisplay();
  }
  
  bindEvents() {
    // Title screen
    document.querySelectorAll('.level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.ageLevel = btn.dataset.level;
        this.showScreen('level-screen');
        this.updateLevelDisplay();
      });
    });
    
    document.getElementById('btn-settings-title').addEventListener('click', () => {
      this.openSettings();
    });
    
    // Level screen
    document.getElementById('btn-back-title').addEventListener('click', () => {
      this.showScreen('title-screen');
    });
    
    document.querySelectorAll('.adventure-step.unlocked').forEach(step => {
      // Will be updated dynamically
    });
    
    // Game screen
    document.getElementById('btn-back-levels').addEventListener('click', () => {
      this.stopTimer();
      this.showScreen('level-screen');
      this.updateLevelMap();
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
    
    document.getElementById('setting-timer').addEventListener('change', (e) => {
      this.timePerQuestion = parseInt(e.target.value);
      localStorage.setItem('henrietta_timer', e.target.value);
    });
    
    document.getElementById('setting-sound').addEventListener('change', (e) => {
      this.soundEnabled = e.target.value === 'on';
      localStorage.setItem('henrietta_sound', e.target.value);
    });
  }
  
  loadSettings() {
    const timer = localStorage.getItem('henrietta_timer');
    if (timer) {
      this.timePerQuestion = parseInt(timer);
      document.getElementById('setting-timer').value = timer;
    }
    
    const sound = localStorage.getItem('henrietta_sound');
    if (sound) {
      this.soundEnabled = sound === 'on';
      document.getElementById('setting-sound').value = sound;
    }
  }
  
  updateLevelDisplay() {
    document.getElementById('current-age-level').textContent = 
      this.ageLevel === '5-8' ? 'Ages 5-8' : 'Ages 9-12';
    this.updateLevelMap();
  }
  
  updateLevelMap() {
    const steps = document.querySelectorAll('.adventure-step');
    steps.forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.remove('unlocked', 'completed');
      
      if (this.completedSteps.includes(stepNum)) {
        step.classList.add('completed');
        step.querySelector('.step-status').textContent = '✅';
        step.onclick = () => this.playStep(stepNum);
      } else if (stepNum === this.completedSteps.length + 1) {
        step.classList.add('unlocked');
        step.querySelector('.step-status').textContent = '▶️';
        step.onclick = () => this.playStep(stepNum);
      } else {
        step.querySelector('.step-status').textContent = '🔒';
        step.onclick = null;
      }
    });
    
    document.getElementById('items-recovered').textContent = this.completedSteps.length;
  }
  
  playStep(stepNum) {
    this.currentStep = stepNum;
    this.showScreen('game-screen');
    this.setupGameForStep(stepNum);
    this.generateProblem();
    this.startTimer();
    this.updateGameUI();
  }
  
  setupGameForStep(stepNum) {
    const step = document.querySelector(`.adventure-step[data-step="${stepNum}"]`);
    const operation = step.dataset.operation;
    this.currentOperation = operation;
    
    // Update scene text based on step
    const sceneTexts = {
      1: "Henrietta is chasing John the Parrot to get Henry's clothes back!",
      2: "Rowing across the river to catch up with the mischievous bird!",
      3: "Jumping over hurdles in hot pursuit of John the Parrot!",
      4: "The final rescue! Solve these to free Henry from the custard!"
    };
    
    document.getElementById('scene-text').textContent = sceneTexts[stepNum];
    
    // Update scene characters
    document.getElementById('scene-henrietta').style.opacity = '1';
    document.getElementById('scene-parrot').style.opacity = '1';
    document.getElementById('scene-henry').style.opacity = stepNum === 4 ? '1' : '0.3';
    document.getElementById('custard-tank').style.display = stepNum === 4 ? 'block' : 'none';
  }
  
  generateProblem() {
    let num1, num2, answer, problemText;
    
    if (this.ageLevel === '5-8') {
      // Addition and subtraction only
      if (this.currentOperation === 'add' || Math.random() < 0.6) {
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
        problemText = `${num1} + ${num2} = ?`;
      } else {
        num1 = Math.floor(Math.random() * 30) + 10;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        problemText = `${num1} - ${num2} = ?`;
      }
    } else {
      // Ages 9-12 - all operations
      const ops = ['add', 'sub', 'mul', 'div'];
      const op = this.currentOperation === 'div' ? 'div' : ops[Math.floor(Math.random() * 4)];
      
      if (op === 'add') {
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        problemText = `${num1} + ${num2} = ?`;
      } else if (op === 'sub') {
        num1 = Math.floor(Math.random() * 100) + 50;
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
    
    this.currentProblem = { num1, num2, answer, problemText, operation: this.currentOperation };
    document.getElementById('problem').textContent = problemText;
    this.generateAnswers(answer);
  }
  
  generateAnswers(correctAnswer) {
    const answers = new Set([correctAnswer]);
    
    // Generate 3 wrong answers
    while (answers.size < 4) {
      let wrong;
      const offset = Math.floor(Math.random() * 10) + 1;
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
      btn.className = 'answer-btn';
      btn.textContent = ans;
      btn.onclick = () => this.checkAnswer(ans);
      grid.appendChild(btn);
    });
  }
  
  checkAnswer(selectedAnswer) {
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    if (selectedAnswer === this.currentProblem.answer) {
      // Correct answer
      event.target.classList.add('correct');
      document.getElementById('feedback').textContent = 'Great job! ⭐';
      document.getElementById('feedback').style.color = '#4CAF50';
      this.score += 10;
      
      if (this.soundEnabled) {
        this.playSound('correct');
      }
      
      setTimeout(() => {
        this.completeQuestion();
      }, 1000);
    } else {
      // Wrong answer
      event.target.classList.add('wrong');
      document.getElementById('feedback').textContent = 'Try again! 💪';
      document.getElementById('feedback').style.color = '#f44336';
      this.lives--;
      
      if (this.soundEnabled) {
        this.playSound('wrong');
      }
      
      setTimeout(() => {
        document.getElementById('feedback').textContent = '';
        buttons.forEach(btn => {
          btn.disabled = false;
          btn.classList.remove('wrong');
        });
        this.generateProblem();
        this.resetTimer();
      }, 1500);
      
      if (this.lives <= 0) {
        setTimeout(() => {
          alert('Game Over! Try again!');
          this.stopTimer();
          this.showScreen('level-screen');
          this.updateLevelMap();
        }, 2000);
      }
    }
    
    this.updateGameUI();
  }
  
  completeQuestion() {
    document.getElementById('feedback').textContent = '';
    
    // Complete the step after 5 correct answers
    if (!this.stepProgress) this.stepProgress = 0;
    this.stepProgress++;
    
    if (this.stepProgress >= 5) {
      // Step completed
      if (!this.completedSteps.includes(this.currentStep)) {
        this.completedSteps.push(this.currentStep);
      }
      this.stepProgress = 0;
      this.stopTimer();
      alert(`Great! You completed this challenge and recovered an item!`);
      this.showScreen('level-screen');
      this.updateLevelMap();
      
      // Check if all steps completed
      if (this.completedSteps.length >= 4) {
        setTimeout(() => {
          this.showVictory();
        }, 500);
      }
    } else {
      this.generateProblem();
      this.resetTimer();
    }
  }
  
  startTimer() {
    this.currentTime = this.timePerQuestion;
    document.getElementById('timer').textContent = this.currentTime;
    
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    this.timerInterval = setInterval(() => {
      this.currentTime--;
      document.getElementById('timer').textContent = this.currentTime;
      
      if (this.currentTime <= 10) {
        document.getElementById('timer').style.color = '#f44336';
      }
      
      if (this.currentTime <= 0) {
        this.timeUp();
      }
    }, 1000);
  }
  
  resetTimer() {
    this.currentTime = this.timePerQuestion;
    document.getElementById('timer').textContent = this.currentTime;
    document.getElementById('timer').style.color = '#2d5f3b';
  }
  
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
  
  timeUp() {
    this.stopTimer();
    alert("Time's up! The parrot is getting closer!");
    this.lives--;
    this.updateGameUI();
    
    if (this.lives <= 0) {
      alert('Game Over! Try again!');
      this.showScreen('level-screen');
      this.updateLevelMap();
    } else {
      this.generateProblem();
      this.startTimer();
    }
  }
  
  updateGameUI() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('lives').textContent = this.lives;
  }
  
  showVictory() {
    document.getElementById('final-score').textContent = this.score;
    document.getElementById('final-items').textContent = this.completedSteps.length;
    this.showScreen('victory-screen');
  }
  
  resetGame() {
    this.completedSteps = [];
    this.score = 0;
    this.lives = 3;
    this.stepProgress = 0;
    this.updateLevelMap();
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
    // Simple Web Audio API sound effects
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'correct') {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(1046.5, audioContext.currentTime + 0.3); // C6
      } else if (type === 'wrong') {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
      }
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      // Audio not supported
    }
  }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.henriettaGame = new HenriettaGame();
});
