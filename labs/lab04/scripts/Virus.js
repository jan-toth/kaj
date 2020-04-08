class Virus {

    constructor(x, y, game, ttl = 1) {
        this._x = x;
        this._y = y;

        this._game = game;
        this._createElement();

        this._timerId = setTimeout(() => {
            this._game.missVirus();
            this.destroy();
        }, 1000 * ttl);

    }

    get elem() {
        return this._elem;
    }

    _createElement() {
        this._elem = document.createElement('div');
        this._elem.classList.add('virus');

        this._elem.style.left = Utils.getPixelString(this._x);
        this._elem.style.top = Utils.getPixelString(this._y);

        this._game.playground.insertBefore(this._elem, this._game.crosshair);
        // this._game.playground.appendChild(this._elem);
    }

    destroy() {
        clearTimeout(this._timerId);
        this._game.playground.removeChild(this._elem);
    }

}