# Loggin' JS

<!-- ![Preview](https://github.com/nombrekeff/loggin-js/blob/master/examples/example-output-formater.PNG?raw=true) -->


[![NPM version][npm-image]][npm-url]
[![NPM quality][code-quality-badge]][code-quality-link]
[![build status][travis-image]][travis-url]
[![Downloads][downloads-badge]][downloads-link]
[![Dependencies][dependencies-badge]][dependencies-link]
[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-link]


<!-- Links -->
[npm-image]: https://img.shields.io/npm/v/loggin-js.svg?style=flat-square
[npm-url]: https://npmjs.org/package/loggin-js

[travis-image]: https://img.shields.io/travis/nombrekeff/loggin-js.svg?style=flat-square
[travis-url]: https://travis-ci.org/nombrekeff/loggin-js

[code-quality-badge]: http://npm.packagequality.com/shield/loggin-js.svg?style=flat-square
[code-quality-link]: https://packagequality.com/#?package=loggin-js

[downloads-badge]: https://img.shields.io/npm/dt/loggin-js.svg?style=flat-square
[downloads-link]: https://www.npmjs.com/package/loggin-js

[dependencies-badge]: https://img.shields.io/david/nombrekeff/loggin-js.svg?style=flat-square
[dependencies-link]: https://david-dm.org/nombrekeff/loggin-js?view=tree

[vulnerabilities-badge]: https://snyk.io/test/npm/loggin-js/badge.svg?style=flat-square
[vulnerabilities-link]: https://snyk.io/test/npm/loggin-js

A little customizable logger for NodeJS.  
Log to the **console**, to a **file**, to a **remote service** or create a custom one.
> Based on standard **[RFC3164][RFC3164]**

### Features
* ✔︎ Easy 
* ✔︎ Customizable
* ✔︎ Liteweighted
* ✔︎ Follows standard [RFC3164][RFC3164]

### Docs & Community
* [Get started](#get-started)
* [Usage](#basic-usage)
* [Examples](#examples)
* [Collaborating](#collaborating)
* [Docs](https://github.com/nombrekeff/logging-js/wiki)

### Get-Started
* Install with npm
```bash
npm install loggin-js --save
```

* Test it works, and see how it looks:
```bash
node run examples/basic-example.js
```

### Usage
#### Using in node
```javascript
// Require the logging library
const logging = require('loggin-js');
```
#### Using in browser #IN-PROCESS
<!-- ```html
<script src="./node_modules/loggin-js/build/loggin-js.min.js"></script>
<script>
  let logger = LogginJS.createLogger();
</script>
``` -->


### Examples
##### Simple Example
In this example we create a new logger with a severity of DEBUG, and we set color to true.  
This means it will output any log to the console as DEBUG englobes all other severities

We create it making use of the `logging.getLogger(options?)` method that creates a logger based on the options.  
_There are other ways of creating a Logger as described in the examples and docs_

```javascript
// Require the logging library
const logging = require('loggin-js');

// Shortcuts
const { Severity } = logging;

// Get a logger with DEBUG severity. 
// Severity DEBUG will output any severity.
const logger = logging.getLogger({
  
  // level can be a <string> = 'DEBUG' a <int> = 7 or a <Severity> = Severity.DEBUG 
  level: 'DEBUG',

  // If output should be colored
  color: true,

  // Set formatter to medium - one of: ['short', 'medium', 'long']
  formatter: 'medium',
});

// Does the same as passing into settings, as done above
logger.setLevel(Severity.DEBUG);
logger.setColor(true);
logger.setFormatter('medium');


// Available predefined log levels
logger.info('info', { user: 'pedro', id: 10 });
logger.error('error');
logger.warning('warning');
logger.alert('alert');
logger.emergency('emergency');
logger.critical('critical');
logger.debug('debug');
logger.notice('Notice', {}, 'channel');


// If enabled set to false logs will not be output
logger.setEnabled(false);
```


##### File Logging Example
Log to files instead of the console

We create it making use of the `FileLogger` class.  
```javascript
// Require the logging library
const logging = require('loggin-js');

// Shortcut for the severity constants
const { Severity, Loggers, Notifiers } = logging;

// Create a file logger
const logger = new Loggers.FileLogger({
  
  // Display line number at the begining of the log 
  lineNumbers: true,

  // You can pass a pipes array to the file logger or you can do after instancing (showed below)
  pipes: [

    // Here we create a pipe that will pipe level ERROR logs to the file 'logs/error-logs.log'
    new Notifiers.Pipe(Severity.ERROR, 'logs/error-logs.log'),

    // This one will pipe level INFO logs to the file 'logs/info-logs.log'
    new Notifiers.Pipe(Severity.INFO, 'logs/info-logs.log')
  ]
});

// You can also add pipes after creating the logger as follows
logger.pipe(Severity.ERROR, 'logs/error-logs.log');
logger.pipe(Severity.INFO, 'logs/info-logs.log');


// INFO message will log to 'logs/info-logs.log'
logger.info('Logging a info log');

// ERROR message will log to 'logs/error-logs.log'
logger.error('Logging a error log', new Error('An error'));

// Will not be logged as only the ERROR and INFO severities will be output to their respective files
logger.warning('Logging a warning log');
logger.notice('Logging a notice log');
logger.alert('Logging a error log');
```

##### Custom Formatter Example
Custom formatter, customize the output of the log 
```javascript
const logging = require('loggin-js');
const logger = logging.getLogger({
  level: logging.Severity.DEBUG,
  color: true,

  /**
   * You can also use a custom formatter if the default one does not satisfy your needs.
   * In the formatter you can access all log properties and you can also set the 
   * color of some segments of the log by using <%L> where L is one of:
   *  - r red
   *  - g green
   *  - gr gray
   *  - b blue
   *  - p pink
   *  - y yellow
   *  - c cyan
   *  - m magenta
   *  - (nnn) a number between 0-255 # not implemented yet
   */
  formatter: '[{time.toLocaleString}] - <%m{user}> | {severityStr} | {message} - {JSON.stringify(data)}'
});

// Set user to root
logger.setUser('root');

// Set formatter
logger.setFormatter('[{time.toLocaleString}] - <%m{user}> | {severityStr} | {message} - {JSON.stringify(message)}');

// Log something
logger.debug('debug');             // $ [2018-6-2 00:46:24] - root - DEBUG - debug
logger.info('info', {data: 'Hi'}); // $ [2018-6-2 00:46:24] - root - INFO - info - {"data":"Hi"}


/**
 * Aditionally you can set the color of some parts of the message:
 * The output will be something like, with the last ERROR beeing red:
 * $ [2018-6-2 00:46:24] - root - ERROR - There was an ERROR 
 */
logger.error('There was an <%rERROR>'); 
```


### Collaborating
Hi there, if you like the project don't hesitate in collaborating (_if you like to_), submit a pull request, post an issue, ...   
It's just a little sideproject, nothing serius, so its just for fun!  
But any **help** or **ideas** are apreciated!


[RFC3164]: https://tools.ietf.org/html/rfc3164