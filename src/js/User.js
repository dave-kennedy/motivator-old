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

    renderGoals(sortBy = 'createDate') {
        let goalsList = $('#goals-list').empty();

        if (sortBy != 'createDate' && sortBy != 'completeDate' && sortBy != 'rewardClaimDate') {
            throw new TypeError('Unsupported sort key');
        }

        let currentGoals = this.goals.filter(goal => {
            return !goal.isCompleted() && goal[sortBy] != null;
        });

        if (!currentGoals.length) {
            return;
        }

        currentGoals.sort((goal1, goal2) => {
            return goal1[sortBy] > goal2[sortBy];
        }).forEach(goal => {
            goal.remove();
            goal.render();
        });
    }

    renderHistory(sortBy = 'completeDate', displayDate) {
        let goalsList = $('#goals-list').empty();

        if (sortBy != 'createDate' && sortBy != 'completeDate' && sortBy != 'rewardClaimDate') {
            throw new TypeError('Unsupported sort key');
        }

        let completedGoals = this.goals.filter(goal => {
            return goal.isCompleted() && goal[sortBy] != null;
        });

        if (!completedGoals.length) {
            return;
        }

        completedGoals.sort((goal1, goal2) => {
            return goal1[sortBy] > goal2[sortBy];
        });

        if (!displayDate) {
            displayDate = completedGoals[0][sortBy];
        }

        let prevDate = completedGoals.map(goal => {
            return goal[sortBy];
        }).find(goalDate => {
            return displayDate.getTime() - goalDate.getTime() > 3600000;
        });

        let nextDate = completedGoals.map(goal => {
            return goal[sortBy];
        }).find(goalDate => {
            return goalDate.getTime() - displayDate.getTime() > 3600000;
        });

        let pagination = $('<div class="pagination justify-content-center mb-3"></div>');
        goalsList.append(pagination);

        if (prevDate) {
            let prevButton = $('<div class="page-item"><a class="page-link">&laquo;</a></div>');
            pagination.append(prevButton);

            prevButton.on('click', event => {
                this.renderHistory(sortBy, prevDate);
            });
        }

        let dateButton = $(`<div class="page-item disabled"><a class="page-link">${displayDate.toLocaleDateString()}</a></div>`);
        pagination.append(dateButton);

        if (nextDate) {
            let nextButton = $('<div class="page-item"><a class="page-link">&raquo;</a></div>');
            pagination.append(nextButton);

            nextButton.on('click', event => {
                this.renderHistory(sortBy, nextDate);
            });
        }

        completedGoals.filter(goal => {
            return goal[sortBy].toLocaleDateString() == displayDate.toLocaleDateString();
        }).forEach(goal => {
            goal.remove();
            goal.render();
        });
    }

    setGoals(goals) {
        this.goals = goals;
    }
}

