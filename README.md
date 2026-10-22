# Goofy Henrietta's Railroad

A modern blend of the classic "Goofy's Railway Express" (1990) and math education games! All aboard for a math adventure on the rails.

## About

Inspired by the beloved Disney educational game "Goofy's Railway Express" where children learned color and shape matching with Goofy and Mickey's train, this game combines that wonderful train theme with math problem solving just like the classic "Hooray for Henrietta".

## Features

- **Train Theme**: Chug along with Engineer Goofy's train through scenic countryside
- **"GET READY!"**: Classic countdown just like the original games
- **Math on the Rails**: Solve addition, subtraction, multiplication, and division problems
- **Multiple Choice**: Four answer choices like classic edutainment games
- **Speed Control**: Adjustable train speed slider (1-10) to make it easier or more challenging
- **Two Routes**: Short Route (Ages 5-8, + and -) and Express Route (Ages 9-12, all operations)
- **Time Pressure**: Answer before time runs out with a visual time bar
- **Scenic Animation**: Rolling hills, clouds, trees, and a moving train
- **Sound Effects**: Train whistles, correct/wrong answers, and victory chimes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **PWA Ready**: Can be installed as a web app

## How to Play

1. **Board the Train**: Choose your route (Short or Express)
2. **Get Ready**: Watch the countdown and hear the train whistle
3. **Solve Problems**: Math questions appear as your train travels
4. **Pick the Right Answer**: Click the correct answer from four choices
5. **Beat the Clock**: Answer before time runs out or the train passes!
6. **Complete the Route**: Get 10 correct answers to complete your journey
7. **Chug to Victory**: Celebrate with Choo-Choo!

## Train Controls (Settings)

- **Train Speed**: Adjust from Slow (🐢) to Fast (🚄) - affects how quickly time runs out
- **Train Whistle & Sounds**: Toggle sound effects on/off

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

- **Short Route (Ages 5-8)**: Addition and subtraction, numbers 1-40
- **Express Route (Ages 9-12)**: All four operations, larger numbers
- **Scoring**: 10 points per correct answer
- **Goal**: Get 10 correct answers to complete the route
- **Timer**: Visual time bar that speeds up with faster train speeds
- **Feedback**: Immediate feedback with train-themed messages

## Technologies Used

- Pure HTML5, CSS3, and JavaScript (no frameworks)
- CSS animations for train movement, clouds, and smoke
- Web Audio API for train sounds and effects
- Responsive design with CSS Grid and Flexbox
- Local storage for settings

## Credits

Inspired by:
- **Goofy's Railway Express** (1990) by Westwood Associates, published by Disney Software
- **Hooray for Henrietta** (1990) by T.R. Tulloch, published by Scetlander Ltd.

This is a fan-made tribute combining the best elements of both classic educational games.
