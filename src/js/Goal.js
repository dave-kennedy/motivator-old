export default class Goal {
    constructor (params) {
        params = params || {};
        this.complete = params.complete == undefined ? false : params.complete;
        this.draft = params.draft == undefined ? true : params.draft;
        this.name = params.name || '';
        this.reward = params.reward || '';
        this.rewardClaimed = params.rewardClaimed == undefined ? false : params.rewardClaimed;
        this._elem;
    }

    render() {
        let elem = $('<div class="media border-bottom mb-3 pb-3"></div>');

        elem.on('click', event => {
            this.renderForm();
        });

        let completeButton = $(`<span class="icon ${this.complete ? 'icon-ok' : 'icon-circle'} mr-3"></span>`);
        elem.append($('<div></div>').append(completeButton));

        completeButton.on('click', event => {
            event.stopPropagation();
            this.complete = !this.complete;
            this.render();
            $(document).trigger('goal.complete', this);
        });

        let body = $('<div class="media-body"></div>');
        elem.append(body);

        body.append(`<div class="h5">${this.name}</div>`);

        if (this.reward) {
            body.append(`<div>Reward: ${this.rewardClaimed ? '<del>' + this.reward + '</del>' : this.reward}</div>`);

            if (this.complete) {
                let claimButton;

                if (this.rewardClaimed) {
                    claimButton = $('<button class="btn btn-secondary mt-3">Claimed</button>');
                } else {
                    claimButton = $('<button class="btn btn-success mt-3">Claim</button>');
                }

                body.append($('<div></div>').append(claimButton));

                claimButton.on('click', event => {
                    event.stopPropagation();
                    this.rewardClaimed = !this.rewardClaimed;
                    this.render();
                    $(document).trigger('goal.rewardClaimed', this);
                });
            }
        }

        if (this._elem) {
            this._elem.replaceWith(elem);
            this._elem = elem;
        } else {
            let goalsList = $('#goals-list');
            goalsList.append(elem);
            this._elem = elem;
        }
    }

    renderForm() {
        let modal = $('#modal');

        if (this.draft) {
            modal.find('.modal-title').html('New goal');
        } else {
            modal.find('.modal-title').html('Edit goal');
        }

        let body = modal.find('.modal-body').html('');

        let nameInput = $(`<input class="form-control" type="text" value="${this.name}">`);
        body.append($('<div class="form-group"></div>').append('<label>Name *</label>', nameInput));

        nameInput.on('change', event => {
            this.name = event.target.value;
        });

        let rewardInput = $(`<input class="form-control" type="text" value="${this.reward}">`);
        body.append($('<div class="form-group"></div>').append('<label>Reward</label>', rewardInput));

        rewardInput.on('change', event => {
            this.reward = event.target.value;
        });

        let footer = modal.find('.modal-footer').html('');

        let deleteButton = $('<button class="btn btn-danger mr-auto" data-dismiss="modal">Delete</button>');
        footer.append(deleteButton);

        deleteButton.on('click', event => {
            this._elem.remove();
            $(document).trigger('goal.delete', this);
        });

        let saveButton = $('<button class="btn btn-primary" data-dismiss="modal">Save</button>');
        footer.append(saveButton);

        saveButton.on('click', event => {
            if (!this.validate()) {
                event.stopPropagation();
                body.prepend('<div class="alert alert-danger">Fields marked with an asterisk (*) are required.</div>');
                return;
            }

            this.draft = false;
            this.render();
            $(document).trigger('goal.save', this);
        });

        modal.modal();
    }

    validate() {
        return this.name;
    }

    hide() {
        if (this._elem) {
            this._elem.hide();
        }
    }

    show() {
        if (this._elem) {
            this._elem.show();
        }
    }
}

