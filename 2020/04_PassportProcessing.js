const chalk = require('chalk');
const { fetchInput, between } = require('../util/util');

function part1(list) {
    const res = list.filter((p) =>
        ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'].every((e) =>
            p.includes(e)
        )
    );

    return `${chalk.green(res.length)} passports are valid.`;
}

function part2(list) {
    const res = list
        .map((s) =>
            s
                .split(/ |\n/)
                .filter((s) => s !== '')
                .reduce((a, s) => {
                    const [k, v] = s.split(':');
                    a[k] = v;
                    return a;
                }, {})
        )
        .filter((p) => {
            const hgt = (p.hgt || '').match(/^(\d+)(in|cm)$/);

            return !(
                !between(parseInt(p.byr), 1920, 2020) ||
                !between(parseInt(p.iyr), 2010, 2020) ||
                !between(parseInt(p.eyr), 2020, 2030) ||
                !hgt ||
                (hgt[2] === 'cm' && !between(hgt[1], 150, 193)) ||
                (hgt[2] === 'in' && !between(hgt[1], 59, 76)) ||
                !(p.hcl || '').match(/^#[\da-f]{6}$/) ||
                !['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(
                    p.ecl
                ) ||
                !(p.pid || '').match(/^\d{9}$/)
            );
        });

    return `${chalk.green(res.length)} passports are valid.`;
}

module.exports = async function () {
    const list = (await fetchInput(2020, 4)).split('\n\n');

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
