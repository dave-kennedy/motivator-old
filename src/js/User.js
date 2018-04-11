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

    renderGoals(complete, sortBy = 'createDate') {
        let goalsList = $('#goals-list').empty(),
            prevDate;

        if (sortBy != 'createDate' && sortBy != 'completeDate' && sortBy != 'rewardClaimDate') {
            sortBy = 'createDate';
        }

        this.goals.sort((goal1, goal2) => {
            return goal1[sortBy] > goal2[sortBy];
        }).forEach(goal => {
            goal.remove();

            if (!goal[sortBy] || goal.isCompleted() != complete) {
                return;
            }

            let date = goal[sortBy].toLocaleDateString();

            if (prevDate != date) {
                prevDate = date;
                goalsList.append(`<div class="badge badge-secondary mb-3">${date}</div`);
            }

            goal.render();
        });
    }

    setGoals(goals) {
        this.goals = goals;
    }
}

