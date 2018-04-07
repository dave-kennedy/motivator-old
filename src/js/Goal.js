export default class Goal {
    constructor (params) {
        params = params || {};
        this.complete = params.complete == undefined ? false : params.complete;
        this.draft = params.draft == undefined ? true : params.draft;
        this.name = params.name || '';
        this.type = params.type || '';
        this.start = params.start || '';
        this.end = params.end || '';
        this.duration = params.duration || '';
        this.reps = params.reps || '';
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

        if (this.type == 'oneTime') {
            body.append('<div>One time</div>');
        } else if (this.type == 'startEnd') {
            body.append(`<div>Start: ${this.start}<br>End: ${this.end}</div>`);
        } else if (this.type == 'duration') {
            body.append(`<div>Duration: ${this.duration}</div>`);
        } else if (this.type == 'reps') {
            body.append(`<div>Reps: ${this.reps}</div>`);
        }

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

        let typeSelect = $('<select class="form-control"></select>');
        typeSelect.append('<option value="" disabled selected></option>');
        typeSelect.append(`<option value="oneTime" ${this.type == 'oneTime' ? 'selected' : ''}>One time</option>`);
        typeSelect.append(`<option value="startEnd" ${this.type == 'startEnd' ? 'selected' : ''}>Start/end</option>`);
        typeSelect.append(`<option value="duration" ${this.type == 'duration' ? 'selected' : ''}>Duration</option>`);
        typeSelect.append(`<option value="reps" ${this.type == 'reps' ? 'selected' : ''}>Reps</option>`);
        body.append($('<div class="form-group"></div>').append('<label>Type *</label>', typeSelect));

        typeSelect.on('change', event => {
            this.type = event.target.value;
            this.renderForm();
        });

        if (this.type == 'startEnd') {
            let startInput = $(`<input class="form-control" type="text" value="${this.start}">`);
            body.append($('<div class="form-group"></div>').append('<label>Start *</label>', startInput));

            startInput.on('change', event => {
                this.start = event.target.value;
            });

            let endInput = $(`<input class="form-control" type="text" value="${this.end}">`);
            body.append($('<div class="form-group"></div>').append('<label>End *</label>', endInput));

            endInput.on('change', event => {
                this.end = event.target.value;
            });
        }

        if (this.type == 'duration') {
            let durationInput = $(`<input class="form-control" type="text" value="${this.duration}">`);
            body.append($('<div class="form-group"></div>').append('<label>Duration *</label>', durationInput));

            durationInput.on('change', event => {
                this.duration = event.target.value;
            });
        }

        if (this.type == 'reps') {
            let repsInput = $(`<input class="form-control" type="text" value="${this.reps}">`);
            body.append($('<div class="form-group"></div>').append('<label>Reps *</label>', repsInput));

            repsInput.on('change', event => {
                this.reps = event.target.value;
            });
        }

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
        if (!this.name || !this.type) {
            return false;
        }

        if (this.type == 'startEnd' && (!this.start || !this.end)) {
            return false;
        }

        if (this.type == 'duration' && !this.duration) {
            return false;
        }

        if (this.type == 'reps' && !this.reps) {
            return false;
        }

        return true;
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

