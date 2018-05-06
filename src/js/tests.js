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

let testSuite = [];

testSuite.push(function testGetDailyStreak_consecutiveDays() {
    let goal = new Goal({
        dailyCompleteDates: [
            '2018-05-04T01:00:00-06:00',
            '2018-05-05T23:00:00-06:00',
            '2018-05-06T01:00:00-06:00'
        ],
        dailyDuration: 3
    });

    assertEqual(3, goal.getDailyStreak());

    // test again with different dates
    goal = new Goal({
        dailyCompleteDates: [
            '2018-05-03T01:00:00-06:00',
            '2018-05-04T23:00:00-06:00',
            '2018-05-05T01:00:00-06:00'
        ],
        dailyDuration: 3
    });

    assertEqual(3, goal.getDailyStreak());
});

testSuite.push(function testGetDailyStreak_partialStreak() {
    let goal = new Goal({
        dailyCompleteDates: [
            '2018-05-03T23:00:00-06:00',
            '2018-05-05T01:00:00-06:00',
            '2018-05-06T23:00:00-06:00'
        ],
        dailyDuration: 3
    });

    assertEqual(2, goal.getDailyStreak());

    // test again with different dates
    goal = new Goal({
        dailyCompleteDates: [
            '2018-05-02T23:00:00-06:00',
            '2018-05-04T01:00:00-06:00',
            '2018-05-05T23:00:00-06:00'
        ],
        dailyDuration: 3
    });

    assertEqual(2, goal.getDailyStreak());

});

testSuite.push(function testGetDailyStreak_streakBroken() {
    let goal = new Goal({
        dailyCompleteDates: [
            '2018-05-04T23:00:00-06:00'
        ],
        dailyDuration: 3
    });

    assertEqual(0, goal.getDailyStreak());
});

testSuite.push(function testGetDailyStreak_complete() {
    let goal = new Goal({
        completeDate: '2018-05-01T01:00:00-06:00',
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
        completeDate: '2018-05-01T01:00:00-06:00',
        points: 3
    });

    assertEqual(3, goal.getPointsEarned());
});

testSuite.push(function testGetPointsEarned_incomplete_daily() {
    let goal = new Goal({
        dailyCompleteDates: [
            '2018-04-30T23:00:00-06:00',
            '2018-05-01T01:00:00-06:00',
            '2018-05-02T23:00:00-06:00'
        ],
        dailyBonusPoints: 10,
        points: 3
    });

    assertEqual(9, goal.getPointsEarned());
});

testSuite.push(function testGetPointsEarned_complete_daily() {
    let goal = new Goal({
        completeDate: '2018-05-02T23:00:00-06:00',
        dailyCompleteDates: [
            '2018-04-30T23:00:00-06:00',
            '2018-05-01T01:00:00-06:00',
            '2018-05-02T23:00:00-06:00'
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
        redeemDate: '2018-05-02T23:00:00-06:00'
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

