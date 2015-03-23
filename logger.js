var bunyan = require('bunyan');
var logger;
createLogger = function createLogger() {
    if (logger) return logger;
    var opts = {
        name: 'doorkit-broker',
        streams: [{
            level: 'info',
            stream: process.stdout
            // path: 'logs/info.log',
            // period: '1w',
            // count: 53
        }, {
            level: 'error',
            stream: process.stderr
            // path: 'logs/error.log',
            // period: '1w',
            // count: 53
        }]
    };
    logger = bunyan.createLogger(opts);
    return logger;
};

module.exports = createLogger;