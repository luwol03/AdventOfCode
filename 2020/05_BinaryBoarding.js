const chalk = require('chalk');
const { fetchInput, textToArray } = require('../util/util');

function listToNumber(list) {
    return list.map(
        (num) => parseInt(num.replace(/F|L/g, '0').replace(/B|R/g, '1'), 2) || 0
    );
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
