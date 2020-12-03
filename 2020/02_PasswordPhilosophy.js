const chalk = require('chalk');
const { fetchInput, textToArray, countChar } = require('../util/util');

async function part1(list) {
    const res = list.filter((e) => {
        const count = countChar(e.password, e.char);

        return e.min <= count && e.max >= count;
    });

    return `${chalk.green(
        res.length
    )} passwords are valid according to their policies.`;
}

async function part2(list) {
    const res = list.filter(
        (e) =>
            (e.password[--e.min] === e.char) ^ (e.password[--e.max] === e.char)
    );

    return `${chalk.green(
        res.length
    )} passwords are valid according to the new interpretation of the policies.`;
}

module.exports = async function () {
    const list = textToArray(await fetchInput(2020, 2));

    const parsedList = list.reduce((list, line) => {
        const s = line.split(' ');

        if (typeof s === 'object' && s.length === 3) {
            const amount = s[0].split('-');

            list.push({
                min: parseInt(amount[0]),
                max: parseInt(amount[1]),
                char: s[1][0],
                password: s[2],
            });
        }
        return list;
    }, []);

    return {
        part1: async () => await part1(parsedList),
        part2: async () => await part2(parsedList),
    };
};
