import "./index.css";
import { BACKGROUND_COLOR, HEIGHT, WIDTH } from "./app/constants";

import { Vector2 } from "./app/utils/Vector2";
import { GameObject } from "./app/objects/gameObject";
import { GameLoop } from "./app/utils/gameLoop";

import { Player } from "./app/objects/Player";

import { Creature } from "./app/objects/Creature";
import { Spawner } from "./app/Spawner";

import { Input } from "./app/utils/Input";
import { AutomatedInput } from "./app/utils/AutomatedInput";

const display = document.querySelector("#display");
display.width = WIDTH;
display.height = HEIGHT;
display.style.backgroundColor = BACKGROUND_COLOR;
const ctx = display.getContext("2d");

let main;

const update = (delta) => {
  main.stepEntry(delta, main);
};

const draw = () => {
  ctx.clearRect(0, 0, display.width, display.height);
  main.draw(ctx, 0, 0);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.name = "mainLoop";

function startGame() {

  const TIMER = 12;

  const startScreen = document.getElementById("start-screen");
  const gameOverScreen = document.getElementById("game-over");
  const highScoreValue = document.getElementById("high-score-value");
  const highScoreText = document.getElementById("high-score");

  gameOverScreen.style.display = "none";

  let gameStarted = false;
  let remainingTime = TIMER;
  let timerInterval;

  let player;
  let creature;
  let spawner;

  function gameOver() {
    // localStorage.setItem("high-score", JSON.stringify({ score: 0 }));

    const score = player.ability.damageDealt;

    const highScore = JSON.parse(localStorage.getItem("high-score")).score;
    
    gameLoop.stop();
    gameStarted = false;
    
    if (score > highScore) {
      // new hi score
      localStorage.setItem("high-score", JSON.stringify({ score }));
      highScoreText.innerHTML = "NEW HIGH SCORE!";

      highScoreValue.innerHTML = score;
    
    } else if (score < highScore) {
      highScoreValue.innerHTML = highScore;
      highScoreText.innerHTML = "Current High Score";

    }

    player = undefined;
    creature = undefined;
    spawner = undefined;

    gameOverScreen.style.display = "";

    // You can add here actions like displaying a game over screen or restarting the game
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      remainingTime--;
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        gameOver();
      }
    }, 1000); // Update every second
  }

  function init() {
    if (!gameStarted) {
      const input = new Input();
      const automatedInput = new AutomatedInput();

      main = new GameObject({ position: new Vector2(0, 0) });

      player = new Player();
      player.position.x = WIDTH / 2;
      player.position.y = HEIGHT / 2;

      creature = new Creature();
      spawner = new Spawner(Creature);

      main.addChild(player);
      main.addChild(creature);
      main.spawner = spawner;

      // main.input = input;
      main.automatedInput = automatedInput;

      remainingTime = TIMER;
      startTimer();

      gameLoop.start();

      startScreen.style.display = "none";
      gameStarted = true;
    }
  }
  startScreen.addEventListener("click", () => {
    init();
  });
  gameOverScreen.addEventListener("click", () => {
    gameOverScreen.style.display = "none";

    init();
  });
}
startGame();
