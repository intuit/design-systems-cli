import {
    SizeResult
} from "./interfaces"
import fileSize from 'file-size';
import colorette from 'colorette';

const FAILURE_THRESHOLD = 5;

/** Format the size to a human readable format. */
const format = (size: number) => {
    const result = fileSize(Math.abs(size)).human('si');

    return size < 0 ? `-${result}` : result;
};

/** Color truncate a percent value. */
const formatPercent = (num: number) => {
    const truncated = num.toFixed(Math.abs(num) < 1 && Math.abs(num) > 0 ? 2 : 0);
    const percent = `${truncated === '0.00' ? 0 : truncated}%`;

    if (num === Infinity) return 'N/A';
    if (num < 0) return colorette.green(percent);
    if (num > FAILURE_THRESHOLD) return colorette.red(percent);

    return percent;
};

/** Format a line of the output table. */
const formatLine = ({ master, pr }: SizeResult, css?: boolean) => {
    if (css) {
        const jsDiff = pr.js - master.js;
        const cssDiff = pr.css - master.css;

        return [
            format(master.js),
            format(pr.js),
            format(jsDiff),
            formatPercent((jsDiff / master.js) * 100),
            format(master.css),
            format(pr.css),
            format(cssDiff),
            formatPercent((cssDiff / (master.css || 1)) * 100)
        ];
    }

    const diff = pr.js + pr.css - (master.js + master.css);

    return [
        format(master.js + master.css),
        format(pr.js + pr.css),
        format(diff),
        formatPercent((diff / (master.js + master.css)) * 100)
    ];
};

/** Get the sum of some metric from a size result */
const sumResult = (
    results: SizeResult[],
    target: 'master' | 'pr',
    type: 'js' | 'css'
) => results.reduce((acc, result) => acc + result[target][type], 0);

/** Create the total line for the output table  */
const defaultTotals = (results: SizeResult[], css?: boolean) => {
    const masterJS = sumResult(results, 'master', 'js');
    const pullJS = sumResult(results, 'pr', 'js');
    const jsDiff = pullJS - masterJS;

    const masterCSS = sumResult(results, 'master', 'css');
    const pullCSS = sumResult(results, 'pr', 'css');
    const cssDiff = pullCSS - masterCSS;

    if (css) {
        return [
            'Total',
            format(masterJS),
            format(pullJS),
            format(jsDiff),
            formatPercent((jsDiff / masterJS) * 100),
            format(masterCSS),
            format(pullCSS),
            format(cssDiff),
            formatPercent((cssDiff / (masterCSS || 1)) * 100)
        ];
    }

    const diff = pullJS + pullCSS - (masterJS + masterCSS);

    return [
        'Total',
        format(masterJS + masterCSS),
        format(pullJS + pullCSS),
        format(diff),
        formatPercent((diff / (masterJS + masterCSS)) * 100)
    ];
};

export { formatLine, defaultTotals }