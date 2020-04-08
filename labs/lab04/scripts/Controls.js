class Controls {
    constructor(game) {
        this._game = game;

        this._keysInputEl = this._game.playground.querySelector('#keys');
        this._mouseInputEl = this._game.playground.querySelector('#mouse');

        this._currentInput = 'Mouse';
        this._mouseInputEl.checked = true;

        this._keysInputEl.addEventListener('change', e => this._switchToKeys());
        this._mouseInputEl.addEventListener('change', e => this._switchToMouse());

        this._switchToMouse();
    }

    get inputType() {
        return this._currentInput;
    }

    _switchToKeys() {
        this._game.playground.removeEventListener('mousemove', this);
        this._game.playground.removeEventListener('click', this);

        document.body.addEventListener('keydown', this);
        document.body.addEventListener('keyup', this);
        this._currentInput = 'Keyboard';
    }

    _switchToMouse() {
        this._game.playground.addEventListener('mousemove', this);
        this._game.playground.addEventListener('click', this);

        document.body.removeEventListener('keydown', this);
        document.body.removeEventListener('keyup', this);
        this._currentInput = 'Mouse';
    }

    handleEvent(e) {
        if (e.type === 'mousemove') {
            this._game.snapCrosshair(e.pageX, e.pageY);
        } else if (e.type === 'click') {
            this._game.shoot();
        } else if (e.type === 'keydown') {
            if (e.code === 'KeyW') {
                this._game.moveCrosshair('vert', -1);
            } else if (e.code === 'KeyS') {
                this._game.moveCrosshair('vert', 1);
            } else if (e.code === 'KeyA') {
                this._game.moveCrosshair('horiz', -1);
            } else if (e.code === 'KeyD') {
                this._game.moveCrosshair('horiz', 1);
            }
        } else if (e.type === 'keyup') {
            if (e.code === 'KeyK') {
                this._game.shoot();
            }
        }
    }
}