import './index.css';
import { BACKGROUND_COLOR, HEIGHT, WIDTH } from "./app/constants";
import { Vector2 } from "./app/utils/Vector2";

import { GameObject } from "./app/objects/gameObject";
import { GameLoop } from "./app/utils/gameLoop";
import { Player } from "./app/objects/Player";
import { Input } from "./app/utils/Input";
import { AutomatedInput } from "./app/utils/AutomatedInput";
import { Creature } from "./app/objects/Creature";
import { Spawner } from "./app/Spawner";

const display = document.querySelector("#display");
display.width = WIDTH;
display.height = HEIGHT;
display.style.backgroundColor = BACKGROUND_COLOR;
const ctx = display.getContext("2d");

let main;
let input;
let automatedInput;

const update = (delta) => {
  main.stepEntry(delta, main);
};

const draw = () => {
  ctx.clearRect(0, 0, display.width, display.height);
  main.draw(ctx, 0, 0);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.name = "mainLoop";

let player;
let creature;
let spawner;

const TIMER = 100000;

const startScreen = document.getElementById("start-screen");
let gameStarted = false; // Flag to track game state

let remainingTime = TIMER; // Set a timer duration (in seconds)
let timerInterval; // Store the timer interval reference

function gameOver() {
  // Display final score or any other end-game logic
  gameLoop.stop();
  gameStarted = false;

  player = undefined;
  creature = undefined;
  spawner = undefined;

  startScreen.style.display = ""; // Hide start screen

  // You can add here actions like displaying a game over screen or restarting the game
}

function startTimer() {
  timerInterval = setInterval(() => {
    remainingTime--;
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      gameOver(); // Call the end event function
    }
  }, 1000); // Update every second
}

startScreen.addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    startScreen.style.display = "none";

    main = new GameObject({ position: new Vector2(0, 0) });
    input = new Input();
    automatedInput = new AutomatedInput();

    player = new Player();
    player.position.x =  WIDTH / 2;
    player.position.y = HEIGHT / 2;

    creature = new Creature();
    spawner = new Spawner(Creature);

    main.addChild(player);
    main.addChild(creature);
    main.spawner = spawner;
    // main.input = input;
    main.automatedInput = automatedInput;

    gameLoop.start();

    remainingTime = TIMER;
    startTimer(); // Start the timer
  }
});
