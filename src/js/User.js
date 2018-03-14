import Goal from './Goal.js';

export default class User {
    constructor (params) {
        params = params || {};
        this.goals = params.goals;
    }

    addGoal(goal) {
        if (this.goals.indexOf(goal) == -1) {
            this.goals.push(goal);
        }
    }

    deleteGoal(goal) {
        this.goals.splice(this.goals.indexOf(goal), 1);
    }

    renderGoals() {
        this.goals.forEach((goal) => {
            goal.render();
        });
    }

    setGoals(goals) {
        this.goals = goals;
    }
}

