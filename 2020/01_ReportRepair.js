const chalk = require('chalk');
const { fetchInput, textToArray } = require('../util/util');

async function part1(list) {
    const numbers = list.slice(0).reduce((res, n1, _, list) => {
        const n2 = list.find((n2) => parseInt(n1) + parseInt(n2) === 2020);
        if (n2) {
            res = [parseInt(n1), parseInt(n2)];
            list.splice(1);
        }
        return res;
    }, null);

    if (numbers !== null) {
        return `The two right entries are ${chalk.green(
            numbers[0]
        )}, ${chalk.green(numbers[1])} and multiplied together to ${chalk.green(
            numbers[0] * numbers[1]
        )}.`;
    } else {
        throw chalk.red('No numbers give together 2020');
    }
}

async function part2(list) {
    const numbers = list.slice(0).reduce((res1, n1, _, list1) => {
        const z = list.slice(0).reduce((res2, n2, _, list2) => {
            const n3 = list.find(
                (n3) => parseInt(n1) + parseInt(n2) + parseInt(n3) === 2020
            );
            if (n3) {
                res2 = [parseInt(n2), parseInt(n3)];
                list2.splice(1);
            }
            return res2;
        }, null);

        if (z) {
            res1 = [n1, ...z];
            list1.splice(1);
        }
        return res1;
    }, null);

    if (numbers !== null) {
        return `The three right entries are ${chalk.green(
            numbers[0]
        )}, ${chalk.green(numbers[1])}, ${chalk.green(
            numbers[2]
        )} and multiplied together to ${chalk.green(
            numbers[0] * numbers[1] * numbers[2]
        )}.`;
    } else {
        throw chalk.red('No numbers give together 2020');
    }
}

module.exports = async function () {
    const list = textToArray(await fetchInput(2020, 1));

    return {
        part1: async () => await part1(list),
        part2: async () => await part2(list),
    };
};
