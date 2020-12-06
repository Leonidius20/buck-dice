/*
 * This component is based on 'Animated 3D Dice Roll' by ryancperry
 * https://codesandbox.io/s/xjk3xqnprw
 */

import html from './die.html';
import css from './die.css';

export default class Die extends HTMLElement {

    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = html;

        const style = document.createElement('style');
        style.innerText = css;
        shadowRoot.appendChild(style);
    }

    roll() {
        const die = this.shadowRoot.getElementById('die-1');
        die.classList.toggle("odd-roll");
        die.classList.toggle("even-roll");
        const value = Die.getRandomNumber(1, 6);
        die.dataset.roll = value;
        //setTimeout(() => {
        //    if (this.onRollCallback) this.onRollCallback(value);
        //}, 1500);
    }

    //set onRoll(callback) {
    //    this.onRollCallback = callback;
    //}

    get value() {
        const die = this.shadowRoot.getElementById('die-1');
        return die.dataset.roll;
    }

    static getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}