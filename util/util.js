const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const { baseUrl, sessionCookie } = require('./constants');

const getInput = async (year, day) => {
    const url = `${baseUrl}/${year}/day/${day}/input`;

    return await (
        await fetch(url, {
            headers: {
                Cookie: `session=${sessionCookie}`,
            },
        })
    ).text();
};

const fetchInput = async (year, day, cache = true, check = true) => {
    if (check) {
        const date = new Date();
        date.setFullYear(year);
        date.setMonth(11);
        date.setDate(day);
        if(date > new Date()) {
            throw new Error('this challenge is not yet available!')
        }
    }

    const p = path.resolve('.input', `${year}`);
    const filePath = path.resolve(p, `${day}` + '.txt');

    if (cache && fs.existsSync(filePath)) {
        return await await fs.promises.readFile(filePath, 'utf-8');
    }

    const input = await getInput(year, day);

    if (!fs.existsSync(p)) {
        await fs.promises.mkdir(p, { recursive: true });
    }

    await fs.promises.writeFile(filePath, input);

    return input;
};

const textToArray = (text) => text.split('\n');

const countChar = (s, c) =>
    s.split('').reduce((acc, ch) => (ch === c ? acc + 1 : acc), 0);

const everyNthElement = (list, n) =>
    list.reduce((l, e, i) => {
        if (i % n === 0) l.push(e);
        return l;
    }, []);

const between = (x, min, max) => x >= min && x <= max;

const round = (x, dp) =>
    Math.round(x * parseInt('1' + '0'.repeat(dp))) /
    parseInt('1' + '0'.repeat(dp));

module.exports = {
    fetchInput,
    textToArray,
    countChar,
    getInput,
    everyNthElement,
    between,
    round,
};
