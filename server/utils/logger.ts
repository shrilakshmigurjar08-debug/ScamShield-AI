export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  context?: Record<string, any>;
}

export class Logger {
  private module: string;

  constructor(module: string) {
    this.module = module;
  }

  private format(level: LogLevel, message: string, context?: Record<string, any>): string {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      module: this.module,
      message,
      ...(context ? { context } : {}),
    };
    return `[${entry.timestamp}] [${entry.level}] [${entry.module}] ${entry.message}${
      context ? ' ' + JSON.stringify(context) : ''
    }`;
  }

  debug(message: string, context?: Record<string, any>): void {
    if (process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development') {
      console.debug(this.format('DEBUG', message, context));
    }
  }

  info(message: string, context?: Record<string, any>): void {
    console.info(this.format('INFO', message, context));
  }

  warn(message: string, context?: Record<string, any>): void {
    console.warn(this.format('WARN', message, context));
  }

  error(message: string, context?: Record<string, any>): void {
    console.error(this.format('ERROR', message, context));
  }
}

export const createLogger = (module: string) => new Logger(module);

