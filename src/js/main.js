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

function addGoal() {
    new Goal().renderForm();
}

function showHistory() {
    user.renderHistory();
    historyNav.show();
    homeNav.hide();
}

function showHome() {
    user.renderGoals();
    historyNav.hide();
    homeNav.show();
}

function showTutorial() {
    new Tutorial().render1();
}

let historyNav = $('#history-nav'),
    homeNav = $('#home-nav'),
    user = new User(),
    userJson = localStorage.getItem('user');

if (userJson) {
    user.setGoals(JSON.parse(userJson).goals.map(g => new Goal(g)));
} else {
    showTutorial();
}

showHome();

$(document).on('click', '[data-action]', event => {
    let action = $(event.currentTarget).data('action');

    if (action == 'addGoal') {
        addGoal();
    } else if (action == 'showHistory') {
        showHistory();
    } else if (action == 'showHome') {
        showHome();
    } else if (action == 'showTutorial') {
        showTutorial();
    }
});

$(document).on('goal.complete', (event, goal) => {
    saveUser();
});

$(document).on('goal.rewardClaimed', (event, goal) => {
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

