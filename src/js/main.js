import Goal from './Goal.js';
import Navbar from './Navbar.js';
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
    navbar.showGoals();
}

function showHistory() {
    user.renderHistory();
    navbar.showHistory();
}

function showTutorial() {
    new Tutorial().render1();
}

function showOptions() {
    new Options().render();
}

let navbar = new Navbar(),
    user = new User(),
    userJson = localStorage.getItem('user');

if (userJson) {
    user.setGoals(JSON.parse(userJson).goals.map(g => new Goal(g)));
} else {
    showTutorial();
}


navbar.render();
navbar.updatePointsEarned(user.getPointsEarned());
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
    navbar.updatePointsEarned(user.getPointsEarned());
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

