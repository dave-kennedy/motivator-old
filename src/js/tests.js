import Goal from './Goal.js';
import Reward from './Reward.js';

function assertEqual(expected, actual) {
    if (expected !== actual) {
        throw new Error('Expected ' + expected + ' but was ' + actual);
    }
}

function renderPass(name) {
    var el = document.createElement('div');
    el.className = 'alert alert-success m-2 p-2';
    el.innerHTML = `&#x2713; ${name} passed`;
    document.body.appendChild(el);
}

function renderFail(name, err) {
    var el = document.createElement('div');
    el.className = 'alert alert-danger m-2 p-2';
    el.innerHTML = `&#x2717; ${name} failed - ${err.name}: ${err.message} (see console for stack trace)`;
    document.body.appendChild(el);
}

// used to generate dates based on the current date (e.g. today, yesterday, two days ago)
// necessary for testing daily streaks
function makeDate(daysAgo, hh = 0, mm = 0, ss = 0) {
    let date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hh);
    date.setMinutes(mm);
    date.setSeconds(ss);
    return date;
}

let testSuite = [];

testSuite.push(function testGetDailyStreak_mostRecentToday() {
    let goal = new Goal({
        dailyCompleteDates: [
            makeDate(4, 23), // there's a gap between this date and the next, so it shouldn't count
            makeDate(2, 1),
            makeDate(1, 23),
            makeDate(0, 1)
        ],
        dailyDuration: 5
    });

    assertEqual(3, goal.getDailyStreak());
});

testSuite.push(function testGetDailyStreak_mostRecentYesterday() {
    let goal = new Goal({
        dailyCompleteDates: [
            makeDate(5, 23), // there's a gap between this date and the next, so it shouldn't count
            makeDate(3, 1),
            makeDate(2, 23),
            makeDate(1, 1)
        ],
        dailyDuration: 5
    });

    assertEqual(3, goal.getDailyStreak());
});

testSuite.push(function testGetDailyStreak_mostRecentTwoDaysAgo() {
    let goal = new Goal({
        dailyCompleteDates: [
            makeDate(4, 23),
            makeDate(3, 1),
            makeDate(2, 23)
        ],
        dailyDuration: 5
    });

    assertEqual(0, goal.getDailyStreak());
});

testSuite.push(function testGetDailyStreak_complete() {
    let goal = new Goal({
        completeDate: new Date(),
        dailyDuration: 3
    });

    assertEqual(3, goal.getDailyStreak());
});

testSuite.push(function testGetPointsEarned_incomplete() {
    let goal = new Goal({
        points: 3
    });

    assertEqual(0, goal.getPointsEarned());
});

testSuite.push(function testGetPointsEarned_complete() {
    let goal = new Goal({
        completeDate: new Date(),
        points: 3
    });

    assertEqual(3, goal.getPointsEarned());
});

testSuite.push(function testGetPointsEarned_incomplete_daily() {
    let goal = new Goal({
        dailyCompleteDates: [
            new Date(),
            new Date(),
            new Date()
        ],
        dailyBonusPoints: 10,
        points: 3
    });

    assertEqual(9, goal.getPointsEarned());
});

testSuite.push(function testGetPointsEarned_complete_daily() {
    let goal = new Goal({
        completeDate: new Date(),
        dailyCompleteDates: [
            new Date(),
            new Date(),
            new Date()
        ],
        dailyBonusPoints: 10,
        points: 3
    });

    assertEqual(19, goal.getPointsEarned());
});

testSuite.push(function testGetPointsRedeemed_unredeemed() {
    let reward = new Reward({
        points: 3
    });

    assertEqual(0, reward.getPointsRedeemed());
});

testSuite.push(function testGetPointsRedeemed_redeemed() {
    let reward = new Reward({
        points: 3,
        redeemDate: new Date()
    });

    assertEqual(3, reward.getPointsRedeemed());
});

testSuite.forEach(test => {
    try {
        test();
        renderPass(test.name);
    } catch (err) {
        console.error(err);
        renderFail(test.name, err);
    }
});

