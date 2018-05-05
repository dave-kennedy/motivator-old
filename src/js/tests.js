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

testSuite.push(function testGetDailyStreak_sameDay() {
    let goal = new Goal({
        dailyCompleteDates: [
            '2018-04-30T01:00:00.000Z',
            '2018-04-30T12:00:00.000Z',
            '2018-04-30T23:00:00.000Z'
        ]
    });

    let expected = 1,
        actual = goal.getDailyStreak();

    assertEqual(expected, actual);
});

testSuite.push(function testGetDailyStreak_consecutiveDays() {
    let goal = new Goal({
        dailyCompleteDates: [
            '2018-04-30T23:00:00.000Z',
            '2018-05-01T01:00:00.000Z',
            '2018-05-02T23:00:00.000Z'
        ]
    });

    let expected = 3,
        actual = goal.getDailyStreak();

    assertEqual(expected, actual);
});

testSuite.push(function testGetDailyStreak_streakBroken() {
    let goal = new Goal({
        dailyCompleteDates: [
            '2018-04-30T23:00:00.000Z',
            '2018-05-01T01:00:00.000Z',
            '2018-05-03T01:00:00.000Z'
        ]
    });

    let expected = 0,
        actual = goal.getDailyStreak();

    assertEqual(expected, actual);
});

testSuite.push(function testGetPointsEarned_incomplete() {
    let goal = new Goal({
        points: 3
    });

    let expected = 0,
        actual = goal.getPointsEarned();

    assertEqual(expected, actual);
});

testSuite.push(function testGetPointsEarned_complete() {
    let goal = new Goal({
        completeDate: '2018-05-01T01:00:00.000Z',
        points: 3
    });

    let expected = 3,
        actual = goal.getPointsEarned();

    assertEqual(expected, actual);
});

testSuite.push(function testGetPointsEarned_consecutiveDays() {
    let goal = new Goal({
        dailyCompleteDates: [
            '2018-04-30T23:00:00.000Z',
            '2018-05-01T01:00:00.000Z',
            '2018-05-02T23:00:00.000Z'
        ],
        dailyBonusPoints: 10,
        points: 3
    });

    let expected = 9,
        actual = goal.getPointsEarned();

    assertEqual(expected, actual);
});

testSuite.push(function testGetPointsEarned_complete_consecutiveDays() {
    let goal = new Goal({
        completeDate: '2018-05-02T23:00:00.000Z',
        dailyCompleteDates: [
            '2018-04-30T23:00:00.000Z',
            '2018-05-01T01:00:00.000Z',
            '2018-05-02T23:00:00.000Z'
        ],
        dailyBonusPoints: 10,
        points: 3
    });

    let expected = 19,
        actual = goal.getPointsEarned();

    assertEqual(expected, actual);
});

testSuite.push(function testGetPointsRedeemed_unredeemed() {
    let reward = new Reward({
        points: 3
    });

    let expected = 0,
        actual = reward.getPointsRedeemed();

    assertEqual(expected, actual);
});

testSuite.push(function testGetPointsRedeemed_redeemed() {
    let reward = new Reward({
        points: 3,
        redeemDate: '2018-05-02T23:00:00.000Z'
    });

    let expected = 3,
        actual = reward.getPointsRedeemed();

    assertEqual(expected, actual);
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

