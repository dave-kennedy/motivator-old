export default class Navbar {
    constructor () {
        this._elem = null;
        this._brand = null;
        this._text = null;
    }

    render() {
        this._elem = $('<nav class="navbar navbar-dark bg-dark mb-3"></nav>');
        $(document.body).prepend(this._elem);

        this._brand = $('<div class="navbar-brand"></div>');
        this._elem.append(this._brand);

        this._text = $('<div class="navbar-text"></div>');
        this._elem.append(this._text);
    }

    showGoals() {
        this._brand.html('<span class="icon icon-menu-sm" data-toggle="flyout" data-target="#menu"></span> Goals');
    }

    showHistory() {
        this._brand.html('<span class="icon icon-back-sm" data-action="showGoals"></span> History');
    }

    updatePointsEarned(points) {
        this._text.html(`${points} <span class="icon icon-sm icon-star-sm"></span>`);
    }
}

