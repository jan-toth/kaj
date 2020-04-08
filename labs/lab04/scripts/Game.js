class Game {

    constructor() {
        this._width = 600;
        this._mapHeight = 392;
        this._missedCost = 30;
        this._crosshairPixelStep = 10;

        this._playgroundEl = document.querySelector("#playground");

        this._scoreEl = this._playgroundEl.querySelector("h4");
        this._overlayEl = this._playgroundEl.querySelector('#overlay');

        this._spawnInterval = 2 * 1000;

        this._gameOverEl = this._playgroundEl.querySelector('#go');
        this._resetButtonEl = this._playgroundEl.querySelector('button');
        this._resetButtonEl.addEventListener('click', this);

        this._crosshairEl = this._playgroundEl.querySelector('#ch');

        this._reset();

        this._world = new World(this._width, this._mapHeight, this, 'images/world-map.svg');
        this._controls = new Controls(this);
    }

    _reset() {
        this._eliminated = 0;
        this._missed = 0;
        this._isGameOver = false;

        this._gameOverEl.style.display = 'none';
        this._overlayWidth = 0;

        this._updateScore();

        document.removeEventListener('mousemove', this, true);
        document.removeEventListener('keydown', this, true);

        this._intervalId = setInterval(() => this._spawnVirus(), this._spawnInterval);
    }

    _updateScore() {
        this._overlayEl.style.width = Utils.getPixelString(this._overlayWidth);
        this._scoreEl.innerText = `Eliminated: ${this._eliminated} | Missed: ${this._missed}`;

        if (this._overlayWidth >= this._width) {
            this._gameOver();
        }
    }

    _spawnVirus() {
        let [x, y] = this._world.getRandomPosition();
        this._virus = new Virus(x, y, this, 1);
    }

    get playground() {
        return this._playgroundEl;
    }

    get world() {
        return this._world;
    }

    get crosshair() {
        return this._crosshairEl;
    }

    missVirus() {
        this._missed += 1;
        this._overlayWidth += this._missedCost;
        this._updateScore();
    }

    eliminateVirus() {
        this._eliminated += 1;

        this._virus.destroy();
        this._virus = null;

        this._updateScore();
    }

    shoot() {
        if (this._virus == null) {
            return;
        }

        let crosshairStart = this._crosshairEl.offsetLeft;
        let virusStart = this._virus.elem.offsetLeft;
        let offset = crosshairStart - virusStart;
        if (offset < -10 || offset > virusStart + this._virus.elem.offsetWidth) {
            return;
        }

        crosshairStart = this._crosshairEl.offsetTop;
        virusStart = this._virus.elem.offsetTop;
        offset = crosshairStart - virusStart;
        if (offset < -10 || offset > virusStart + this._virus.elem.offsetHeight) {
            return;
        }

        this.eliminateVirus();
    }

    _gameOver() {
        this._isGameOver = true;
        this._gameOverEl.style.display = '';

        clearInterval(this._intervalId);

        document.addEventListener('mousemove', this, true);
        document.addEventListener('keydown', this, true);
    }

    snapCrosshair(x, y) {
        x -= this._playgroundEl.offsetLeft + this._crosshairEl.offsetWidth / 2;
        x = this._normalizeHorizPos(x);

        y -= this._playgroundEl.offsetTop + this._crosshairEl.offsetHeight / 2;
        y = this._normalizeVertPos(y);

        this._crosshairEl.style.left = Utils.getPixelString(x);
        this._crosshairEl.style.top = Utils.getPixelString(y);
    }

    _normalizeHorizPos(x) {
        if (x < 0) {
            x = 0;
        } else if (x > this._width - this._crosshairEl.offsetWidth) {
            x = this._width - this._crosshairEl.offsetWidth;
        }

        return x;
    }

    _normalizeVertPos(y) {
        if (y > this._playgroundEl.offsetHeight - this._crosshairEl.offsetHeight) {
            y = this._playgroundEl.offsetHeight - this._crosshairEl.offsetHeight;
        } else if (y < this._playgroundEl.offsetHeight - this._overlayEl.offsetHeight) {
            y = this._playgroundEl.offsetHeight - this._overlayEl.offsetHeight;
        }

        return y;
    }

    _stopEvent(e) {
        e.stopPropagation();
    }

    moveCrosshair(dir, factor) {
        if (dir === 'horiz') {
            let x = this._crosshairEl.offsetLeft + factor * this._crosshairPixelStep;
            x = this._normalizeHorizPos(x);
            this._crosshairEl.style.left = Utils.getPixelString(x);
        } else {
            let y = this._crosshairEl.offsetTop + factor * this._crosshairPixelStep;
            y = this._normalizeVertPos(y);
            this._crosshairEl.style.top = Utils.getPixelString(y);
        }
    }

    handleEvent(e) {
        if (e.type === 'click') {
            if (this._isGameOver) {
                this._reset();
            }
        } else {
            // mousemove or keydown
            this._stopEvent(e);
        }
    }
}