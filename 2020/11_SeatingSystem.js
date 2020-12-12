const chalk = require('chalk');
const { fetchInput, textToArray, countChar } = require('../util/util');

function getNeighbors(list, y, x) {
    const n = [];
    if (y + 1 < list.length) {
        n.push(list[y + 1][x]);
        n.push(list[y + 1][x - 1]);
        n.push(list[y + 1][x + 1]);
    }

    if (y - 1 >= 0) {
        n.push(list[y - 1][x]);
        n.push(list[y - 1][x - 1]);
        n.push(list[y - 1][x + 1]);
    }

    n.push(list[y][x - 1]);
    n.push(list[y][x + 1]);

    return n.filter((s) => s !== undefined);
}

function getNeighbors2(list, y, x) {
    let acc = 0;

    // right
    for (let i = x + 1; i < list[y].length; i++) {
        const r = get(list, y, i);
        if (typeof r === 'boolean') {
            if (r) acc++;
            break;
        }
    }

    // left
    for (let i = x - 1; i >= 0; i--) {
        const r = get(list, y, i);
        if (typeof r === 'boolean') {
            if (r) acc++;
            break;
        }
    }

    // top
    for (let i = y - 1; i >= 0; i--) {
        const r = get(list, i, x);
        if (typeof r === 'boolean') {
            if (r) acc++;
            break;
        }
    }

    // bottom
    for (let i = y + 1; i < list.length; i++) {
        const r = get(list, i, x);
        if (typeof r === 'boolean') {
            if (r) acc++;
            break;
        }
    }

    // top (right / left)
    let rr = x;
    let ll = x;
    let isR = false;
    let isL = false;
    for (let i = y - 1; i >= 0; i--) {
        rr++;
        ll--;

        if (list[i]) {
            if (!isR && list[i][rr] === '#') {
                acc++;
                isR = true;
            }
            if (list[i][rr] === 'L') isR = true;
            if (!isL && list[i][ll] === '#') {
                acc++;
                isL = true;
            }
            if (list[i][ll] === 'L') isL = true;
            if (isR && isL) break;
        } else {
            break;
        }
    }

    // bottom (right / left)
    rr = x;
    ll = x;
    isR = false;
    isL = false;
    for (let i = y + 1; i < list.length; i++) {
        rr++;
        ll--;

        if (list[i]) {
            if (!isR && list[i][rr] === '#') {
                acc++;
                isR = true;
            }
            if (list[i][rr] === 'L') isR = true;
            if (!isL && list[i][ll] === '#') {
                acc++;
                isL = true;
            }
            if (list[i][ll] === 'L') isL = true;
            if (isR && isL) break;
        } else {
            break;
        }
    }

    return acc;
}

function get(list, y, x) {
    if (list[y]) {
        if (list[y][x] === 'L') return false;
        if (list[y][x] === '#') {
            return true;
        }
    } else {
        return false;
    }
}

function equal(list, list2) {
    return !list.some((_, i) => list[i] !== list2[i]);
}

function simulate(list) {
    const clone = [...list].map((s) => s.split(''));

    list.forEach((line, y) => {
        line.split('').forEach((seat, x) => {
            if (seat === 'L') {
                // occupy
                const c = getNeighbors(list, y, x);
                if (c.filter((s) => s === '#').length === 0) {
                    clone[y][x] = '#';
                }
            }
            if (seat === '#') {
                // clear
                const c = getNeighbors(list, y, x);
                if (c.filter((s) => s === '#').length >= 4) {
                    clone[y][x] = 'L';
                }
            }
        });
    });
    return clone.map((s) => s.join(''));
}

function simulate2(list) {
    const clone = [...list].map((s) => s.split(''));

    list.forEach((line, y) => {
        line.split('').forEach((seat, x) => {
            if (seat === 'L') {
                // occupy
                if (getNeighbors2(list, y, x) === 0) {
                    // console.log(y, x);
                    clone[y][x] = '#';
                }
            }
            if (seat === '#') {
                // clear
                if (getNeighbors2(list, y, x) >= 5) {
                    clone[y][x] = 'L';
                }
            }
        });
    });
    return clone.map((s) => s.join(''));
}

function part1(list) {
    let last = ['1234567890'];
    let check = list;

    while (!equal(last, check)) {
        last = check;
        check = simulate(last);
    }

    const res = check.reduce((acc, line) => acc + countChar(line, '#'), 0);

    return `${chalk.green(res)} seats end up occupied.`;
}

function part2(list) {
    let last = ['1234567890'];
    let check = list;

    while (!equal(last, check)) {
        last = check;
        check = simulate2(last);
    }

    const res = check.reduce((acc, line) => acc + countChar(line, '#'), 0);

    return `${chalk.green(res)} seats end up occupied with the new rules.`;
}

module.exports = async function () {
    const list = textToArray(await fetchInput(2020, 11));

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
