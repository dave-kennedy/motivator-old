export default class Goal {
    constructor (params = {}) {
        this.completeDate = params.completeDate ? new Date(params.completeDate) : null;
        this.createDate = params.createDate ? new Date(params.createDate) : null;
        this.description = params.description || '';
        this.draft = params.draft == undefined ? true : params.draft;
        this.name = params.name || '';
        this.repeat = params.repeat == undefined ? false : params.repeat;
        this.reward = params.reward || '';
        this.rewardDate = params.rewardDate ? new Date(params.rewardDate) : null;
        this._elem = null;
    }

    render() {
        let elem = $('<div class="media border-bottom mb-3 pb-3"></div>');

        elem.on('click', event => {
            this.renderForm();
        });

        let completeButton = $(`<div class="icon mr-3" data-toggle="flip">
                <span class="${this.isCompleted() ? 'flip-down' : 'flip-up'} icon icon-circle"></span>
                <span class="${this.isCompleted() ? 'flip-up' : 'flip-down'} icon icon-ok"></span>
            </div>`);
        elem.append($('<div></div>').append(completeButton));

        completeButton.on('click', event => {
            event.stopPropagation();
            this.completeDate = this.isCompleted() ? null : new Date();
            this.rewardDate = null;
            $(event.currentTarget).children().toggleClass('flip-down flip-up');
            $(document).trigger('goal.complete', this);

            if (this.isCompleted() && this.repeat) {
                let goal = new Goal({
                    createDate: this.completeDate,
                    description: this.description,
                    draft: false,
                    name: this.name,
                    repeat: true,
                    reward: this.reward
                });

                goal.render();
                $(document).trigger('goal.save', goal);
            }
        }).one('transitionend', '.flip-down, .flip-up', event => {
            this._elem.fadeOut(() => {
                this.remove();
            });
        });

        let body = $('<div class="media-body"></div>');
        elem.append(body);

        body.append(`<div class="h5">${this.name} ${this.repeat ? '<span class="icon icon-sm icon-repeat-sm"></span>' : ''}</div>`);

        if (this.description) {
            body.append(`<div class="text-secondary">${this.description}</div>`);
        }

        if (this.reward) {
            body.append(`<div>Reward: ${this.isRewardClaimed() ? '<del>' + this.reward + '</del>' : this.reward}</div>`);

            if (this.isCompleted()) {
                let claimButton;

                if (this.isRewardClaimed()) {
                    claimButton = $('<button class="btn btn-secondary mt-3">Claimed</button>');
                } else {
                    claimButton = $('<button class="btn btn-success mt-3">Claim</button>');
                }

                body.append($('<div></div>').append(claimButton));

                claimButton.on('click', event => {
                    event.stopPropagation();
                    this.rewardDate = this.isRewardClaimed() ? null : new Date();
                    this.render();
                    $(document).trigger('goal.rewardClaimed', this);
                });
            }
        }

        if (this._elem) {
            this._elem.replaceWith(elem);
        } else {
            $('#goals-list').append(elem);
        }

        this._elem = elem;
    }

    renderForm() {
        let modal = $('#modal');

        if (this.draft) {
            modal.find('.modal-title').html('New goal');
        } else {
            modal.find('.modal-title').html('Edit goal');
        }

        let body = modal.find('.modal-body').empty();

        let nameInput = $(`<input autocapitalize="on" class="form-control" type="text" value="${this.name}">`);
        body.append($('<div class="form-group"></div>').append('<label>Name *</label>', nameInput));

        let descriptionInput = $(`<textarea autocapitalize="on" class="form-control">${this.description}</textarea>`);
        body.append($('<div class="form-group"></div>').append('<label>Description</label>', descriptionInput));

        let rewardInput = $(`<input autocapitalize="on" class="form-control" type="text" value="${this.reward}">`);
        body.append($('<div class="form-group"></div>').append('<label>Reward</label>', rewardInput));

        let repeatInput = $(`<input autocapitalize="on" class="mr-1" type="checkbox" ${this.repeat ? 'checked' : ''}>`);
        body.append($('<div class="form-group"></div>').append(repeatInput, '<label>Repeat</label>'));

        let createDateInput, createTimeInput, completeDateInput, completeTimeInput, rewardDateInput, rewardTimeInput;

        if (!this.draft) {
            let detailsButton = $('<div><a class="collapse-toggle collapsed" data-toggle="collapse" href="#details">Details</a></div>');
            body.append(detailsButton);

            let details = $('<div class="collapse" id="details"></div>');
            body.append(details);

            createDateInput = $(`<input class="d-inline form-control w-50" type="date" value="${this._getISODate(this.createDate)}">`);
            createTimeInput = $(`<input class="d-inline form-control w-50" type="time" value="${this._getISOTime(this.createDate)}">`);
            details.append($('<div class="form-group"></div>').append('<label class="d-block">Created</label>', createDateInput, createTimeInput));

            if (this.isCompleted()) {
                completeDateInput = $(`<input class="d-inline form-control w-50" type="date" value="${this._getISODate(this.completeDate)}">`);
                completeTimeInput = $(`<input class="d-inline form-control w-50" type="time" value="${this._getISOTime(this.completeDate)}">`);
                details.append($('<div class="form-group"></div>').append('<label class="d-block">Completed</label>', completeDateInput, completeTimeInput));
            }

            if (this.isRewardClaimed()) {
                rewardDateInput = $(`<input class="d-inline form-control w-50" type="date" value="${this._getISODate(this.rewardDate)}">`);
                rewardTimeInput = $(`<input class="d-inline form-control w-50" type="time" value="${this._getISOTime(this.rewardDate)}">`);
                details.append($('<div class="form-group"></div>').append('<label class="d-block">Reward claimed</label>', rewardDateInput, rewardTimeInput));
            }
        }

        let footer = modal.find('.modal-footer').empty();

        if (!this.draft) {
            let deleteButton = $('<button class="btn btn-danger mr-auto" data-dismiss="modal">Delete</button>');
            footer.append(deleteButton);

            deleteButton.on('click', event => {
                this.remove();
                $(document).trigger('goal.delete', this);
            });
        }

        let saveButton = $('<button class="btn btn-primary" data-dismiss="modal">Save</button>');
        footer.append(saveButton);

        saveButton.on('click', event => {
            if (!this.validate(nameInput.val())) {
                event.stopPropagation();
                body.prepend('<div class="alert alert-danger">Fields marked with an asterisk (*) are required.</div>');
                return;
            }

            if (this.draft) {
                this.createDate = new Date();
                this.draft = false;
            } else {
                this.createDate = new Date(`${createDateInput.val()}T${createTimeInput.val()}`);

                if (this.isCompleted()) {
                    this.completeDate = new Date(`${completeDateInput.val()}T${completeTimeInput.val()}`);
                }

                if (this.isRewardClaimed()) {
                    this.rewardDate = new Date(`${rewardDateInput.val()}T${rewardTimeInput.val()}`);
                }
            }

            this.description = descriptionInput.val();
            this.name = nameInput.val();
            this.repeat = repeatInput.prop('checked');
            this.reward = rewardInput.val();
            this.render();
            $(document).trigger('goal.save', this);
        });

        modal.modal();
    }

    remove() {
        if (this._elem) {
            this._elem.remove();
            this._elem = null;
        }
    }

    validate(name) {
        return name.trim() != '';
    }

    isCompleted() {
        return this.completeDate != null;
    }

    isRewardClaimed() {
        return this.rewardDate != null;
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
}

