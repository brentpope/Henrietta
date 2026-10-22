# Hooray for Henrietta! - Math Adventure

A modern web version of the classic educational math game "Hooray for Henrietta" (1990) by Scetlander.

## About the Original

'Hooray for Henrietta' was an educational game where Henrietta needed to rescue her boyfriend Hopeless Henry, who had been kidnapped by the mischievous parrot John. To save him, players had to solve math problems (addition, subtraction, multiplication, division) across different activities, racing against time or Henry would be covered in cold custard!

## Our Modern Version

This web-based remake brings the classic adventure to modern devices with:

- **Two Age Levels**: Ages 5-8 (Addition & Subtraction) and Ages 9-12 (All Operations)
- **Four Adventure Stages**: The Chase, Row Across, The Hurdles, and the Final Rescue Mission
- **Interactive Story**: Follow Henrietta's adventure with animated characters
- **Timer-Based Challenge**: Race against time to solve math problems
- **Lives System**: Three chances to get it right
- **Progress Tracking**: Unlock stages as you complete them
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Sound Effects**: Audio feedback for correct and wrong answers
- **PWA Ready**: Can be installed as a web app

## How to Play

1. **Start**: Choose your age level (5-8 or 9-12)
2. **Adventure Map**: Complete stages in order to rescue Henry
3. **Solve Problems**: Answer math questions before time runs out
4. **Collect Items**: Each completed stage recovers one of Henry's stolen items
5. **Rescue Henry**: Complete all 4 stages to save the wedding!

## Running the Game

### Option 1: Simple HTTP Server
```bash
cd ~/Projects/henrietta
python3 server.py
```
Then open http://localhost:8080 in your browser

### Option 2: Direct File Access
Just open `index.html` directly in your web browser

## Game Mechanics

- **Ages 5-8**: Focus on addition and subtraction with numbers 1-50
- **Ages 9-12**: All four operations (addition, subtraction, multiplication, division)
- **Scoring**: 10 points per correct answer
- **Lives**: Start with 3 lives, lose one for wrong answers or timeouts
- **Time**: Configurable per question (30-90 seconds)
- **Progression**: Must get 5 correct answers per stage to complete it

## Technologies Used

- Pure HTML5, CSS3, and JavaScript (no frameworks)
- CSS animations and transitions
- Web Audio API for sound effects
- Responsive design with CSS Grid and Flexbox
- Local storage for settings

## Original Credits

Original game by T.R. Tulloch, published by Scetlander Ltd. in 1990 for DOS, Amiga, Atari ST, and ZX Spectrum.

This is a fan-made modern tribute to this classic educational game.
