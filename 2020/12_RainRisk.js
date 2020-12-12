const chalk = require('chalk');
const { fetchInput, textToArray } = require('../util/util');

function part1(list) {
    list = list.filter((s) => !['\n', ''].includes(s));

    const dirs = ['N', 'E', 'S', 'W'];

    let dir = 'E';
    let x = 0;
    let y = 0;

    list.forEach((dd) => {
        const d = dd.slice(0, 1);
        const v = parseInt(dd.slice(1));

        if (d === 'N') y -= v;
        if (d === 'E') x += v;
        if (d === 'S') y += v;
        if (d === 'W') x -= v;

        if (d === 'L') {
            dir = dirs[(8 + (dirs.findIndex((g) => g === dir) - v / 90)) % 4];
        }
        if (d === 'R') {
            dir = dirs[(8 + (dirs.findIndex((g) => g === dir) + v / 90)) % 4];
        }
        if (d === 'F') {
            if (dir === 'N') y -= v;
            if (dir === 'E') x += v;
            if (dir === 'S') y += v;
            if (dir === 'W') x -= v;
        }
    });

    const res = Math.abs(x) + Math.abs(y);

    return `${chalk.green(
        res
    )} is the Manhattan distance between that location and the ship's starting position.`;
}

function part2(list) {
    list = list.filter((s) => !['\n', ''].includes(s));

    let wx = 10;
    let wy = -1;

    let sx = 0;
    let sy = 0;

    list.forEach((dd) => {
        const d = dd.slice(0, 1);
        const v = parseInt(dd.slice(1));

        if (d === 'N') wy -= v;
        if (d === 'E') wx += v;
        if (d === 'S') wy += v;
        if (d === 'W') wx -= v;

        if (d === 'L') {
            for (let i = 0; i < v / 90; i++) {
                let x = wx;
                let y = wy;
                wx = y;
                wy = -x;
            }
        } else if (d === 'R') {
            for (let i = 0; i < v / 90; i++) {
                let x = wx;
                let y = wy;
                wx = -y;
                wy = x;
            }
        } else if (d === 'F') {
            sx += wx * v;
            sy += wy * v;
        }
    });

    const res = Math.abs(sx) + Math.abs(sy);

    return `${chalk.green(
        res
    )} is the Manhattan distance between that location and the ship's starting position.`;
}

module.exports = async function () {
    const list = textToArray(await fetchInput(2020, 12));

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
