export default class Goal {
    constructor (params = {}) {
        this.completeDate = params.completeDate ? new Date(params.completeDate) : null;
        this.createDate = params.createDate ? new Date(params.createDate) : null;
        this.description = params.description || '';
        this.draft = params.draft == undefined ? true : params.draft;
        this.name = params.name || '';
        this.points = params.points || 0;

        // daily streaks
        if (params.dailyCompleteDates && params.dailyCompleteDates.length) {
            this.dailyCompleteDates = params.dailyCompleteDates.map(d => new Date(d));
        } else {
            this.dailyCompleteDates = [];
        }

        this.dailyDuration = params.dailyDuration || 0;
        this.dailyBonusPoints = params.dailyBonusPoints || 0;

        // private fields, not saved
        this._elem = null;
    }

    complete() {
        this.completeDate = new Date();
        this._elem.find('.icon:first').flip(() => this._elem.fadeOut(() => this.remove()));
        $(document).trigger('goal.complete', this);
    }

    dailyComplete() {
        this.dailyCompleteDates.push(new Date());

        if (this.dailyDuration == this.getDailyStreak()) {
            this.complete();
            return;
        }

        this._elem.find('.icon:first').flip(icon => icon.flip());
        $(document).trigger('goal.dailyComplete', this);
    }

    reset() {
        this.completeDate = null;

        if (this.isDaily()) {
            this.dailyCompleteDates = [];
        }

        this._elem.find('.icon:first').flip(() => this._elem.fadeOut(() => this.remove()));
        $(document).trigger('goal.reset', this);
    }

    delete() {
        this.remove();
        $(document).trigger('goal.delete', this);
    }

    // TODO: fix timezone
    getDailyStreak() {
        let msPerDay = 1000*60*60*24,
            completeDates = Array.from(this.dailyCompleteDates).sort((date1, date2) => date1.getTime() - date2.getTime());

        return completeDates.reduce((total, date, i) => {
            if (i == 0) {
                return 1;
            }

            // calculate the number of days between the previous date and this one
            let prevDate = completeDates[i - 1],
                elapsedDays = Math.floor(date.getTime()/msPerDay) - Math.floor(prevDate.getTime()/msPerDay);

            // if less than one day has elapsed, then it was completed more than once on the same day
            // don't increment the streak counter
            if (elapsedDays == 0) {
                return total;
            }

            // if exactly one day has elapsed, then the goal was completed on two consecutive days
            // increment the streak counter
            if (elapsedDays == 1) {
                return total + 1;
            }

            // if more than one day has elapsed, then the streak has been broken
            // reset the streak counter
            return 0;
        }, 0);
    }

    getPointsEarned() {
        if (!this.dailyCompleteDates.length && !this.isCompleted()) {
            return 0;
        }

        if (this.dailyCompleteDates.length && this.isCompleted()) {
            return this.dailyCompleteDates.length*this.points + this.dailyBonusPoints;
        }

        if (this.dailyCompleteDates.length) {
            return this.dailyCompleteDates.length*this.points;
        }

        return this.points;
    }

    isCompleted() {
        return this.completeDate != null;
    }

    isDaily() {
        return this.dailyDuration > 0;
    }

    remove() {
        if (this._elem) {
            this._elem.remove();
            this._elem = null;
        }
    }

