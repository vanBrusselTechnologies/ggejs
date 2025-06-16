const {LogVerbosity} = require("../utils/Constants");

class Logger {
    verbosity = LogVerbosity.Error;

    e(...message) {
        if (LogVerbosity.Error > this.verbosity) return;
        console.error(...message);
    }

    w(...message) {
        if (LogVerbosity.Warning > this.verbosity) return;
        console.warn(...message);
    }

    i(...message) {
        if (LogVerbosity.Info > this.verbosity) return;
        console.log(...message);
    }

    d(...message) {
        if (LogVerbosity.Debug > this.verbosity) return;
        console.log(...message);
    }

    t(...message) {
        if (LogVerbosity.Trace > this.verbosity) return;
        console.log(...message);
    }
}

module.exports = Logger;