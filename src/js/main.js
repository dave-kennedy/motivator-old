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
    user.hideGoals(false);
    user.showGoals(true);
    historyNav.show();
    homeNav.hide();
}

function showTutorial() {
    new Tutorial().render1();
}

function showHome() {
    user.hideGoals(true);
    user.showGoals(false);
    historyNav.hide();
    homeNav.show();
}

function showMenu() {
    menu.flyout('show');
}

function hideMenu() {
    menu.flyout('hide');
}

let user = new User(),
    userJson = localStorage.getItem('user'),
    menu = $('#menu'),
    homeNav = $('#home-nav'),
    historyNav = $('#history-nav');

if (userJson) {
    user.setGoals(JSON.parse(userJson).goals.map(g => new Goal(g)));
    user.renderGoals();
} else {
    showTutorial();
}

showHome();

$(document).on('click', event => {
    let action = $(event.target).data('action') || $(event.target).parent().data('action');

    if (action == 'addGoal') {
        addGoal();
        hideMenu();
    } else if (action == 'showHistory') {
        showHistory();
        hideMenu();
    } else if (action == 'showTutorial') {
        showTutorial();
        hideMenu();
    } else if (action == 'showHome') {
        showHome();
    } else if (action == 'showMenu') {
        showMenu();
    }
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

