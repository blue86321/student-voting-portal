export default class Logger {
    static isDebug = process.env.NODE_ENV !== 'production';

    static debug (message, ...args: any[]): void {
        if (this.isDebug) {
            console.log(message, args.length === 0 ? "" : args);
        }
    }
    static error (message, ...args: any[]) {
        console.error(message, args.length === 0 ? "" : args);
    }
}