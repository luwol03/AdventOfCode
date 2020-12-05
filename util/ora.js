const ora = require('ora');
const chalk = require('chalk');
const { performance } = require('perf_hooks');
const { round } = require('./util');

const oraPromise = (text, promise, resolveText) => {
    const startTime = performance.now();

    const spinner = ora(text).start();

    return promise()
        .then((res) => {
            const t = round(performance.now() - startTime, 3);
            spinner.succeed(
                `${resolveText || res} (${chalk.magenta(t + 'ms')})`
            );
            return res;
        })
        .catch((e) => {
            const t = round(performance.now() - startTime, 3);
            spinner.fail(
                chalk.red(`${e.toString()} (failed after ${t + 'ms'})`)
            );
            throw e;
        });
};

module.exports = {
    oraPromise,
};
