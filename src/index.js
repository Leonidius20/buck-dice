import Die from './die/die';
import GameController from "./game/gameController";

onload = () => {
    console.log("hello world!");

    customElements.define('die-block', Die);

    new GameController().startGame();
}