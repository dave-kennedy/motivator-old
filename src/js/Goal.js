export default class Goal {
    constructor (params) {
        params = params || {};
        this.complete = params.complete || false;
        this.name = params.name || '';
        this.type = params.type || '';
        this.start = params.start || '';
        this.end = params.end || '';
        this.duration = params.duration || '';
        this.reps = params.reps || '';
        this.reward = params.reward || '';
        this._row;
    }

    render() {
        let row = $('<tr></tr>');

        row.on('click', event => {
            this.renderForm();
        });

        let completeSpan = $(`<span class="icon ${this.complete ? 'icon-ok' : 'icon-circle'}"></span>`);
        row.append($('<td></td>').append(completeSpan));

        completeSpan.on('click', event => {
            event.stopPropagation();
            this.complete = !this.complete;
            completeSpan.toggleClass('icon-ok').toggleClass('icon-circle');
            $(document).trigger('goal.complete', this);
        });

        row.append(`<td>${this.name}</td>`);

        if (this.type == 'oneTime') {
            row.append('<td></td>');
        }

        if (this.type == 'startEnd') {
            row.append(`<td>Start: ${this.start}<br>End: ${this.end}</td>`);
        }

        if (this.type == 'duration') {
            row.append(`<td>Duration: ${this.duration}</td>`);
        }

        if (this.type == 'reps') {
            row.append(`<td>Reps: ${this.reps}</td>`);
        }

        row.append(`<td>${this.reward}</td>`);

        if (this._row) {
            this._row.replaceWith(row);
            this._row = row;
        } else {
            let table = $('#goals-table');
            table.append(row);
            this._row = row;
        }
    }

    renderForm() {
        let modal = $('#modal');

        modal.find('.modal-title').html('New goal');

        let body = modal.find('.modal-body').html('');

        let nameInput = $(`<input class="form-control" placeholder="Name" type="text" value="${this.name}">`);
        body.append($('<div class="form-group"></div>').append(nameInput));

        nameInput.on('change', event => {
            this.name = event.target.value;
        });

        let typeSelect = $('<select class="form-control"></select>');
        typeSelect.append('<option value="" disabled selected>Type</option>');
        typeSelect.append(`<option value="oneTime" ${this.type == 'oneTime' ? 'selected' : ''}>One time</option>`);
        typeSelect.append(`<option value="startEnd" ${this.type == 'startEnd' ? 'selected' : ''}>Start/end</option>`);
        typeSelect.append(`<option value="duration" ${this.type == 'duration' ? 'selected' : ''}>Duration</option>`);
        typeSelect.append(`<option value="reps" ${this.type == 'reps' ? 'selected' : ''}>Reps</option>`);
        body.append($('<div class="form-group"></div>').append(typeSelect));

        typeSelect.on('change', event => {
            this.type = event.target.value;
            this.renderForm();
        });

        if (this.type == 'startEnd') {
            let startInput = $(`<input class="form-control" placeholder="Start" type="text" value="${this.start}">`);
            body.append($('<div class="form-group"></div>').append(startInput));

            startInput.on('change', event => {
                this.start = event.target.value;
            });

            let endInput = $(`<input class="form-control" placeholder="End" type="text" value="${this.end}">`);
            body.append($('<div class="form-group"></div>').append(endInput));

            endInput.on('change', event => {
                this.end = event.target.value;
            });
        }

        if (this.type == 'duration') {
            let durationInput = $(`<input class="form-control" placeholder="Duration" type="text" value="${this.duration}">`);
            body.append($('<div class="form-group"></div>').append(durationInput));

            durationInput.on('change', event => {
                this.duration = event.target.value;
            });
        }

        if (this.type == 'reps') {
            let repsInput = $(`<input class="form-control" placeholder="Reps" type="text" value="${this.reps}">`);
            body.append($('<div class="form-group"></div>').append(repsInput));

            repsInput.on('change', event => {
                this.reps = event.target.value;
            });
        }

        let rewardInput = $(`<input class="form-control" placeholder="Reward" type="text" value="${this.reward}">`);
        body.append($('<div class="form-group"></div>').append(rewardInput));

        rewardInput.on('change', event => {
            this.reward = event.target.value;
        });

        let footer = modal.find('.modal-footer').html('');

        let deleteButton = $('<button class="btn btn-danger mr-auto" data-dismiss="modal">Delete</button>');
        footer.append(deleteButton);

        deleteButton.on('click', event => {
            this._row.remove();
            $(document).trigger('goal.delete', this);
        });

        let saveButton = $('<button class="btn btn-primary" data-dismiss="modal">Save</button>');
        footer.append(saveButton);

        saveButton.on('click', event => {
            if (!this.validate()) {
                event.stopPropagation();
                throw new Error('Validation failed');
            }

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
        if (this._row) {
            this._row.hide();
        }
    }

    show() {
        if (this._row) {
            this._row.show();
        }
    }
}

