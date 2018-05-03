export default class User {
    constructor (params = {}) {
        this.goals = params.goals || [];
    }

    addGoal(goal) {
        if (this.goals.indexOf(goal) == -1) {
            this.goals.push(goal);
        }
    }

    deleteGoal(goal) {
        this.goals.splice(this.goals.indexOf(goal), 1);
    }

    getCompletedGoalsByDate() {
        let completeGoals = this.goals.filter(goal => {
            return goal.isCompleted();
        });

        if (!completeGoals.length) {
            return;
        }

        let goalsByDate = {};

        completeGoals.sort((goal1, goal2) => {
            return goal1.completeDate.getTime() - goal2.completeDate.getTime();
        }).forEach(goal => {
            let completeDate = goal.completeDate.toLocaleDateString();

            if (!goalsByDate[completeDate]) {
                goalsByDate[completeDate] = [goal];
            } else {
                goalsByDate[completeDate].push(goal);
            }
        });

        return goalsByDate;
    }

    getPointsEarned() {
        return this.goals.filter(goal => {
            return goal.isCompleted();
        }).reduce((total, goal) => {
            return total + goal.points;
        }, 0);
    }

    renderGoals() {
        let goalsList = $('#goals-list').empty();

        let currentGoals = this.goals.filter(goal => {
            return !goal.isCompleted();
        });

        if (!currentGoals.length) {
            return;
        }

        currentGoals.sort((goal1, goal2) => {
            return goal1.createDate.getTime() - goal2.createDate.getTime();
        }).forEach(goal => {
            goal.remove();
            goal.render();
        });
    }

    renderHistory(displayDate) {
        let goalsList = $('#goals-list').empty(),
            completeGoals = this.getCompletedGoalsByDate();

        if (!completeGoals || !Object.keys(completeGoals).length) {
            return;
        }

        let completeDates = Object.keys(completeGoals);

        if (!displayDate) {
            displayDate = completeDates[completeDates.length - 1];
        }

        let prevDate = completeDates[completeDates.indexOf(displayDate) - 1],
            nextDate = completeDates[completeDates.indexOf(displayDate) + 1];

        let pagination = $('<div class="pagination justify-content-center mb-3"></div>');
        goalsList.append(pagination);

        if (prevDate) {
            let prevButton = $('<div class="page-item"><a class="page-link">&laquo;</a></div>');
            pagination.append(prevButton);

            prevButton.on('click', event => {
                this.renderHistory(prevDate);
            });
        }

        let dateButton = $(`<div class="page-item disabled"><a class="page-link">${displayDate}</a></div>`);
        pagination.append(dateButton);

        if (nextDate) {
            let nextButton = $('<div class="page-item"><a class="page-link">&raquo;</a></div>');
            pagination.append(nextButton);

            nextButton.on('click', event => {
                this.renderHistory(nextDate);
            });
        }

        completeGoals[displayDate].forEach(goal => {
            goal.remove();
            goal.render();
        });
    }

    setGoals(goals) {
        this.goals = goals;
    }
}

