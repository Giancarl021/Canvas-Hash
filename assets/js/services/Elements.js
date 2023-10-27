export default function Elements() {
    let lastInputValue = null,
        canvasFrameDuration = 300,
        canvasLastFrame = null,
        canvasFrameIndex = 0;

    const $ = {
        input: document.querySelector('input'),
        canvas: document.querySelector('canvas'),
        span: document.querySelector('span')
    };

    function setSpanText(string) {
        $.span.textContent = string;
    }

    function onInputChange(callback) {
        $.input.addEventListener('keyup', () => {
            if ($.input.value === lastInputValue) return;

            callback($.input.value);
            lastInputValue = $.input.value;
        });
    }

    function setCanvasSize(size) {
        $.canvas.width = size;
        $.canvas.height = size;
    }

    function animateCanvas(frames) {
        const ctx = $.canvas.getContext('2d');
        animationFn();

        function animationFn() {
            if (canvasLastFrame + canvasFrameDuration >= Date.now())
                return requestAnimationFrame(animationFn);

            const frame = frames[canvasFrameIndex];

            ctx.clearRect(0, 0, 100, 100);
            console.log(canvasFrameIndex);
            ctx.fillStyle = frame.bg;
            ctx.fillRect(0, 0, $.canvas.width, $.canvas.height);

            for (const action of frame.actions) {
                ctx.fillStyle = action.color;
                ctx.strokeStyle = action.color;

                ctx[action.fn](...action.args);

                ctx.stroke();
                ctx.fill();
            }

            canvasFrameIndex = (canvasFrameIndex + 1) % frames.length;
            canvasLastFrame = Date.now();
            requestAnimationFrame(animationFn);
        }
    }

    function setCanvasAnimationSpeed(frameDuration) {
        canvasFrameDuration = frameDuration;
    }

    return {
        setSpanText,
        onInputChange,
        setCanvasSize,
        setCanvasAnimationSpeed,
        animateCanvas
    };
}
