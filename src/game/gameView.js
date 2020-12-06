export default class GameView {

    constructor(controller) {
        this.controller = controller;
        this.diceContainer = document.getElementById('dice-container');
        this.textContainer = document.getElementById('text-container');
        this.rollButton = document.getElementById('roll-button');
    }

    renderForHumanDraw() {
        this.firstDie = document.createElement('die-block');
        // this.firstDie.onRoll = (value) => this.controller.setPlayerInitialNumber(value);

        this.diceContainer.appendChild(this.firstDie);

        this.rollButton.onclick = () => {
            this.firstDie.roll();
            setTimeout(() => this.controller.setPlayerInitialNumber(),  1500);
        }
        this.rollButton.innerText = 'Roll to draw';
    }

    renderForAiDraw() {
        // this.firstDie.onRoll = (value) => this.controller.setAiInitialNumber(value);
        this.rollButton.disabled = true;

        this.firstDie.roll();
        setTimeout(() => {
            this.controller.setAiInitialNumber(this.firstDie.value);
        },  1500);
    }

    prepareForGame() {
        this.firstDie.onclick = () => this.onDieClicked(0);

        this.secondDie = document.createElement('die-block');
        this.secondDie.onclick = () => this.onDieClicked(1);

        this.thirdDie = document.createElement('die-block');
        this.thirdDie.onclick = () => this.onDieClicked(2);

        this.dice = [this.firstDie, this.secondDie, this.thirdDie];

        this.diceContainer.append(this.secondDie, this.thirdDie);

        this.textContainer.innerHTML = `<p>Point number: <span id="point-number"></span></p>
        <p>Human's score: <span id="human-score"></p>
        <p>AI's score: <span id="ai-score"></p>
        <p>Current player: <span id="current-player"></span></p>`;

        this.humanScore = document.getElementById('human-score');
        this.aiScore = document.getElementById('ai-score');
        this.currentPlayer = document.getElementById('current-player');
        this.pointNumber = document.getElementById('point-number');

        this.heldDice = [false, false, false]; // dice held by player

        this.rollButton.onclick = () => {
            this.rollDice(this.heldDice.map(value => !value));
        };

        this.rollButton.innerText = 'Roll';


    }

    updateState() {
        const $ = this.controller;

        this.rollButton.disabled = $.currentPlayer === $.aiPlayer || $.winner;
        this.humanScore.innerText = $.humanPlayer.score;
        this.aiScore.innerText = $.aiPlayer.score;
        this.currentPlayer.innerText = $.currentPlayer.name;
        this.pointNumber.innerText = $.pointNumber;

        if ($.winner) {
            const winnerText = document.createElement('p');
            winnerText.innerText = `WINNER: ${$.winner.name}`;
            this.textContainer.appendChild(winnerText);
        }
    }

    onDiceRolled() {
        const die1 = this.firstDie.value;
        const die2 = this.secondDie.value;
        const die3 = this.thirdDie.value;
        this.controller.makeMove(die1, die2, die3);
    }

    rollAllDice() {
        this.thirdDie.roll();
        this.secondDie.roll();
        this.firstDie.roll();
        setTimeout(() => this.onDiceRolled(), 2000);
    }

    rollDice(move) {
        const dice = [this.firstDie, this.secondDie, this.thirdDie];

        for (let i = 0; i < 3; i++) {
            if (move[i]) {
                dice[i].makeBigger();
                dice[i].roll();
            } else {
                dice[i].makeSmaller();
            }

        }

        setTimeout(() => this.onDiceRolled(), 2000);
    }

    getDiceValues() {
        const die1 = this.firstDie.value;
        const die2 = this.secondDie.value;
        const die3 = this.thirdDie.value;
        return [die1, die2, die3];
    }

    resetDieHold() {
        for (const die of this.dice) {
            die.makeBigger();
        }
        this.heldDice = [false, false, false];
    }

    onDieClicked(index) {
        if (this.controller.currentPlayer === this.controller.humanPlayer
            && this.controller.humanPlayer.consecutiveMoves > 0) {
            this.heldDice[index] = !this.heldDice[index];
            if (this.heldDice[index] === true) {
                this.dice[index].makeSmaller();
            } else this.dice[index].makeBigger();
        }
    }

}