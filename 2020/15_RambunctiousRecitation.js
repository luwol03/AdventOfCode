const chalk = require('chalk');
const { fetchInput, textToArray } = require('../util/util');

function getSpokenNum(list, n) {
    const numbers = list[0].split(',').map((s) => parseInt(s));
    const lastNumbers = numbers.reduce(
        (a, n, i, arr) => (i !== arr.length - 1 ? { ...a, [n]: i } : a),
        {}
    );

    while (numbers.length < n) {
        const pn = numbers[numbers.length - 1];
        const pnp = lastNumbers[pn];
        let next = 0;
        lastNumbers[pn] = numbers.length - 1;
        if (pnp !== undefined) {
            next = numbers.length - 1 - pnp;
        }

        numbers.push(next);
    }

    return numbers[numbers.length - 1];
}

function part1(list) {
    const res = getSpokenNum(list, 2020);

    return `${chalk.green(res)} will be the 2020th number spoken.`;
}

function part2(list) {
    const res = getSpokenNum(list, 30000000);

    return `${chalk.green(res)} will be the 30000000th number spoken.`;
}

module.exports = async function () {
    const list = textToArray(await fetchInput(2020, 15));

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
