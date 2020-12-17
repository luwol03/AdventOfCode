const chalk = require('chalk');
const { fetchInput } = require('../util/util');

function part1(list) {
    const rules = list[0]
        .split('\n')
        .map((s) => Array.from(s.matchAll(/\d+/g), (x) => parseInt(x[0])));
    const nearbyTickets = list[2]
        .split('\n')
        .slice(1, -1)
        .map((s) => s.split(',').map((x) => parseInt(x)));

    const res = nearbyTickets.reduce((acc, ticket) => {
        const nvs = ticket.reduce((nvs, n) => {
            const match = rules.some(
                ([a, b, c, d]) => (a <= n && b >= n) || (c <= n && d >= n)
            );

            if (!match) nvs += n;
            return nvs;
        }, 0);

        acc += nvs;
        return acc;
    }, 0);

    return `${chalk.green(res)} is my ticket scanning error rate.`;
}

function part2(list) {
    const rules = list[0]
        .split('\n')
        .map((s) => Array.from(s.matchAll(/\d+/g), (x) => parseInt(x[0])));

    const ruleNames = list[0].split('\n').map((s) => s.match(/^(.*):/)[1]);

    const myTicket = list[1]
        .split('\n')[1]
        .split(',')
        .map((x) => parseInt(x));

    const nearbyTickets = list[2]
        .split('\n')
        .slice(1, -1)
        .map((s) => s.split(',').map((x) => parseInt(x)));

    const validTickets = nearbyTickets.filter((ticket) =>
        ticket.every((n) =>
            rules.some(
                ([a, b, c, d]) => (a <= n && b >= n) || (c <= n && d >= n)
            )
        )
    );

    const graph = validTickets.reduce((acc, t) => {
        t.forEach((n, i) => {
            if (!acc[i]) acc[i] = [];
            acc[i].push(n);
        });

        return acc;
    }, []);

    const queue = graph.map((g, i) => {
        const rr = rules.reduce((acc, [a, b, c, d], i) => {
            const r = g.every((n) => {
                return (a <= n && b >= n) || (c <= n && d >= n);
            });
            if (r) acc.push(ruleNames[i]);
            return acc;
        }, []);

        return [rr, i];
    });

    const fix = new Array(rules.length);

    while (true) {
        const qi = queue[0][0].findIndex(
            (r) => !queue.slice(1).some(([e]) => e.includes(r))
        );

        if (qi !== -1) {
            fix[queue[0][1]] = queue[0][0][qi];
            queue.shift();
        } else {
            queue.push(queue.shift());
        }

        if (fix.filter((s) => s !== undefined).length === rules.length) break;
    }

    const res = fix.reduce((acc, r, i) => {
        if (r.includes('departure')) acc *= myTicket[i];
        return acc;
    }, 1);

    return `I get ${chalk.green(
        res
    )} if I multiply those six departure values together.`;
}

module.exports = async function () {
    const list = (await fetchInput(2020, 16)).split('\n\n');

    return {
        part1: async () => part1(list),
        part2: async () => part2(list),
    };
};
