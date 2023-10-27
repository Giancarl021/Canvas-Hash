import sha512 from '../util/sha512.js';

const EMPTY_FRAME = {
    bg: '#000',
    actions: []
};

const ACTIONS = {
    rect: 0,
    arc: 1,
    ellipse: 2,
    lineTo: 3
};
const ACTION_KEYS = Object.keys(ACTIONS);
const CANVAS_SIZE = 100;

export default function Animator(elements) {
    elements.setCanvasSize(CANVAS_SIZE);

    function _splitArray(array) {
        const length = Math.floor(Math.sqrt(array.length));

        return Array.from({ length }, (_, i) => array.slice(i * length, i * length + length));
    }

    function _createFrames(byteArray) {
        if (!byteArray.length) return [EMPTY_FRAME];

        const frameHashes = _splitArray(byteArray);
        const frameSize = frameHashes.length;

        const frames = [];

        for (const frameHash of frameHashes) {
            frames.push({
                bg: _createBackground(frameHash),
                actions: _createActions(frameHash)
            });
        }

        return frames;

        function _createBackground(frameHash) {
            const hue = (
                frameHash.reduce(
                    (acc, item) => (acc + item) * item, 0
                ) / frameSize
            ) % 360;

            const saturation = (
                frameHash.reduce(
                    (acc, item) => acc + (item << frameSize), 0
                ) / frameSize
            ) % 100;

            const luminance = (
                frameHash.reduce(
                    (acc, item) => acc + item * frameSize, 0
                ) * frameSize
            ) % 100;

            const color = `hsl(${hue}deg, ${saturation}%, ${luminance}%)`;

            return color;
        }

        function _createActions(frameHash) {
            const actions = [];
            
            for (const item of frameHash) {
                const action = item % ACTION_KEYS.length;
                const args = [];

                switch (action) {
                    case ACTIONS.rect:
                        args.push(..._createCoords(item, 4));
                        break;
                    case ACTIONS.arc:
                        args.push(
                            ..._createCoords(item, 3),
                            ..._createRadians(item, 2)
                        );
                        break;
                    case ACTIONS.ellipse:
                        args.push(
                            ..._createCoords(item, 4),
                            ..._createRadians(item, 3)
                        );
                        break;
                    case ACTIONS.lineTo:
                        args.push(..._createCoords(item, 2));
                        break;
                }

                actions.push({
                    color: _createColor(item),
                    fn: ACTION_KEYS[action],
                    args
                });
            }

            return actions;
        }

        function _createColor(number) {
            const r = Math.pow(number * frameSize, 2) % 256;
            const g = Math.pow(number, number) % 256;
            const b = Math.pow(frameSize / number, 3) % 256;

            return `rgb(${r}, ${g}, ${b})`;
        }

        function _createCoords(number, quantity) {
            const numbers = [];
            for (let i = 0; i < quantity; i++) {
                numbers.push((Math.pow(number * (i + 1), 2) / frameSize) % CANVAS_SIZE);
            }

            return numbers;
        }

        function _createRadians(number, quantity) {
            const numbers = [];

            for (let i = 0; i < quantity; i++) {
                numbers.push((number ** i / frameSize) % (Math.PI * 2));
            }

            return numbers;
        }
    }

    async function _listener(value) {
        const hash = await sha512(value);

        elements.setSpanText(hash.hashedString);
        elements.animateCanvas(_createFrames(hash.byteArray));
    }

    function listen() {
        elements.onInputChange(_listener);
    }

    return {
        listen
    };
}
