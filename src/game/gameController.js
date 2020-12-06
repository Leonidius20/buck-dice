import GameView from "./gameView";

export default class GameController {

    constructor() {
        this.view = new GameView(this);
        this.humanPlayer = {score: 0, name: 'Human', consecutiveMoves: 0, pass: false};
        this.aiPlayer = {score: 0, name: 'AI', consecutiveMoves: 0, pass: false};
    }

    startGame() {
        this.view.renderForHumanDraw();
    }

    setPlayerInitialNumber(number) {
        this.initialPlayerNumber = number;
        this.view.renderForAiDraw();
    }

    setAiInitialNumber(number) {
        this.view.prepareForGame();

        if (number > this.initialPlayerNumber) {
            // ai starts
            this.currentPlayer = this.aiPlayer;
            this.pointNumber = this.initialPlayerNumber;
            this.view.updateState();
            this.decideOnAiMove();
        } else {
            this.currentPlayer = this.humanPlayer;
            this.pointNumber = number;
            this.view.updateState();
        }

        console.log(this.pointNumber);
    }

    makeMove(die1, die2, die3) {
        const score = this.calculateScore(die1, die2, die3);
        console.log(score);
        this.currentPlayer.score += score;
        this.currentPlayer.consecutiveMoves++;
        const newScore = this.currentPlayer.score;

        if (newScore >= 15) {
            this.winner = this.currentPlayer;
            this.view.updateState();
        } else {
            if (this.currentPlayer.consecutiveMoves === 3 || this.currentPlayer.pass === true) {
                this.currentPlayer = this.getNonCurrentPlayer();
                this.currentPlayer.consecutiveMoves = 0;
            }

            this.view.updateState();
            if (this.currentPlayer === this.aiPlayer) {
                this.decideOnAiMove();
            }
        }
    }

    // returns score and whether the player should continue throwing
    calculateScore(firstDie, secondDie, thirdDie) {
        const point = this.pointNumber;

        let score = 0;

        // three of a kind
        if (firstDie == secondDie && secondDie == thirdDie) {
            score = firstDie == point ? 15 : 5;
        } else {
            if (firstDie == point) {
                console.log('match');
                score++;
            }
            if (secondDie == point) {
                console.log('match');
                score++;
            }
            if (thirdDie == point) {
                console.log('match');
                score++;
            }
        }

        return score;
    }

    getNonCurrentPlayer() {
        return this.currentPlayer === this.humanPlayer ? this.aiPlayer : this.humanPlayer;
    }

    decideOnAiMove() {
        this.view.rollAllDice();

    }

}

