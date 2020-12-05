const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { oraPromise } = require('./util/ora');
const { program } = require('commander');

program
    .version(require('./package.json').version)
    .requiredOption(
        '-y --year <year>',
        'year of challenge to run',
        new Date().getFullYear()
    )
    .requiredOption(
        '-d --day <day>',
        'day of challenge to run',
        new Date().getDate()
    )
    .option('-p --part <part>', `part of challenge to run`);

program.parse(process.argv);

(async function () {
    const p = path.resolve(`${program.year}`);

    if (fs.existsSync(p)) {
        const pu = (await fs.promises.readdir(p))[program.day - 1];

        if (pu && parseInt(pu.slice(0, 2)) === parseInt(program.day)) {
            let day = null;
            try {
                day = require(`./${program.year}/${pu}`);
            } catch (err) {
                throw new Error('This puzzle was not found.');
            }
            if (day === null) throw new Error('This puzzle was not found.');

            const { part1, part2 } = await oraPromise(
                'parse input',
                day,
                'input parsed successfully.'
            );
            const part = parseInt(program.part);

            if (isNaN(part) || part === 0 || part === 1) {
                console.log(chalk.bold('Part 1:'));
                await oraPromise('puzzle 1', part1);
            }

            if (isNaN(part) || part === 0 || part === 2) {
                console.log(chalk.bold('Part 2:'));
                await oraPromise('puzzle 2', part2);
            }
        }
    }
})();
