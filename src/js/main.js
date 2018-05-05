import Goal from './Goal.js';
import Navbar from './Navbar.js';
import Options from './Options.js';
import Reward from './Reward.js';
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

function addReward() {
    new Reward().renderForm();
}

function showGoals() {
    user.renderGoals();
    navbar.showGoals();
}

function showHistory() {
    user.renderHistory();
    navbar.showHistory();
}

function showRewards() {
    user.renderRewards();
    navbar.showRewards();
}

function showTutorial() {
    new Tutorial().render1();
}

function showOptions() {
    new Options().render();
}

let navbar = new Navbar(),
    userJson = localStorage.getItem('user'),
    user = new User(JSON.parse(userJson));

if (!userJson) {
    showTutorial();
}

navbar.render();
navbar.updatePointsEarned(user.getPointsEarned());
showGoals();

$(document).on('click', '[data-action]', event => {
    let action = $(event.currentTarget).data('action');

    if (action == 'addGoal') {
        addGoal();
    } else if (action == 'addReward') {
        addReward();
    } else if (action == 'showGoals') {
        showGoals();
    } else if (action == 'showHistory') {
        showHistory();
    } else if (action == 'showRewards') {
        showRewards();
    } else if (action == 'showTutorial') {
        showTutorial();
    } else if (action == 'showOptions') {
        showOptions();
    }
});

$(document).on('goal.addDailyCompleteDate', (event, goal) => {
    saveUser();
    navbar.updatePointsEarned(user.getPointsEarned());
});

$(document).on('goal.complete', (event, goal) => {
    saveUser();
    navbar.updatePointsEarned(user.getPointsEarned());
});

$(document).on('goal.reset', (event, goal) => {
    saveUser();
    navbar.updatePointsEarned(user.getPointsEarned());
});

$(document).on('goal.delete', (event, goal) => {
    user.deleteGoal(goal);
    saveUser();
    navbar.updatePointsEarned(user.getPointsEarned());
});

$(document).on('goal.save', (event, goal) => {
    user.addGoal(goal);
    saveUser();
    navbar.updatePointsEarned(user.getPointsEarned());
});

$(document).on('reward.redeem', (event, reward) => {
    saveUser();
    navbar.updatePointsEarned(user.getPointsEarned());
});

$(document).on('reward.delete', (event, reward) => {
    user.deleteReward(reward);
    saveUser();
    navbar.updatePointsEarned(user.getPointsEarned());
});

$(document).on('reward.save', (event, reward) => {
    user.addReward(reward);
    saveUser();
    navbar.updatePointsEarned(user.getPointsEarned());
});

$(document).on('options.clearData', event => {
    localStorage.removeItem('user');
    document.location.reload();
});

window.user = user;
window.saveUser = saveUser;

