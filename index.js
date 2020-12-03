const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
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
    );

program.parse(process.argv);

(async function () {
    const p = path.resolve(`${program.year}`);

    if (fs.existsSync(p)) {
        const pu = (await fs.promises.readdir(p))[program.day - 1];

        if (pu && parseInt(pu.slice(0, 2)) === parseInt(program.day)) {
            try {
                const day = require(`./${program.year}/${pu}`);
                const { part1, part2 } = await day();

                const spinner1 = ora('puzzle 1').start();

                part1()
                    .then((res1) => {
                        spinner1.succeed(res1);
                        
                        const spinner2 = ora('puzzle 2').start();
                        part2()
                            .then((res2) => {
                                spinner2.succeed(res2);
                            })
                            .catch((err2) => {
                                spinner2.fail(err2);
                            });
                    })
                    .catch((err1) => {
                        spinner1.fail(err1);
                    });
            } catch (error) {
                console.log(chalk.red('This puzzle was not found or an error occurred.'));
            }
        }
    }
})();
