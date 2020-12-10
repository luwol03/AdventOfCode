const chalk = require('chalk');
const { fetchInput, textToArray } = require('../util/util');

function part1(list) {
    const l = [...list, 0, Math.max(...list) + 3].sort((a, b) => a - b);
    const res = [0, 0];

    for (let i = 0; i < l.length; i++) {
        const diff = l[i + 1] - l[i];
        if (diff === 1) res[0]++;
        if (diff === 3) res[1]++;
    }

    return `${chalk.green(
        res[0] * res[1]
    )} is the number of 1-jolt differences multiplied by the number of 3-jolt differences.`;
}

function part2(list) {
    return `no solution implemented because of memory heap in js.`;
}

module.exports = async function () {
    const inp = textToArray(await fetchInput(2020, 10));

    // test data
    const inp1 = '8,33,18,42,31,14,46,20,48,47,24,23,49,45,19,38,39,11,1,32,25,35,8,17,7,9,4,2,34,10,3'.split(
        ','
    );
    const inp2 = '16,10,15,5,1,11,7,19,6,12,4'.split(',');

    const list = inp.reduce((a, s) => {
        const num = parseInt(s);
        if (!isNaN(num)) a.push(num);
        return a;
    }, []);

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
