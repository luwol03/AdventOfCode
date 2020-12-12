#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { round, fillString } = require('./util/util');
const { oraPromise } = require('./util/ora');
const { program } = require('commander');
const { performance } = require('perf_hooks');

program
    .version(require('./package.json').version)
    .option(
        '-y --year <year>',
        'year of challenge to run',
        new Date().getFullYear()
    )
    .option('-d --day <day>', 'day of challenge to run', new Date().getDate())
    .option('-p --part <part>', `part of challenge to run`)
    .option('-c --create <name>', `create file from template`)
    .option('-a --all', `run all puzzles from one year`);

program.parse(process.argv);

(async function run() {
    const p = path.resolve(`${program.year}`);

    if (fs.existsSync(p)) {
        if (program.all) {
            const dir = await fs.promises.readdir(p);
            let startTime = performance.now();

            for (const puzzle of dir) {
                let s = `------ ${puzzle} `;
                while (s.length < 41) s += '-';

                let st = performance.now();

                console.log(
                    chalk.blue(fillString(`------ ${puzzle} `, '-', 40))
                );
                await runPuzzle(program.year, puzzle, program.part);
                console.log(
                    `${chalk.blue(
                        fillString(
                            `------ ${round(performance.now() - st, 3)}ms `,
                            '-',
                            40
                        )
                    )}\n`
                );
            }

            console.log(
                chalk.blue(`
------------------------------------
Total time: ${round((performance.now() - startTime) / 1000, 3)}s 
------------------------------------`)
            );

            return;
        }

        const pu = (await fs.promises.readdir(p))[program.day - 1];

        if (
            pu &&
            parseInt(pu.slice(0, 2)) === parseInt(program.day) &&
            !program.create
        ) {
            await runPuzzle(program.year, pu, program.part);
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

async function runPuzzle(yr, pu, pa) {
    let day = null;
    try {
        day = require(`./${yr}/${pu}`);
    } catch (err) {
        throw new Error('This puzzle was not found.');
    }
    if (day === null) throw new Error('This puzzle was not found.');

    const { part1, part2 } = await oraPromise(
        'parse input',
        day,
        'input parsed successfully.'
    );
    const part = parseInt(pa);

    if (isNaN(part) || part === 0 || part === 1) {
        console.log(chalk.bold('Part 1:'));
        await oraPromise('puzzle 1', part1);
    }

    if (isNaN(part) || part === 0 || part === 2) {
        console.log(chalk.bold('Part 2:'));
        await oraPromise('puzzle 2', part2);
    }
}
