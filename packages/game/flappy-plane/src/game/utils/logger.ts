export enum LogLevel {
  TRACE = 1,
  ASSERT = 2,
  LOG = 3,
  DEBUG = 4,
  INFO = 5,
  WARN = 6,
  ERROR = 7,
}

export class Logger {
  private static isInitialize: boolean = false;
  private static gameName: string = '';
  private static logLevel: LogLevel = LogLevel.WARN;

  private static enableConsole: boolean = false;

  private static enableNetwork: boolean = false;
  private static serverUrl: string = '';

  // 초기화는 한번만 가능하며 초기화 하지 않으면 동작하지 않는다다
  public static initialize(gameName: string) {
    if (Logger.isInitialize) return;
    Logger.isInitialize = true;
    Logger.gameName = gameName;
  }

  // 기본값은 WARN
  public static setLogLevel(logLevel: LogLevel) {
    Logger.logLevel = logLevel;
  }

  // 기본값은 off
  public static setConsoleLogEnabled(isEnable: boolean) {
    Logger.enableConsole = isEnable;
  }

  public static toggleConsoleEnable(): void {
    Logger.enableConsole = !Logger.enableConsole;
    console.log(
      `[${Logger.gameName}] Console logging is now ${Logger.enableConsole ? 'ENABLED' : 'DISABLED'}.`
    );
  }

  // 기본값은 off
  public static setNetworkLogEnabled(isEnable: boolean) {
    Logger.enableConsole = isEnable;
  }

  // ServerUrl을 하지 않으면 네트워크로 전송 불가
  public static setServerUrl(serverUrl: string) {
    Logger.serverUrl = serverUrl;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static trace(message?: any, ...optionalParams: any[]) {
    if (!Logger.isInitialize) return;
    if (Logger.logLevel <= LogLevel.TRACE) return;
    Logger.sendMessage('TRACE', message, ...optionalParams);
    if (!Logger.enableConsole) return;
    // eslint-disable-next-line no-console
    console.trace(`[${Logger.gameName}] ${message}`, ...optionalParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static assert(condition?: boolean, message?: string, ...data: any[]) {
    if (!Logger.isInitialize) return;
    if (Logger.logLevel <= LogLevel.ASSERT) return;
    Logger.sendMessage('ASSERT', message, ...data);
    if (!Logger.enableConsole) return;
    // eslint-disable-next-line no-console
    console.assert(condition, `[${Logger.gameName}] ${message}`, ...data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static log(message?: any, ...optionalParams: any[]) {
    if (!Logger.isInitialize) return;
    if (Logger.logLevel <= LogLevel.LOG) return;
    Logger.sendMessage('LOG', message, ...optionalParams);
    if (!Logger.enableConsole) return;
    // eslint-disable-next-line no-console
    console.log(`[${Logger.gameName}] ${message}`, ...optionalParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static debug(message?: any, ...optionalParams: any[]) {
    if (!Logger.isInitialize) return;
    if (Logger.logLevel <= LogLevel.DEBUG) return;
    Logger.sendMessage('DEBUG', message, ...optionalParams);
    if (!Logger.enableConsole) return;
    // eslint-disable-next-line no-console
    console.debug(`[${Logger.gameName}] ${message}`, ...optionalParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static info(message?: any, ...optionalParams: any[]) {
    if (!Logger.isInitialize) return;
    if (Logger.logLevel <= LogLevel.INFO) return;
    Logger.sendMessage('INFO', message, ...optionalParams);
    if (!Logger.enableConsole) return;
    // eslint-disable-next-line no-console
    console.info(`[${Logger.gameName}] ${message}`, ...optionalParams);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static warn(message?: any, ...optionalParams: any[]) {
    if (!Logger.isInitialize) return;
    if (Logger.logLevel <= LogLevel.WARN) return;
    Logger.sendMessage('WARN', message, ...optionalParams);
    if (!Logger.enableConsole) return;
    const style = 'font-weight: bold;';

    console.warn(
      `%c[${Logger.gameName}] ${message}%c`,
      style,
      '',
      ...optionalParams
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static error(message?: any, ...optionalParams: any[]) {
    if (!Logger.isInitialize) return;
    if (Logger.logLevel <= LogLevel.ERROR) return;
    Logger.sendMessage('ERROR', message, ...optionalParams);
    if (!Logger.enableConsole) return;
    const style = 'color: red; font-weight: bold;';

    console.error(
      `%c[${Logger.gameName}] ${message}%c`,
      style,
      '',
      ...optionalParams
    );
  }

  private static async sendMessage(
    logLevel: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...optionalParams: any[]
  ) {
    if (!Logger.enableNetwork) return;
    if (Logger.serverUrl === '') return;

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
    } catch (error) {
      console.error('Error sending log message:', error);
    }
  }
}
