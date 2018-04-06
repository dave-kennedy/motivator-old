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
    backButton = $('#back-button'),
    historyButton = $('#history-button'),
    addGoalButton = $('#add-goal-button');

if (userJson) {
    user.setGoals(JSON.parse(userJson).goals.map(g => new Goal(g)));
    user.renderGoals();
    user.hideGoals(true);
    backButton.hide();
} else {
    let tutorial = new Tutorial();
    tutorial.render1();
}

backButton.on('click', event => {
    user.hideGoals(true);
    user.showGoals(false);
    backButton.hide();
    historyButton.show();
    addGoalButton.show();
});

historyButton.on('click', event => {
    user.hideGoals(false);
    user.showGoals(true);
    backButton.show();
    historyButton.hide();
    addGoalButton.hide();
});

addGoalButton.on('click', event => {
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

