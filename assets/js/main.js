import Animator from './services/Animator.js';
import Elements from './services/Elements.js';

async function main() {
    const elements = Elements();
    const animator = Animator(elements);

    animator.listen();
}


document.addEventListener('DOMContentLoaded', main);
