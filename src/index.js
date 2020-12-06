import "./styles.css";
import Die from './die/die';

onload = () => {
    console.log("hello world!");

    customElements.define('die-block', Die);

    document.getElementById('roll-dice-button').onclick = () => {
        const die = document.getElementById('die');
        die.roll();
        console.log(die.value);
    };
}