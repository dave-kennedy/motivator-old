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

        $(`<div class="icon mr-3" data-toggle="flip">
                <span class="${this.isRedeemed() ? 'flip-down' : 'flip-up'} icon icon-jewel"></span>
                <span class="${this.isRedeemed() ? 'flip-up' : 'flip-down'} icon icon-check"></span>
            </div>`).appendTo(elem).on('click', () => this.redeem());

        let body = $(`<div class="media-body">
                <div class="h5">${this.name}</div>
            </div>`).appendTo(elem).on('click', () => this.renderForm());

        if (this.description) {
            $(`<div class="text-secondary">${this.description}</div>`).appendTo(body);
        }

        let details = $('<div class="text-secondary"></div>').appendTo(body);

        if (this.points) {
            details.append(`<span class="icon icon-sm icon-star-sm"></span> ${this.points} points`);
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
        modal.find('.modal-title').html(`${this.draft ? 'New reward' : 'Edit reward'}`);

        let body = modal.find('.modal-body').empty();

        let form = $(`<form>
                <div class="form-group">
                    <label>Name *</label>
                    <input autocapitalize="on" class="form-control" name="name" type="text" value="${this.name}">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea autocapitalize="on" class="form-control" name="description">${this.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Points</label>
                    <input autocapitalize="on" class="form-control" name="points" type="number" value="${this.points}">
                </div>
            </form>`).appendTo(body);

        if (!this.draft) {
            $(`<div>
                    <a class="collapse-toggle collapsed" data-toggle="collapse" href="#details">Details</a>
                </div>`).appendTo(form);

            let details = $(`<div class="collapse" id="details">
                    <div class="form-group">
                        <label>Created</label>
                        <div class="form-row">
                            <div class="col-6">
                                <input class="form-control" name="createDate" type="date" value="${this._getISODate(this.createDate)}">
                            </div>
                            <div class="col-6">
                                <input class="form-control" name="createTime" type="time" value="${this._getISOTime(this.createDate)}">
                            </div>
                        </div>
                    </div>
                </div>`).appendTo(form);

            if (this.isRedeemed()) {
                $(`<div class="form-group">
                        <label>Redeemed</label>
                        <div class="form-row">
                            <div class="col-6">
                                <input class="form-control" name="redeemDate" type="date" value="${this._getISODate(this.redeemDate)}">
                            </div>
                            <div class="col-6">
                                <input class="form-control" name="redeemTime" type="time" value="${this._getISOTime(this.redeemDate)}">
                            </div>
                        </div>
                    </div>`).appendTo(details);
            }
        }

        let footer = modal.find('.modal-footer').empty();

        if (!this.draft) {
            $('<button class="btn btn-danger mr-auto" data-dismiss="modal">Delete</button>').appendTo(footer).on('click', () => this._promptDelete());
        }

        $('<button class="btn btn-primary" data-dismiss="modal">Save</button>').appendTo(footer).on('click', event => {
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
        $('<button class="btn btn-danger mr-auto" data-dismiss="modal">Yes</button>').appendTo(footer).on('click', () => this.delete());
        $('<button class="btn btn-primary" data-dismiss="modal">No</button>').appendTo(footer);

        modal.modal();
    }
}

