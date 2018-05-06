import Goal from './Goal.js';
import Reward from './Reward.js';

export default class User {
    constructor (params = {}) {
        if (params.goals && params.goals.length) {
            this.goals = params.goals.map(g => new Goal(g));
        } else {
            this.goals = [];
        }

        if (params.rewards && params.rewards.length) {
            this.rewards = params.rewards.map(r => new Reward(r));
        } else {
            this.rewards = [];
        }
    }

    addGoal(goal) {
        if (this.goals.indexOf(goal) == -1) {
            this.goals.push(goal);
        }
    }

    addReward(reward) {
        if (this.rewards.indexOf(reward) == -1) {
            this.rewards.push(reward);
        }
    }

    deleteGoal(goal) {
        this.goals.splice(this.goals.indexOf(goal), 1);
    }

    deleteReward(reward) {
        this.rewards.splice(this.rewards.indexOf(reward), 1);
    }

    getCompletedGoalsByDate() {
        let completeGoals = this.goals.filter(goal => goal.isCompleted());

        if (!completeGoals.length) {
            return;
        }

        let goalsByDate = {};

        completeGoals.sort((goal1, goal2) => goal1.completeDate.getTime() - goal2.completeDate.getTime()).forEach(goal => {
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
        let totalPoints = this.goals.reduce((total, goal) => total + goal.getPointsEarned(), 0),
            redeemedPoints = this.rewards.reduce((total, reward) => total + reward.getPointsRedeemed(), 0);

        return totalPoints - redeemedPoints;
    }

    renderGoals() {
        let container = $('#container').empty(),
            currentGoals = this.goals.filter(goal => !goal.isCompleted());

        if (!currentGoals.length) {
            return;
        }

        currentGoals.sort((goal1, goal2) => goal1.createDate.getTime() - goal2.createDate.getTime()).forEach(goal => {
            goal.remove();
            goal.render();
        });
    }

    renderHistory(displayDate) {
        let container = $('#container').empty(),
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

        let pagination = $('<div class="pagination justify-content-center mb-3"></div>').appendTo(container);

        if (prevDate) {
            $(`<div class="page-item">
                    <a class="page-link">&laquo;</a>
                </div>`).appendTo(pagination).on('click', () => this.renderHistory(prevDate));
        }

        $(`<div class="page-item disabled">
                <a class="page-link">${displayDate}</a>
            </div>`).appendTo(pagination);

        if (nextDate) {
            $(`<div class="page-item">
                    <a class="page-link">&raquo;</a>
                </div>`).appendTo(pagination).on('click', () => this.renderHistory(nextDate));
        }

        completeGoals[displayDate].forEach(goal => {
            goal.remove();
            goal.render();
        });
    }

    renderRewards() {
        $('#container').empty();

        Array.from(this.rewards).sort((reward1, reward2) => reward1.createDate.getTime - reward2.createDate.getTime()).forEach(reward => {
            reward.remove();
            reward.render();
        });
    }
}

