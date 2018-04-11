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
        this.goals.sort((goal1, goal2) => {
            return goal1[sortBy] > goal2[sortBy];
        }).forEach(goal => {
            if (goal.isCompleted() == complete) {
                goal.render();
            } else {
                goal.remove();
            }
        });
    }

    setGoals(goals) {
        this.goals = goals;
    }
}

