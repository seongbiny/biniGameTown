export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["TRACE"] = 1] = "TRACE";
    LogLevel[LogLevel["ASSERT"] = 2] = "ASSERT";
    LogLevel[LogLevel["LOG"] = 3] = "LOG";
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 5] = "INFO";
    LogLevel[LogLevel["WARN"] = 6] = "WARN";
    LogLevel[LogLevel["ERROR"] = 7] = "ERROR";
})(LogLevel || (LogLevel = {}));
export class Logger {
    // 초기화는 한번만 가능하며 초기화 하지 않으면 동작하지 않는다다
    static initialize(gameName) {
        if (Logger.isInitialize)
            return;
        Logger.isInitialize = true;
        Logger.gameName = gameName;
    }
    // 기본값은 WARN
    static setLogLevel(logLevel) {
        Logger.logLevel = logLevel;
    }
    // 기본값은 off
    static setConsoleLogEnabled(isEnable) {
        Logger.enableConsole = isEnable;
    }
    static toggleConsoleEnable() {
        Logger.enableConsole = !Logger.enableConsole;
        console.log(`[${Logger.gameName}] Console logging is now ${Logger.enableConsole ? 'ENABLED' : 'DISABLED'}.`);
    }
    // 기본값은 off
    static setNetworkLogEnabled(isEnable) {
        Logger.enableConsole = isEnable;
    }
    // ServerUrl을 하지 않으면 네트워크로 전송 불가
    static setServerUrl(serverUrl) {
        Logger.serverUrl = serverUrl;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static trace(message, ...optionalParams) {
        if (!Logger.isInitialize)
            return;
        if (Logger.logLevel <= LogLevel.TRACE)
            return;
        Logger.sendMessage('TRACE', message, ...optionalParams);
        if (!Logger.enableConsole)
            return;
        // eslint-disable-next-line no-console
        console.trace(`[${Logger.gameName}] ${message}`, ...optionalParams);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static assert(condition, message, ...data) {
        if (!Logger.isInitialize)
            return;
        if (Logger.logLevel <= LogLevel.ASSERT)
            return;
        Logger.sendMessage('ASSERT', message, ...data);
        if (!Logger.enableConsole)
            return;
        // eslint-disable-next-line no-console
        console.assert(condition, `[${Logger.gameName}] ${message}`, ...data);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static log(message, ...optionalParams) {
        if (!Logger.isInitialize)
            return;
        if (Logger.logLevel <= LogLevel.LOG)
            return;
        Logger.sendMessage('LOG', message, ...optionalParams);
        if (!Logger.enableConsole)
            return;
        // eslint-disable-next-line no-console
        console.log(`[${Logger.gameName}] ${message}`, ...optionalParams);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static debug(message, ...optionalParams) {
        if (!Logger.isInitialize)
            return;
        if (Logger.logLevel <= LogLevel.DEBUG)
            return;
        Logger.sendMessage('DEBUG', message, ...optionalParams);
        if (!Logger.enableConsole)
            return;
        // eslint-disable-next-line no-console
        console.debug(`[${Logger.gameName}] ${message}`, ...optionalParams);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static info(message, ...optionalParams) {
        if (!Logger.isInitialize)
            return;
        if (Logger.logLevel <= LogLevel.INFO)
            return;
        Logger.sendMessage('INFO', message, ...optionalParams);
        if (!Logger.enableConsole)
            return;
        // eslint-disable-next-line no-console
        console.info(`[${Logger.gameName}] ${message}`, ...optionalParams);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static warn(message, ...optionalParams) {
        if (!Logger.isInitialize)
            return;
        if (Logger.logLevel <= LogLevel.WARN)
            return;
        Logger.sendMessage('WARN', message, ...optionalParams);
        if (!Logger.enableConsole)
            return;
        const style = 'font-weight: bold;';
        console.warn(`%c[${Logger.gameName}] ${message}%c`, style, '', ...optionalParams);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static error(message, ...optionalParams) {
        if (!Logger.isInitialize)
            return;
        if (Logger.logLevel <= LogLevel.ERROR)
            return;
        Logger.sendMessage('ERROR', message, ...optionalParams);
        if (!Logger.enableConsole)
            return;
        const style = 'color: red; font-weight: bold;';
        console.error(`%c[${Logger.gameName}] ${message}%c`, style, '', ...optionalParams);
    }
    static async sendMessage(logLevel, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...optionalParams) {
        if (!Logger.enableNetwork)
            return;
        if (Logger.serverUrl === '')
            return;
        const logData = {
            gameName: Logger.gameName,
            logLevel: logLevel,
            message,
            optionalParams,
            timestamp: new Date().toISOString(),
        };
        try {
            const response = await fetch(Logger.serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logData),
            });
            if (!response.ok) {
                console.error('Failed to send log message:', response.statusText);
            }
        }
        catch (error) {
            console.error('Error sending log message:', error);
        }
    }
}
Object.defineProperty(Logger, "isInitialize", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
});
Object.defineProperty(Logger, "gameName", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ''
});
Object.defineProperty(Logger, "logLevel", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LogLevel.WARN
});
Object.defineProperty(Logger, "enableConsole", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
});
Object.defineProperty(Logger, "enableNetwork", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
});
Object.defineProperty(Logger, "serverUrl", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ''
});
