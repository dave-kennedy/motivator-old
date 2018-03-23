export default class User {
    constructor (params) {
        params = params || {};
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

    renderGoals() {
        this.goals.forEach((goal) => {
            goal.render();
        });
    }

    renderRewards() {
        let modal = $('#modal');

        modal.find('.modal-title').html('Rewards earned');

        let body = modal.find('.modal-body').html('');

        this.goals.forEach((goal) => {
            if (goal.complete) {
                body.append(`<p>${goal.reward}</p>`);
            }
        });

        modal.find('.modal-footer').html('');

        modal.modal();
    }

    setGoals(goals) {
        this.goals = goals;
    }
}

