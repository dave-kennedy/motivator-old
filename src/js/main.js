import Goal from './Goal.js';
import Options from './Options.js';
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

function showGoals() {
    user.renderGoals();
    goalsNav.show();
    historyNav.hide();
}

function showHistory() {
    user.renderHistory();
    goalsNav.hide();
    historyNav.show();
}

function showTutorial() {
    new Tutorial().render1();
}

function showOptions() {
    new Options().render();
}

let goalsNav = $('#goals-nav'),
    historyNav = $('#history-nav'),
    user = new User(),
    userJson = localStorage.getItem('user');

if (userJson) {
    user.setGoals(JSON.parse(userJson).goals.map(g => new Goal(g)));
} else {
    showTutorial();
}

showGoals();

$(document).on('click', '[data-action]', event => {
    let action = $(event.currentTarget).data('action');

    if (action == 'addGoal') {
        addGoal();
    } else if (action == 'showGoals') {
        showGoals();
    } else if (action == 'showHistory') {
        showHistory();
    } else if (action == 'showTutorial') {
        showTutorial();
    } else if (action == 'showOptions') {
        showOptions();
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

$(document).on('options.deleteGoals', event => {
    localStorage.removeItem('user');
    document.location.reload();
});

$(document).on('click', '[data-toggle="flip"]', event => {
    $(event.currentTarget).children().toggleClass('flip-down flip-up');
});

window.user = user;
window.saveUser = saveUser;