    render() {
        let elem = $('<div class="media border-bottom mb-3 pb-3"></div>');

        if (this.isCompleted()) {
            let resetButton = $(`<div class="icon mr-3">
                    <span class="flip-up icon icon-check"></span>
                    <span class="flip-down icon icon-circle"></span>
                </div>`);
            elem.append($('<div></div>').append(resetButton));

            resetButton.on('click', () => this._promptReset());
        } else if (this.isDaily()) {
            let dailyCompleteButton = $(`<div class="icon mr-3">
                    <span class="flip-up icon icon-repeat"></span>
                    <span class="flip-down icon icon-check"></span>
                </div>`);
            elem.append($('<div></div>').append(dailyCompleteButton));

            dailyCompleteButton.on('click', () => this.dailyComplete());
        } else {
            let completeButton = $(`<div class="icon mr-3">
                    <span class="flip-up icon icon-circle"></span>
                    <span class="flip-down icon icon-check"></span>
                </div>`);
            elem.append($('<div></div>').append(completeButton));

            completeButton.on('click', () => this.complete());
        }

        let body = $('<div class="media-body"></div>');
        elem.append(body);

        body.on('click', () => this.renderForm());

        body.append(`<div class="h5">${this.name}</div>`);

        if (this.description) {
            body.append(`<div class="text-secondary">${this.description}</div>`);
        }

        let details = $('<div class="text-secondary"></div>');
        body.append(details);

        if (this.points) {
            details.append(`<span class="icon icon-sm icon-star-sm"></span> ${this.points} points`);
        }

        if (this.isDaily()) {
            details.append(`<span class="icon icon-sm icon-fast-forward-sm ml-5"></span> ${this.getDailyStreak()}/${this.dailyDuration} days completed`);

            if (this.dailyBonusPoints) {
                details.append(`<span class="icon icon-sm icon-trophy-sm ml-5"></span> ${this.dailyBonusPoints} bonus points`);
            }
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

        let dailyButton = $('<div><a class="collapse-toggle collapsed" data-toggle="collapse" href="#daily">Daily</a></div>');
        form.append(dailyButton);

        let daily = $('<div class="collapse" id="daily"></div>');
        form.append(daily);

        let dailyDurationInput = $(`<input autocapitalize="on" class="form-control" name="dailyDuration" type="number" value="${this.dailyDuration}">`);
        daily.append($('<div class="form-group"></div>').append('<label>Duration</label>', dailyDurationInput, '<small class="form-text text-muted">How many days in a row should this goal be completed?'));

        let dailyBonusPointsInput = $(`<input autocapitalize="on" class="form-control" name="dailyBonusPoints" type="number" value="${this.dailyBonusPoints}">`);
        daily.append($('<div class="form-group"></div>').append('<label>Bonus points</label>', dailyBonusPointsInput, '<small class="form-text text-muted">How many points should be awarded when this goal is completed every day for the duration above?'));

        if (this.dailyCompleteDates.length) {
            let group = $(`<div class="form-group">
                    <label class="d-block">Dates completed</label>
                </div>`);
            daily.append(group);

            this.dailyCompleteDates.forEach((date, i) => {
                let dailyCompleteDateInput = $(`<input class="d-inline form-control w-50" name="dailyCompleteDate[${i}]" type="date" value="${this._getISODate(date)}">`);
                let dailyCompleteTimeInput = $(`<input class="d-inline form-control w-50" name="dailyCompleteTime[${i}]" type="time" value="${this._getISOTime(date)}">`);
                group.append(dailyCompleteDateInput, dailyCompleteTimeInput);
            });
        }

        if (!this.draft) {
            let detailsButton = $('<div><a class="collapse-toggle collapsed" data-toggle="collapse" href="#details">Details</a></div>');
            form.append(detailsButton);

            let details = $('<div class="collapse" id="details"></div>');
            form.append(details);

            let createDateInput = $(`<input class="d-inline form-control w-50" name="createDate" type="date" value="${this._getISODate(this.createDate)}">`);
            let createTimeInput = $(`<input class="d-inline form-control w-50" name="createTime" type="time" value="${this._getISOTime(this.createDate)}">`);
            details.append($('<div class="form-group"></div>').append('<label class="d-block">Created</label>', createDateInput, createTimeInput));

            if (this.isCompleted()) {
                let completeDateInput = $(`<input class="d-inline form-control w-50" name="completeDate" type="date" value="${this._getISODate(this.completeDate)}">`);
                let completeTimeInput = $(`<input class="d-inline form-control w-50" name="completeTime" type="time" value="${this._getISOTime(this.completeDate)}">`);
                details.append($('<div class="form-group"></div>').append('<label class="d-block">Completed</label>', completeDateInput, completeTimeInput));
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
            this.completeDate = params.completeDate && params.completeTime ? new Date(`${params.completeDate}T${params.completeTime}`) : null;
            this.createDate = params.createDate && params.createTime ? new Date(`${params.createDate}T${params.createTime}`) : null;
        }

        this.description = params.description || '';
        this.name = params.name || '';
        this.points = parseInt(params.points) || 0;

        this.dailyCompleteDates = [];

        Object.keys(params).filter(key => key.startsWith('dailyCompleteDate')).forEach(key => {
            let dailyCompleteDate = params[key],
                dailyCompleteTime = params[key.replace('Date', 'Time')];

            if (dailyCompleteDate && dailyCompleteTime) {
                this.dailyCompleteDates.push(new Date(`${dailyCompleteDate}T${dailyCompleteTime}`));
            }
        });

        this.dailyDuration = parseInt(params.dailyDuration) || 0;
        this.dailyBonusPoints = parseInt(params.dailyBonusPoints) || 0;

        this.render();
        $(document).trigger('goal.save', this);
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
        modal.find('.modal-body').html('<p>Are you sure you want to delete this goal and its history?</p>');

        let footer = modal.find('.modal-footer').empty();

        let yesButton = $('<button class="btn btn-danger mr-auto" data-dismiss="modal">Yes</button>');
        footer.append(yesButton);

        yesButton.on('click', () => this.delete());

        let noButton = $('<button class="btn btn-primary" data-dismiss="modal">No</button>');
        footer.append(noButton);

        modal.modal();
    }

    _promptReset() {
        let modal = $('#modal');
        modal.find('.modal-title').html('Confirm reset');
        modal.find('.modal-body').html(`<p>Are you sure you want to reset this goal?
                ${this.isDaily() ? 'All daily completed dates will be lost.' : ''}</p>`);

        let footer = modal.find('.modal-footer').empty();

        let yesButton = $('<button class="btn btn-danger mr-auto" data-dismiss="modal">Yes</button>');
        footer.append(yesButton);

        yesButton.on('click', () => this.reset());

        let noButton = $('<button class="btn btn-primary" data-dismiss="modal">No</button>');
        footer.append(noButton);

        modal.modal();
    }
}

