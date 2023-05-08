import chalk, { ChalkInstance } from 'chalk';
import { exit } from 'process';

enum LogLevel {
  DEBUG,
  INFO,
  WARNING,
  ERROR,
  FATAL
}

export class Logger {
  private static log(level: LogLevel, message: string) {
    let color: ChalkInstance;
    switch (level) {
      case LogLevel.DEBUG:
        color = chalk.blue.dim;
        break;
      case LogLevel.INFO:
        color = chalk.cyan;
        break;
      case LogLevel.WARNING:
        color = chalk.yellow.bold;
        break;
      case LogLevel.ERROR:
        color = chalk.red.bold;
        break;
      case LogLevel.FATAL:
        color = chalk.red.bold
        break;
      default:
        color = chalk.reset;
        break;
    }
    console.log(color(`[${LogLevel[level]}]: ${message}`));
  }

  static debug(message: string) {
    Logger.log(LogLevel.DEBUG, message);
  }

  static info(message: string) {
    Logger.log(LogLevel.INFO, message);
  }

  static warn(message: string) {
    Logger.log(LogLevel.WARNING, message);
  }

  static error(message: string) {
    Logger.log(LogLevel.ERROR, message);
  }

  static fatal(message: string) {
    Logger.log(LogLevel.FATAL, message)
    exit(1)
  }
}
