const chalk = require('chalk');
const { fetchInput, textToArray } = require('../util/util');

function part1(list) {
    const [, acc] = run(list);

    return `The accumulator is ${chalk.green(
        acc
    )} before any instruction is executed a second time.`;
}

function part2(list) {
    for (let i = 0; i < list.length; i++) {
        const [err, acc] = run(list, i);

        if (!err) {
            return `${chalk.green(
                acc
            )} is the value of the accumulator after the program terminates.`;
        }
    }
    throw chalk.red(`no combination without a endless loop.`);
}

function run(list, change) {
    let acc = 0,
        next = 0;
    const visited = new Set();

    while (next < list.length - 1) {
        if (visited.has(next)) {
            return [true, acc];
        }
        visited.add(next);

        let [cmd, arg] = list[next].split(' ');

        if (next === change) {
            if (cmd === 'nop') {
                cmd = 'jmp';
            } else if (cmd === 'jmp') {
                cmd = 'nop';
            }
        }

        if (cmd === 'acc') {
            acc += parseInt(arg);
            next++;
        } else if (cmd === 'nop') {
            next++;
        } else if (cmd === 'jmp') {
            next += parseInt(arg);
        }
    }
    return [false, acc];
}

module.exports = async function () {
    const list = textToArray(await fetchInput(2020, 8));

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
