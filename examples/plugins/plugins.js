const loggin = require('../..'); // require('loggin-js');
const plugin = require('./severity.js');

loggin.use(plugin);

let formatter = loggin.formatter('long');
let logger = loggin.logger({
    level: loggin.severity('custom'),
    color: true,
    formatter: formatter
});

logger.debug('asdasd');
logger.custom('custom level');

