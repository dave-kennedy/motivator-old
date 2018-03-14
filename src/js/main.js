import Goal from './Goal.js';
import Tutorial from './Tutorial.js';
import User from './User.js';

function saveUser() {
    localStorage.setItem('user', JSON.stringify(user, (key, value) => {
        if (!key.startsWith('_')) {
            return value;
        }
    }));
}

let user = new User(),
    userJson = localStorage.getItem('user'),
    addGoalButton = $('#add-goal-button');

if (userJson) {
    user.setGoals(JSON.parse(userJson).goals.map(g => new Goal(g)));
    user.renderGoals();
} else {
    let tutorial = new Tutorial();
    tutorial.render1();
}

addGoalButton.on('click', (event) => {
    let goal = new Goal();
    goal.renderForm();
});

$(document).on('goal.complete', (event, goal) => {
    saveUser();
});

$(document).on('goal.delete', (event, goal) => {
    user.deleteGoal(goal);
    saveUser();
});

$(document).on('goal.save', (event, goal) => {
    user.addGoal(goal);
    saveUser();
});

window.user = user;
window.saveUser = saveUser;

