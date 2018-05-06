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
            $(`<div class="icon mr-3">
                    <span class="flip-up icon icon-check"></span>
                    <span class="flip-down icon icon-circle"></span>
                </div>`).appendTo(elem).on('click', () => this._promptReset());
        } else if (this.isDaily()) {
            $(`<div class="icon mr-3">
                    <span class="flip-up icon icon-repeat"></span>
                    <span class="flip-down icon icon-check"></span>
                </div>`).appendTo(elem).on('click', () => this.dailyComplete());
        } else {
            $(`<div class="icon mr-3">
                    <span class="flip-up icon icon-circle"></span>
                    <span class="flip-down icon icon-check"></span>
                </div>`).appendTo(elem).on('click', () => this.complete());
        }

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
        modal.find('.modal-title').html(`${this.draft ? 'New goal' : 'Edit goal'}`);

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
                <div>
                    <a class="collapse-toggle collapsed" data-toggle="collapse" href="#daily">Daily</a>
                </div>
            </form>`).appendTo(body);

        let daily = $(`<div class="collapse" id="daily">
                <div class="form-group">
                    <label>Duration</label>
                    <input autocapitalize="on" class="form-control" name="dailyDuration" type="number" value="${this.dailyDuration}">
                    <small class="form-text text-muted">How many days in a row should this goal be completed?</small>
                </div>
                <div class="form-group">
                    <label>Bonus points</label>
                    <input autocapitalize="on" class="form-control" name="dailyBonusPoints" type="number" value="${this.dailyBonusPoints}">
                    <small class="form-text text-muted">How many points should be awarded when this goal is completed every day for the duration above?</small>
                </div>
            </div>`).appendTo(form);

        if (this.dailyCompleteDates.length) {
            let group = $(`<div class="form-group">
                    <label>Dates completed</label>
                </div>`).appendTo(daily);

            this.dailyCompleteDates.forEach((date, i) => {
                $(`<div class="form-row mb-2">
                        <div class="col-6">
                            <input class="form-control" name="dailyCompleteDate[${i}]" type="date" value="${this._getISODate(date)}">
                        </div>
                        <div class="col-6">
                            <input class="form-control" name="dailyCompleteTime[${i}]" type="time" value="${this._getISOTime(date)}">
                        </div>
                    </div>`).appendTo(group);
            });
        }

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

            if (this.isCompleted()) {
                $(`<div class="form-group">
                        <label>Completed</label>
                        <div class="form-row">
                            <div class="col-6">
                                <input class="form-control" name="completeDate" type="date" value="${this._getISODate(this.completeDate)}">
                            </div>
                            <div class="col-6">
                                <input class="form-control" name="completeTime" type="time" value="${this._getISOTime(this.completeDate)}">
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
        $('<button class="btn btn-danger mr-auto" data-dismiss="modal">Yes</button>').appendTo(footer).on('click', () => this.delete());
        $('<button class="btn btn-primary" data-dismiss="modal">No</button>').appendTo(footer);

        modal.modal();
    }

    _promptReset() {
        let modal = $('#modal');
        modal.find('.modal-title').html('Confirm reset');
        modal.find('.modal-body').html(`<p>Are you sure you want to reset this goal?
                ${this.isDaily() ? 'All daily completed dates will be lost.' : ''}</p>`);

        let footer = modal.find('.modal-footer').empty();
        $('<button class="btn btn-danger mr-auto" data-dismiss="modal">Yes</button>').appendTo(footer).on('click', () => this.reset());
        $('<button class="btn btn-primary" data-dismiss="modal">No</button>').appendTo(footer);

        modal.modal();
    }
}

