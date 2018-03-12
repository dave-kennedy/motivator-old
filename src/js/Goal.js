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

        row.on('click', (event) => {
            this.renderForm();
        });

        let completeInput = $(`
            <td>
                <input type="checkbox" ${this.complete ? 'checked' : ''}>
            </td>
        `);

        completeInput.on('change', (event) => {
            this.complete = event.target.checked;
            $(document).trigger('goal.complete', this);
        });

        row.append(completeInput);

        row.append(`<td>${this.name}</td>`);

        if (this.type == 'oneTime') {
            row.append('<td></td>');
        }

        if (this.type == 'startEnd') {
            row.append(`
                <td>
                    <span class="mr-3">Start: ${this.start}</span>
                    End: ${this.end}
                </td>
            `);
        }

        if (this.type == 'duration') {
            row.append(`
                <td>
                    Duration: ${this.duration}
                </td>
            `);
        }

        if (this.type == 'reps') {
            row.append(`
                <td>
                    Reps: ${this.reps}
                </td>
            `);
        }

        row.append(`<td>${this.reward}</td>`);

        if (this._row) {
            this._row.replaceWith(row);
        } else {
            let table = $('#goals-table');
            table.append(row);
            this._row = row;
        }
    }

    renderForm() {
        let form = $('<form></form>');

        let nameInput = $(`
            <div class="form-group">
                <input class="form-control" placeholder="Name" type="text" value="${this.name}">
            </div>
        `);

        nameInput.on('change', (event) => {
            this.name = event.target.value;
        });

        form.append(nameInput);

        let typeSelect = $(`
            <div class="form-group">
                <select class="form-control">
                    <option value="" disabled selected>Type</option>
                    <option value="oneTime" ${this.type == 'oneTime' ? 'selected' : ''}>One time</option>
                    <option value="startEnd" ${this.type == 'startEnd' ? 'selected' : ''}>Start/end</option>
                    <option value="duration" ${this.type == 'duration' ? 'selected' : ''}>Duration</option>
                    <option value="reps" ${this.type == 'reps' ? 'selected' : ''}>Reps</option>
                </select>
            </div>
        `);

        typeSelect.on('change', (event) => {
            this.type = event.target.value;
            this.renderForm();
        });

        form.append(typeSelect);

        if (this.type == 'startEnd') {
            let startInput = $(`
                <div class="form-group">
                    <input class="form-control" placeholder="Start" type="text" value="${this.start}">
                </div>
            `);

            startInput.on('change', (event) => {
                this.start = event.target.value;
            });

            form.append(startInput);

            let endInput = $(`
                <div class="form-group">
                    <input class="form-control" placeholder="End" type="text" value="${this.end}">
                </div>
            `);

            endInput.on('change', (event) => {
                this.end = event.target.value;
            });

            form.append(endInput);
        }

        if (this.type == 'duration') {
            let durationInput = $(`
                <div class="form-group">
                    <input class="form-control" placeholder="Duration" type="text" value="${this.duration}">
                </div>
            `);

            durationInput.on('change', (event) => {
                this.duration = event.target.value;
            });

            form.append(durationInput);
        }

        if (this.type == 'reps') {
            let repsInput = $(`
                <div class="form-group">
                    <input class="form-control" placeholder="Reps" type="text" value="${this.reps}">
                </div>
            `);

            repsInput.on('change', (event) => {
                this.reps = event.target.value;
            });

            form.append(repsInput);
        }

        let rewardInput = $(`
            <div class="form-group">
                <input class="form-control" placeholder="Reward" type="text" value="${this.reward}">
            </div>
        `);

        rewardInput.on('change', (event) => {
            this.reward = event.target.value;
        });

        form.append(rewardInput);

        let saveButton = $('<button class="btn btn-primary mr-3" data-dismiss="modal">Save</button>');

        saveButton.on('click', (event) => {
            if (!this.validate()) {
                event.stopPropagation();
                throw new Error('Validation failed');
            }

            this.render();
            $(document).trigger('goal.save', this);
        });

        form.append(saveButton);

        let deleteButton = $('<button class="btn btn-danger mr-3" data-dismiss="modal">Delete</button>');

        deleteButton.on('click', (event) => {
            this._row.remove();
            $(document).trigger('goal.delete', this);
        });

        form.append(deleteButton);

        let cancelButton = $('<button class="btn" data-dismiss="modal">Cancel</button>');
        form.append(cancelButton);

        let modal = $('#goal-modal');
        modal.find('.modal-body').html(form);
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
}

