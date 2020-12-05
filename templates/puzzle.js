const chalk = require('chalk');
const { fetchInput, textToArray } = require('../util/util');

function part1(list) {
    console.log(list);

    // start coding at 6:00am

    return `puzzle 1`;
}

function part2(list) {
    return `puzzle 2`;
}

module.exports = async function () {
    const list = textToArray(await fetchInput("%{year}%", "%{day}%"));

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
