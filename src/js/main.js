import Goal from './Goal.js';

function saveGoals() {
    localStorage.setItem('goals', JSON.stringify(goals, (key, value) => {
        if (!key.startsWith('_')) {
            return value;
        }
    }));
}

let goals = [],
    goalsJson = localStorage.getItem('goals'),
    addGoalButton = $('#add-goal-button'),
    resetGoalsButton = $('#reset-goals-button');

if (goalsJson) {
    goals = JSON.parse(goalsJson).map(g => new Goal(g));
    goals.forEach((goal) => {
        goal.render();
    });
}

addGoalButton.on('click', (event) => {
    let goal = new Goal();
    goal.renderForm();
});

resetGoalsButton.on('click', (event) => {
    goals.forEach((goal) => {
        goal.reset();
    });

    saveGoals();
});

$(document).on('goal.complete', (event, goal) => {
    saveGoals();
});

$(document).on('goal.delete', (event, goal) => {
    goals.splice(goals.indexOf(goal), 1);
    saveGoals();
});

$(document).on('goal.save', (event, goal) => {
    if (goals.indexOf(goal) == -1) {
        goals.push(goal);
    }

    saveGoals();
});

window.goals = goals;
window.saveGoals = saveGoals;

