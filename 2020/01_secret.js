const chalk = require('chalk');
const { fetchInput, textToArray } = require('../util/util');

async function part1(list) {
    console.log(list);
    return chalk.green('puzzle one');
}

async function part2(list) {
    return chalk.yellow('puzzle two');
}

module.exports = async function () {
    const list = textToArray(await fetchInput(2019, 1));

    return {
        part1: async () => await part1(list),
        part2: async () => await part2(list),
    };
};
