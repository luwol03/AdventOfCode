const chalk = require('chalk');
const { fetchInput, textToArray, fillString } = require('../util/util');

function applyMask(mask, string) {
    let r = '';

    for (const i in mask) {
        if (mask[i] === 'X') r += string[i];
        else r += mask[i];
    }

    return r;
}

function part1(list) {
    let mask = '';

    const memory = list.reduce((memory, s) => {
        const m = s.match(/mask = ((X|1|0){36})/);

        if (m) {
            mask = m[1];
        } else {
            const mem = s.match(/mem\[(\d+)] = (\d+)/);
            if (!mem) return memory;

            const bit = fillString(parseInt(mem[2]).toString(2), '0', 35, -1);
            memory[mem[1]] = parseInt(applyMask(mask, bit), 2);
        }

        return memory;
    }, {});

    const res = Object.values(memory).reduce((acc, v) => acc + v, 0);

    return `${chalk.green(
        res
    )} is the sum of all values left in memory after it completes.`;
}

function part2(list) {
    const memory = {};
    let mask = '';

    list.forEach((s) => {
        const m = s.match(/mask = ((X|1|0){36})/);

        if (m) {
            mask = m[1];
        } else {
            const mem = s.match(/mem\[(\d+)] = (\d+)/);
            if (!mem) return;

            const adr = fillString(
                parseInt(mem[1]).toString(2),
                '0',
                35,
                -1
            ).split('');
            const val = parseInt(mem[2]);
            let nadr = '000000000000000000000000000000000000'.split('');

            for (const i in mask) {
                const m = mask[i];
                const a = adr[i];

                if (m === 'X') nadr[i] = 'X';
                else if (m === '0') nadr[i] = a;
                else if (m === '1') nadr[i] = '1';
            }

            const npos = nadr.filter((s) => s === 'X').length;
            const fs = Array.from({ length: 2 ** npos }, (_, i) =>
                fillString(i.toString(2), '0', npos - 1, -1)
            );

            fs.forEach((f) => {
                let i = 0;

                const newAdr = nadr.reduce((acc, a) => {
                    if (a === 'X') {
                        acc += f[i].toString();
                        i++;
                    } else {
                        acc += a.toString();
                    }
                    return acc;
                }, '');

                memory[parseInt(newAdr, 2)] = val;
            });
        }
    });

    const res = Object.values(memory).reduce((a, b) => a + b);

    return `${chalk.green(
        res
    )} is the sum of all values left in memory after it completes.`;
}

module.exports = async function () {
    const list = textToArray(await fetchInput(2020, 14));

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
