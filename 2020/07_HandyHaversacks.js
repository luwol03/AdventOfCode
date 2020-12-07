const chalk = require('chalk');
const { fetchInput, textToArray } = require('../util/util');

function part1(list) {
    const bags = list.reduce((bags, bag) => {
        const [b, ...bgs] = Array.from(
            bag.matchAll(/([a-z]+ [a-z]+) bag/g),
            (r) => r[1]
        );
        bags[b] = bgs;
        return bags;
    }, {});

    function cntBags(list, name) {
        if (name === 'no other') return 0;
        if (list[name].includes('shiny gold')) return 1;
        return list[name].reduce((c, b) => c + cntBags(list, b), 0);
    }

    const count = Object.keys(bags).filter((bag) => {
        return cntBags(bags, bag) !== 0;
    }).length;

    return `${chalk.green(
        count
    )} bag colors can eventually contain at least one shiny gold bag.`;
}

function part2(list) {
    const bags = list.reduce((bags, bag) => {
        if (bag === '') return bags;
        const b = bag.match(/^([a-z]+ [a-z]+) bags/)[1];
        const bgs = Array.from(
            bag.matchAll(/(\d+) ([a-z]+ [a-z]+) bag/g),
            (r) => [parseInt(r[1]), r[2]]
        );
        bags[b] = bgs;
        return bags;
    }, {});

    function cntBags(list, name) {
        if (list[name].length === 0) return 0;
        return list[name].reduce(
            (c, [n, bag]) => c + cntBags(list, bag) * n + n,
            0
        );
    }

    const count = cntBags(bags, 'shiny gold');

    return `${chalk.green(
        count
    )} individual bags are required inside my single shiny gold bag.`;
}

module.exports = async function () {
    const list = textToArray(await fetchInput(2020, 7));

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
