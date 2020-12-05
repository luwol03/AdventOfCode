const chalk = require('chalk');
const { fetchInput, textToArray } = require('../util/util');

function listToNumber(list) {
    return list.map((num) => {
        let min = 0;
        let max = 127;

        num.slice(0, 7)
            .split('')
            .forEach((c) => {
                [min, max] = processNum(c, min, max);
            });

        const row = min;
        min = 0;
        max = 7;

        num.slice(7, 10)
            .split('')
            .forEach((c) => {
                [min, max] = processNum(c, min, max);
            });

        return row * 8 + min;
    });
}

function processNum(num, min, max) {
    let max1 = max;
    let min1 = min;
    if (num === 'F' || num === 'L') {
        max1 = Math.floor((max - min) / 2) + min;
    } else if (num === 'B' || num === 'R') {
        min1 = Math.floor((max - min) / 2) + min + 1;
    }
    return [min1, max1];
}

function part1(list) {
    return `${chalk.green(
        Math.max(...list)
    )} is the highest seat ID on a boarding pass.`;
}

function part2(list) {
    for (let i = 0; i < list.length; i++) {
        if (
            list.find((n) => n === i + 1) &&
            !list.find((n) => n === i) &&
            list.find((n) => n === i - 1)
        ) {
            return `${chalk.green(`${i}`)} is the ID of my seat.`;
        }
    }
}

module.exports = async function () {
    const list = listToNumber(textToArray(await fetchInput(2020, 5)));

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
