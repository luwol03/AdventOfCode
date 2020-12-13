const chalk = require('chalk');
const { spawn } = require('child_process');
const { fetchInput, textToArray, mod } = require('../util/util');

function part1(list) {
    const timestamp = parseInt(list[0]);
    const ids = list[1].split(',').filter((s) => s !== 'x');

    const [bus, diff] = ids.reduce(
        (acc, id) => {
            id = parseInt(id);
            const out = [];

            for (let i = 0; i < timestamp + id; i += id) {
                out.push(i);
            }

            const r = out.find((s) => s >= timestamp);

            if (r) {
                const diff = r - timestamp;
                if (diff < acc[1]) return [id, diff];
            }
            return acc;
        },
        [0, Infinity]
    );

    const res = bus * diff;

    return `${chalk.green(
        res
    )} is the ID of the earliest bus you can take to the airport multiplied by the number of minutes you'll need to wait for that bus.`;
}

async function part2(list) {
    const ids = list[1].split(',');

    const n = [];
    const a = [];

    ids.forEach((x, i) => {
        if (x === 'x') return;

        x = parseInt(x);
        n.push(x);
        a.push(x - i);
    });

    const res = await chineseRemainder(n, a);

    return `${chalk.green(
        res
    )} is the earliest timestamp such that all of the listed bus IDs depart at offsets matching their positions in the list.`;
}

function chineseRemainder(n, a) {
    let prod = n.reduce((acc, n) => acc * n);

    const l = n.map((_, i) => [n[i], a[i]]);

    const res = l.reduce((acc, [n, a]) => {
        let p = prod / n;
        let aa = extendedGcd(p, n)[1];

        acc.push([a, p, aa]);
        return acc;
    }, []);

    return new Promise((resolve) => {
        const t = res.reduce((t, v) => `${t}+${v[0]}*${v[1]}*${v[2]}`, '');
        const p = spawn('python', ['-c', `print((${t}) % ${prod})`]);

        p.stdout.on('data', (stdout) => {
            resolve(parseInt(stdout.toString()));
        });
    });
}

function extendedGcd(a, b) {
    if (a === 0) return [b, 0, 1];

    const [gcd, x1, y1] = extendedGcd(mod(b, a), a);

    x = y1 - Math.floor(b / a) * x1;
    y = x1;

    return [gcd, x, y];
}

module.exports = async function () {
    const list = textToArray(await fetchInput(2020, 13));

    return {
        part1: async () => part1(list),
        part2: async () => await part2(list),
    };
};
