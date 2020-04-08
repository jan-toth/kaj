class World {

    constructor(width, height, game, imgUrl) {
        this._width = width;
        this._height = height;
        this._game = game;

        this._mapImageUrl = imgUrl;

        this._mapImage = this._game.playground.querySelector('#world');
        this._mapImage.width = this._width;
        this._mapImage.height = this._height;

        this._drawMapAsyncAwait();
        // Utils.loadImage(this._mapImageUrl)
        //     .then(() => this._mapImage.src = this._mapImageUrl)
        //     .catch(() => this._createFallbackMap());

        this._calculateMapOrigin();
    }

    async _drawMapAsyncAwait() {
        try {
            // cache the image and then render it
            await Utils.loadImage(this._mapImageUrl);
            this._mapImage.src = this._mapImageUrl;
        } catch {
            this._createFallbackMap();
        }
    }

    _createFallbackMap() {
        this._mapImage.style.backgroundColor = "rgba(255, 255, 0, 0.3)";
    }

    _calculateMapOrigin() {
        // 10 pixels from all borders
        this._margin = 10;

        this._x0 = this._margin;
        this._y0 = this._game.playground.clientHeight - this._height + this._margin;

        this._x1 = this._x0 + this._width - this._margin;
        this._y1 = this._y0 + this._height - this._margin;
    }

    getRandomPosition(offsetX = 80, offsetY = offsetX) {
        let x = Utils.getRandomInt(this._x0, this._x1 - offsetX);
        let y = Utils.getRandomInt(this._y0, this._y1 - offsetY);
        return [x, y]
    }

}