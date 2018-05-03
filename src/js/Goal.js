export default class Goal {
    constructor (params = {}) {
        this.completeDate = params.completeDate ? new Date(params.completeDate) : null;
        this.createDate = params.createDate ? new Date(params.createDate) : null;
        this.description = params.description || '';
        this.draft = params.draft == undefined ? true : params.draft;
        this.name = params.name || '';
        this.repeat = params.repeat == undefined ? false : params.repeat;

        if (!params.points && params.reward) {
            this.points = this._convertRewardToPoints(params);
        } else if (!params.points) {
            this.points = 0;
        } else {
            this.points = params.points;
        }

        this._elem = null;
    }

    complete() {
        this.completeDate = this.isCompleted() ? null : new Date();
        $(document).trigger('goal.complete', this);

        if (this.isCompleted() && this.repeat) {
            let goal = new Goal({
                createDate: this.completeDate,
                description: this.description,
                draft: false,
                name: this.name,
                points: this.points,
                repeat: true
            });

            goal.render();
            $(document).trigger('goal.save', goal);
        }
    }

    delete() {
        this.remove();
        $(document).trigger('goal.delete', this);
    }

    isCompleted() {
        return this.completeDate != null;
    }

    remove() {
        if (this._elem) {
            this._elem.remove();
            this._elem = null;
        }
    }

    render() {
        let elem = $('<div class="media border-bottom mb-3 pb-3"></div>');

        let completeButton = $(`<div class="icon mr-3" data-toggle="flip">
                <span class="${this.isCompleted() ? 'flip-down' : 'flip-up'} icon icon-circle"></span>
                <span class="${this.isCompleted() ? 'flip-up' : 'flip-down'} icon icon-check"></span>
            </div>`);
        elem.append($('<div></div>').append(completeButton));

        completeButton.on('click', event => {
            this.complete();
        }).one('transitionend', '.flip-down, .flip-up', event => {
            this._elem.fadeOut(() => {
                this.remove();
            });
        });

        let body = $('<div class="media-body"></div>');
        elem.append(body);

        body.on('click', event => {
            this.renderForm();
        });

        body.append(`<div class="h5">${this.name} ${this.repeat ? '<span class="icon icon-sm icon-repeat-sm"></span>' : ''}</div>`);

        if (this.description) {
            body.append(`<div class="text-secondary">${this.description}</div>`);
        }

        if (this.points) {
            body.append(`<div>${this.points} point${this.points > 1 ? 's' : ''}</div>`);
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

        let body = modal.find('.modal-body').empty(),
            form = $('<form></form>');
        body.append(form);

        let nameInput = $(`<input autocapitalize="on" class="form-control" name="name" type="text" value="${this.name}">`);
        form.append($('<div class="form-group"></div>').append('<label>Name *</label>', nameInput));

        let descriptionInput = $(`<textarea autocapitalize="on" class="form-control" name="description">${this.description}</textarea>`);
        form.append($('<div class="form-group"></div>').append('<label>Description</label>', descriptionInput));

        let pointsInput = $(`<input autocapitalize="on" class="form-control" name="points" type="number" value="${this.points}">`);
        form.append($('<div class="form-group"></div>').append('<label>Points</label>', pointsInput));

        let repeatInput = $(`<input autocapitalize="on" class="mr-1" name="repeat" type="checkbox" ${this.repeat ? 'checked' : ''}>`);
        form.append($('<div class="form-group"></div>').append(repeatInput, '<label>Repeat</label>'));

        let createDateInput, createTimeInput, completeDateInput, completeTimeInput;

        if (!this.draft) {
            let detailsButton = $('<div><a class="collapse-toggle collapsed" data-toggle="collapse" href="#details">Details</a></div>');
            form.append(detailsButton);

            let details = $('<div class="collapse" id="details"></div>');
            form.append(details);

            createDateInput = $(`<input class="d-inline form-control w-50" name="createDate" type="date" value="${this._getISODate(this.createDate)}">`);
            createTimeInput = $(`<input class="d-inline form-control w-50" name="createTime" type="time" value="${this._getISOTime(this.createDate)}">`);
            details.append($('<div class="form-group"></div>').append('<label class="d-block">Created</label>', createDateInput, createTimeInput));

            if (this.isCompleted()) {
                completeDateInput = $(`<input class="d-inline form-control w-50" name="completeDate" type="date" value="${this._getISODate(this.completeDate)}">`);
                completeTimeInput = $(`<input class="d-inline form-control w-50" name="completeTime" type="time" value="${this._getISOTime(this.completeDate)}">`);
                details.append($('<div class="form-group"></div>').append('<label class="d-block">Completed</label>', completeDateInput, completeTimeInput));
            }
        }

        let footer = modal.find('.modal-footer').empty();

        if (!this.draft) {
            let deleteButton = $('<button class="btn btn-danger mr-auto" data-dismiss="modal">Delete</button>');
            footer.append(deleteButton);

            deleteButton.on('click', event => {
                this.delete();
            });
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
            this.completeDate = params.completeDate && params.completeTime ? new Date(`${params.completeDate}T${params.completeTime}`) : null;
        }

        this.description = params.description || '';
        this.name = params.name || '';
        this.points = parseInt(params.points) || 0;
        this.repeat = params.repeat == undefined ? false : params.repeat;
        this.render();
        $(document).trigger('goal.save', this);
    }

    validate(params) {
        return params.name.trim() != '';
    }

    // TODO: this is a temporary fix to migrate rewards saved prior to cab7a41
    _convertRewardToPoints(params) {
        let points = 0,
            reward = params.reward;

        if (!isNaN(reward)) {
            console.log(`Reward "${params.reward}" converted to ${points} points`);
            return reward;
        }

        if (typeof reward != 'string') {
            $('.container:first').append(`<div class="alert alert-danger">
                    Error: could not convert reward to points. Please edit this goal or send the following information to the developer.<br>
                    Name: ${params.name}<br>
                    Create date: ${params.createDate}<br>
                    Reward: ${params.reward}
                </div>`);
            return 0;
        }

        reward = reward.trim();

        if (reward.startsWith('$')) {
            reward = reward.substr(1);
        }

        if (!(points = parseInt(reward))) {
            $('.container:first').append(`<div class="alert alert-danger">
                    Error: could not convert reward to points. Please edit this goal or send the following information to the developer.<br>
                    Name: ${params.name}<br>
                    Create date: ${params.createDate}<br>
                    Reward: ${params.reward}
                </div>`);
            return 0;
        }

        console.log(`Reward "${params.reward}" converted to ${points} points`);
        return points;
    }

    _deserialize(form) {
        let obj = {};
        form.find('input, select, textarea').each((i, elem) => {
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
}

