const chalk = require('chalk');
const { fetchInput, textToArray, everyNthElement } = require('../util/util');

function countTrees(list, x, y) {
    return everyNthElement(list, y).filter(
        (line, i) => (isTree = line[(i * x) % line.length] === '#')
    );
}

async function part1(list) {
    const res = countTrees(list, 3, 1);

    return `${chalk.green(res.length)} trees are on the slope.`;
}

async function part2(list) {
    const res = [
        [1, 1],
        [3, 1],
        [5, 1],
        [7, 1],
        [1, 2],
    ].map(([x, y]) => countTrees(list, x, y).length);

    return `${res
        .map((n) => chalk.green(n))
        .join(
            ', '
        )} trees are on the slope and and this is multiplied together to ${chalk.green(
        res.reduce((a, s) => a * s)
    )}.`;
}

module.exports = async function () {
    const list = textToArray(await fetchInput(2020, 3));

    return {
        part1: async () => await part1(list),
        part2: async () => await part2(list),
    };
};
