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
    menuButton.show();
}

function showHistory() {
    user.hideGoals(false);
    user.showGoals(true);
    backButton.show();
    menuButton.hide();
}

let user = new User(),
    userJson = localStorage.getItem('user'),
    menu = $('#menu'),
    menuButton = $('#menu-button'),
    backButton = $('#back-button'),
    addGoalButton = $('#add-goal-button'),
    historyButton = $('#history-button');

if (userJson) {
    user.setGoals(JSON.parse(userJson).goals.map(g => new Goal(g)));
    user.renderGoals();
} else {
    let tutorial = new Tutorial();
    tutorial.render1();
}

hideHistory();

menuButton.on('click', event => {
    menu.flyout('toggle');
});

backButton.on('click', event => {
    hideHistory();
});

addGoalButton.on('click', event => {
    let goal = new Goal();
    goal.renderForm();
    menu.flyout('hide');
});

historyButton.on('click', event => {
    showHistory();
    menu.flyout('hide');
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

