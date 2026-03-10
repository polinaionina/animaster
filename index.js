addListeners();

function addListeners() {
    let heartBeatingAnimation = null; // Сохраняем ссылку на текущую анимацию сердцебиения

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('resetFadeIn')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().resetFadeIn(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    document.getElementById('resetFadeOut')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().resetFadeOut(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('resetMove')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('resetScale')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().resetMoveAndScale(block);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHide');
            animaster().moveAndHide(block, {x: 100, y: 20}, 5000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHide');
            animaster().showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeating');
            if (heartBeatingAnimation) {
                heartBeatingAnimation.stop();
            }
            heartBeatingAnimation = animaster().heartBeating(block);
        });

    document.getElementById('heartBeatingStop')
        .addEventListener('click', function () {
            if (heartBeatingAnimation) {
                heartBeatingAnimation.stop();
                heartBeatingAnimation = null;
            }
        });

    // Пример использования цепочек анимаций
    document.getElementById('chainPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('chainBlock');
            animaster()
                .addMove(2000, {x: 100, y: 20})
                .addScale(1000, 1.5)
                .addFadeOut(1000)
                .play(block);
        });
}

function animaster() {
    const _steps = [];

    function addMove(duration, translation) {
        _steps.push({
            type: 'move',
            duration: duration,
            params: {translation: translation}
        });
        return this;
    }

    function addScale(duration, ratio) {
        _steps.push({
            type: 'scale',
            duration: duration,
            params: {ratio: ratio}
        });
        return this;
    }

    function addFadeIn(duration) {
        _steps.push({
            type: 'fadeIn',
            duration: duration,
            params: {}
        });
        return this;
    }

    function addFadeOut(duration) {
        _steps.push({
            type: 'fadeOut',
            duration: duration,
            params: {}
        });
        return this;
    }

    function play(element) {
        let currentDelay = 0;

        _steps.forEach(step => {
            setTimeout(() => {
                switch (step.type) {
                    case 'move':
                        move(element, step.duration, step.params.translation);
                        break;
                    case 'scale':
                        scale(element, step.duration, step.params.ratio);
                        break;
                    case 'fadeIn':
                        fadeIn(element, step.duration);
                        break;
                    case 'fadeOut':
                        fadeOut(element, step.duration);
                        break;
                }
            }, currentDelay);

            currentDelay += step.duration;
        });
    }

    /**
     * Блок плавно появляется из прозрачного.
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     */
    function fadeIn(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function fadeOut(element, duration) {
        element.style.transitionDuration = `${duration}ms`;
        element.classList.add('hide');
        element.classList.remove('show');
    }

    /**
     * Функция, передвигающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param translation — объект с полями x и y, обозначающими смещение блока
     */
    function move(element, duration, translation) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(translation, null);
    }

    /**
     * Функция, увеличивающая/уменьшающая элемент
     * @param element — HTMLElement, который надо анимировать
     * @param duration — Продолжительность анимации в миллисекундах
     * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
     */
    function scale(element, duration, ratio) {
        element.style.transitionDuration = `${duration}ms`;
        element.style.transform = getTransform(null, ratio);
    }

    function moveAndHide(element, translation, duration) {
        const firstDur = duration * 2 / 5;
        const secondDur = duration * 3 / 5;

        _steps.length = 0;
        addMove(firstDur, translation);
        addFadeOut(secondDur);
        play(element);
    }

    function showAndHide(element, duration) {
        const stepDur = duration / 3;

        _steps.length = 0;
        addFadeIn(stepDur);
        addScale(stepDur, 1);
        addFadeOut(stepDur);
        play(element);
    }

    function heartBeating(element) {
        let active = true;
        let timeouts = [];
        let intervalId = null;

        function beat() {
            if (!active) return;

            scale(element, 500, 1.4);

            const timeoutId1 = setTimeout(() => {
                if (active) {
                    scale(element, 500, 1);
                }
            }, 500);

            timeouts.push(timeoutId1);
        }

        beat();

        intervalId = setInterval(() => {
            if (active) {
                beat();
            }
        }, 1000);

        timeouts.push(intervalId);

        return {
            stop: function () {
                active = false;
                timeouts.forEach(timeoutId => clearTimeout(timeoutId));
                timeouts = [];

                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }

                element.style.transform = '';
                element.style.transitionDuration = '';
            }
        };
    }

    function resetFadeIn(element) {
        element.style.transitionDuration =  null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration =  null;
        element.classList.add('show');
        element.classList.remove('hide');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {
        fadeIn,
        fadeOut,
        move,
        scale,
        moveAndHide,
        showAndHide,
        heartBeating,
        resetFadeIn,
        resetFadeOut,
        resetMoveAndScale
    };
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}