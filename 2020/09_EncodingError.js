const chalk = require('chalk');
const { fetchInput, textToArray } = require('../util/util');

function part1(list) {
    const res = _part1(list, 25);

    return `${chalk.green(
        res
    )} is the first number that does not have the property.`;
}

function part2(list) {
    const sum = _part1(list, 25);

    const res = list.reduce((a, _, i) => {
        let acc = 0;
        const num = [];
        if (
            a.length === 0 &&
            list.slice(i, -1).find((n) => {
                acc += n;
                num.push(n);
                if (acc === sum) {
                    return true;
                }
                return false;
            })
        ) {
            return num;
        }

        return a;
    }, []);

    const r = Math.min(...res) + Math.max(...res);

    return `${chalk.green(
        r
    )} is the encryption weakness in your XMAS-encrypted list of numbers.`;
}

function _part1(list, preamble) {
    return list.find((n, i) => {
        if (i < preamble) return false;

        return !(
            list
                .slice(i - preamble, i)
                .find((a) =>
                    list
                        .slice(i - preamble, i)
                        .find((b) => a !== b && a + b === n)
                ) || false
        );
    });
}

module.exports = async function () {
    const list = textToArray(await fetchInput(2020, 9)).map((x) => parseInt(x));

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
