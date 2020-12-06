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
        this.currentPlayer.consecutiveMoves++;
        const newScore = this.currentPlayer.score + score;

        if (newScore >= 15) {
            this.winner = this.currentPlayer;
            this.currentPlayer.score = newScore;
            this.view.updateState();
        } else {
            if (this.currentPlayer.consecutiveMoves === 3) {
                this.currentPlayer.score = newScore;
                this.currentPlayer.consecutiveMoves = 0;
                this.currentPlayer = this.getNonCurrentPlayer();
                this.view.resetDieHold();
            }

            this.view.updateState();

            if (this.currentPlayer === this.aiPlayer) {
                this.decideOnAiMove();
            }
        }
    }

    calculateScore(firstDie, secondDie, thirdDie) {
        const point = this.pointNumber;

        let score = 0;

        // three of a kind
        if (firstDie == secondDie && secondDie == thirdDie) {
            score = firstDie == point ? 15 : 5;
        } else {
            if (firstDie == point) {
                score++;
            }
            if (secondDie == point) {
                score++;
            }
            if (thirdDie == point) {
                score++;
            }
        }

        return score;
    }

    getNonCurrentPlayer() {
        return this.currentPlayer === this.humanPlayer ? this.aiPlayer : this.humanPlayer;
    }

    decideOnAiMove() {
        if (this.aiPlayer.consecutiveMoves === 0) {
            this.view.rollAllDice();
            return;
        }

        let bestMove = [false, false, false];
        let bestValue = this.calculateScore(...this.view.getDiceValues());

        for (const move of this.getPossibleMoves()) {
            const value = this.evaluatePossibleMove(move);
            if (value > bestValue) {
                bestMove = move;
                bestValue = value;
            }
        }

        this.view.rollDice(bestMove);
    }

    evaluatePossibleMove(move) {
        let value = 0;

        let tempCombo = this.view.getDiceValues();

        for (let i = 1; i <= 6; i++) { // changing value of first die
            if (move[0]) tempCombo[0] = i;
            for (let j = 1; j <= 6; j++) { // changing value of first die
                if (move[1]) tempCombo[1] = j;
                for (let k = 1; k <= 6; k++) { // changing value of first die
                    if (move[2]) tempCombo[2] = k;
                    value += (1.0 / 216.0) * this.calculateScore(...tempCombo);
                }
            }
        }

        return value;
    }

    getPossibleMoves() {
        const result = [];
        for (let i = 0; i < 1 << 3; i++) {
            result.push([!!(i & (1<<2)), !!(i & (1<<1)), !!(i & 1)]);
        }
        return result;
    }

}

