const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { oraPromise } = require('./util/ora');
const { program } = require('commander');

program
    .version(require('./package.json').version)
    .option(
        '-y --year <year>',
        'year of challenge to run',
        new Date().getFullYear()
    )
    .option('-d --day <day>', 'day of challenge to run', new Date().getDate())
    .option('-p --part <part>', `part of challenge to run`)
    .option('-c --create <name>', `create file from template`);

program.parse(process.argv);

(async function run() {
    const p = path.resolve(`${program.year}`);

    if (fs.existsSync(p)) {
        const pu = (await fs.promises.readdir(p))[program.day - 1];

        if (
            pu &&
            parseInt(pu.slice(0, 2)) === parseInt(program.day) &&
            !program.create
        ) {
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
        } else if (program.create && !pu) {
            try {
                const template = (
                    await fs.promises.readFile(
                        path.resolve('templates', 'puzzle.js'),
                        'utf-8'
                    )
                )
                    .replace('"%{year}%"', program.year)
                    .replace('"%{day}%"', program.day);

                await fs.promises.writeFile(
                    path.resolve(
                        `${program.year}`,
                        `${('0' + program.day).slice(-2)}_${program.create}.js`
                    ),
                    template,
                    'utf-8'
                );
            } catch (err) {
                throw err;
            }
        } else if (pu) {
            throw new Error('Nothing to create, file exists.');
        } else {
            throw new Error(
                'challenge not found, you can create it with the -c flag'
            );
        }
    } else if (program.create) {
        try {
            await fs.promises.mkdir(path.resolve(`${program.year}`));
            run();
        } catch (err) {
            throw err;
        }
    } else {
        throw new Error('Nothing for this year found.');
    }
})();
