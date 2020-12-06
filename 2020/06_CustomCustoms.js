const chalk = require('chalk');
const { fetchInput, countChar } = require('../util/util');

function part1(list) {
    const res = list
        .map((group) => new Set(group.replace(/\n/g, '')).size)
        .reduce((a, p) => a + p);

    return `${chalk.green(res)} questions were answered with yes by anyone.`;
}

function part2(list) {
    const res = list
        .map((group) => {
            const answers = new Set();

            const g = group.split('\n').filter((s) => s.length !== 0);

            g.forEach((person) => {
                person.split('').forEach((answer) => {
                    if (countChar(group, answer) === g.length) {
                        answers.add(answer);
                    }
                });
            });

            return answers.size;
        })
        .reduce((a, p) => a + p);

    return `${chalk.green(
        res
    )} questions were answered with yes by everyone in a group.`;
}

module.exports = async function () {
    const list = (await fetchInput(2020, 6)).split('\n\n');

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
