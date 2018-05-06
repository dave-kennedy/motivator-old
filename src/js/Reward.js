export default class Reward {
    constructor (params = {}) {
        this.createDate = params.createDate ? new Date(params.createDate) : null;
        this.description = params.description || '';
        this.draft = params.draft == undefined ? true : params.draft;
        this.name = params.name || '';
        this.points = params.points || 0;
        this.redeemDate = params.redeemDate ? new Date(params.redeemDate) : null;
        this._elem = null;
    }

    delete() {
        this.remove();
        $(document).trigger('reward.delete', this);
    }

    getPointsRedeemed() {
        if (!this.isRedeemed()) {
            return 0;
        }

        return this.points;
    }

    isRedeemed() {
        return this.redeemDate != null;
    }

    redeem() {
        this.redeemDate = this.isRedeemed() ? null : new Date();
        $(document).trigger('reward.redeem', this);
    }

    remove() {
        if (this._elem) {
            this._elem.remove();
            this._elem = null;
        }
    }

    render() {
        let elem = $('<div class="media border-bottom mb-3 pb-3"></div>');

        let redeemButton = $(`<div class="icon mr-3" data-toggle="flip">
                <span class="${this.isRedeemed() ? 'flip-down' : 'flip-up'} icon icon-jewel"></span>
                <span class="${this.isRedeemed() ? 'flip-up' : 'flip-down'} icon icon-check"></span>
            </div>`);
        elem.append($('<div></div>').append(redeemButton));

        redeemButton.on('click', () => this.redeem());

        let body = $('<div class="media-body"></div>');
        elem.append(body);

        body.on('click', () => this.renderForm());

        body.append(`<div class="h5">${this.name}</div>`);

        if (this.description) {
            body.append(`<div class="text-secondary">${this.description}</div>`);
        }

        if (this.points) {
            body.append(`<div><span class="icon icon-sm icon-star-sm"></span> ${this.points} points</div>`);
        }

        if (this._elem) {
            this._elem.replaceWith(elem);
        } else {
            $('#container').append(elem);
        }

        this._elem = elem;
    }

    renderForm() {
        let modal = $('#modal');

        if (this.draft) {
            modal.find('.modal-title').html('New reward');
        } else {
            modal.find('.modal-title').html('Edit reward');
        }

        let body = modal.find('.modal-body').empty(),
            form = $('<form></form>');
        body.append(form);

        let nameInput = $(`<input autocapitalize="on" class="form-control" name="name" type="text" value="${this.name}">`);
        form.append($('<div class="form-group"></div>').append('<label>Name *</label>', nameInput));

        let descriptionInput = $(`<textarea autocapitalize="on" class="form-control" name="description">${this.description}</textarea>`);
        form.append($('<div class="form-group"></div>').append('<label>Description</label>', descriptionInput));

        let pointsInput = $(`<input autocapitalize="on" class="form-control" name="points" type="number" value="${this.points}">`);
        form.append($('<div class="form-group"></div>').append('<label>Points</label>', pointsInput));

        if (!this.draft) {
            let detailsButton = $('<div><a class="collapse-toggle collapsed" data-toggle="collapse" href="#details">Details</a></div>');
            form.append(detailsButton);

            let details = $('<div class="collapse" id="details"></div>');
            form.append(details);

            let createDateInput = $(`<input class="d-inline form-control w-50" name="createDate" type="date" value="${this._getISODate(this.createDate)}">`);
            let createTimeInput = $(`<input class="d-inline form-control w-50" name="createTime" type="time" value="${this._getISOTime(this.createDate)}">`);
            details.append($('<div class="form-group"></div>').append('<label class="d-block">Created</label>', createDateInput, createTimeInput));

            if (this.isRedeemed()) {
                let redeemDateInput = $(`<input class="d-inline form-control w-50" name="redeemDate" type="date" value="${this._getISODate(this.redeemDate)}">`);
                let redeemTimeInput = $(`<input class="d-inline form-control w-50" name="redeemTime" type="time" value="${this._getISOTime(this.redeemDate)}">`);
                details.append($('<div class="form-group"></div>').append('<label class="d-block">Redeemed</label>', redeemDateInput, redeemTimeInput));
            }
        }

        let footer = modal.find('.modal-footer').empty();

        if (!this.draft) {
            let deleteButton = $('<button class="btn btn-danger mr-auto" data-dismiss="modal">Delete</button>');
            footer.append(deleteButton);

            deleteButton.on('click', () => this._promptDelete());
        }

        let saveButton = $('<button class="btn btn-primary" data-dismiss="modal">Save</button>');
        footer.append(saveButton);

        saveButton.on('click', event => {
            let params = this._deserialize(form);

            if (!this.validate(params)) {
                event.stopPropagation();
                form.prepend('<div class="alert alert-danger">Fields marked with an asterisk (*) are required.</div>');
                return;
            }

            this.save(params);
        });

        modal.modal();
    }

    save(params) {
        if (this.draft) {
            this.createDate = new Date();
            this.draft = false;
        } else {
            this.createDate = params.createDate && params.createTime ? new Date(`${params.createDate}T${params.createTime}`) : null;
            this.redeemDate = params.redeemDate && params.redeemTime ? new Date(`${params.redeemDate}T${params.redeemTime}`) : null;
        }

        this.description = params.description || '';
        this.name = params.name || '';
        this.points = parseInt(params.points) || 0;
        this.render();
        $(document).trigger('reward.save', this);
    }

    validate(params) {
        return params.name.trim() != '';
    }

    _deserialize(form) {
        let obj = {};

        form.find('input, select, textarea').each((i, elem) => {
            if (!elem.name) {
                return;
            }

            if (elem.type == 'checkbox') {
                obj[elem.name] = elem.checked;
            } else {
                obj[elem.name] = elem.value;
            }
        });

        return obj;
    }

    _getISODate(date) {
        let yyyy = date.getFullYear(),
            mm = (date.getMonth() + 1).toString().padStart(2, '0'),
            dd = date.getDate().toString().padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    }

    _getISOTime(date) {
        let hh = date.getHours().toString().padStart(2, '0'),
            mm = date.getMinutes().toString().padStart(2, '0'),
            ss = date.getSeconds().toString().padStart(2, '0');

        return `${hh}:${mm}:${ss}`;
    }

    _promptDelete() {
        let modal = $('#modal');
        modal.find('.modal-title').html('Confirm delete');
        modal.find('.modal-body').html('<p>Are you sure you want to delete this reward and its history?</p>');

        let footer = modal.find('.modal-footer').empty();

        let yesButton = $('<button class="btn btn-danger mr-auto" data-dismiss="modal">Yes</button>');
        footer.append(yesButton);

        yesButton.on('click', () => this.delete());

        let noButton = $('<button class="btn btn-primary" data-dismiss="modal">No</button>');
        footer.append(noButton);

        modal.modal();
    }
}

