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

function hideHistory() {
    user.hideGoals(true);
    user.showGoals(false);
    backButton.hide();
    historyButton.show();
    addGoalButton.show();
}

function showHistory() {
    user.hideGoals(false);
    user.showGoals(true);
    backButton.show();
    historyButton.hide();
    addGoalButton.hide();
}

let user = new User(),
    userJson = localStorage.getItem('user'),
    backButton = $('#back-button'),
    historyButton = $('#history-button'),
    addGoalButton = $('#add-goal-button');

if (userJson) {
    user.setGoals(JSON.parse(userJson).goals.map(g => new Goal(g)));
    user.renderGoals();
} else {
    let tutorial = new Tutorial();
    tutorial.render1();
}

hideHistory();

backButton.on('click', event => {
    hideHistory();
});

historyButton.on('click', event => {
    showHistory();
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

$(document).on('goal.rewardClaimed', (event, goal) => {
    saveUser();
});

window.user = user;
window.saveUser = saveUser;

