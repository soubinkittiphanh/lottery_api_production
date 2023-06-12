
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.colorize()
  ),
  transports: [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
            winston.format.colorize()
          ),
    }),
    new winston.transports.File({ filename: 'logs.log' })
  ]
});

// module.exports = logger;

// Log some messages
logger.log('info', 'Hello, Winston!');
logger.warn('This is a warning message.');
logger.error('This is an error message.');

// You can also use the level-specific methods:
logger.info('This is an information message.');
logger.debug('This is a debug message.');

// You can also add custom metadata to your logs:
logger.info('User logged in', { username: 'johndoe', ip: '192.168.1.1' });

module.exports = logger;