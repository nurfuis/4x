import "./index.css";
import { BACKGROUND_COLOR, HEIGHT, WIDTH } from "./app/constants";

import { Vector2 } from "./app/utils/Vector2";
import { GameObject } from "./app/objects/GameObject";
import { GameLoop } from "./app/utils/gameLoop";

import { Player } from "./app/objects/Player";

import { Input } from "./app/utils/Input";
import { AutomatedInput } from "./app/utils/AutomatedInput";
import { Kill } from "./app/objects/layers/kill";
import { World } from "./app/objects/layers/World";


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
  const TIMER = 60;

  const input = new Input();
  const automatedInput = new AutomatedInput();

  const startScreen = document.getElementById("start-screen");
  const endTurnScreen = document.getElementById("end-turn");
  const highScoreValue = document.getElementById("high-score-value");
  const highScoreText = document.getElementById("high-score");
  endTurnScreen.style.display = "none";

  let gameStarted = false;
  let remainingTime = TIMER;
  let timerInterval;

  let kill;
  let world;
  let player;

  function endTurn() {
    const score = player.ability.damageDealt;
    const highScore = JSON.parse(localStorage.getItem("high-score")).score;
    gameLoop.stop();
    gameLoop.isPaused = true;
    gameStarted = false;

    if (score > highScore) {
      localStorage.setItem("high-score", JSON.stringify({ score }));
      highScoreText.innerHTML = "";
      highScoreValue.innerHTML = score;
    } else if (score < highScore) {
      highScoreValue.innerHTML = highScore;
      highScoreText.innerHTML = "";
    }
    endTurnScreen.style.display = "";
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      remainingTime--;
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        endTurn();
      }
    }, 1000); // Update every second
  }

  function advance() {
    remainingTime = TIMER;
    startTimer();
    gameLoop.start();
    gameStarted = true;
  }

  function init() {
    if (!gameStarted) {
      main = new GameObject({ position: new Vector2(0, 0) });

        // Comment out input to enable automated player
      // main.input = input;
      main.automatedInput = automatedInput;

      kill = new Kill();
      main.layers = [kill];
      main.addChild(kill);

      world = new World();
      main.layers.push(world);
      main.addChild(world);

      player = new Player();
      player.position.x = WIDTH / 2;
      player.position.y = HEIGHT / 2;
      main.addChild(player);

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
  endTurnScreen.addEventListener("click", () => {
    endTurnScreen.style.display = "none";
    advance();
  });
}
startGame();
