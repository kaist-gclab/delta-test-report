import moment = require('moment');

export class Logger {

    private category = '(null)';
    constructor(category: string) {
        this.category = category;
    }
    public log(level: string, message: string): void {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        console.log(`${timestamp} ${this.category}\t${level}\t${message}`);
    }

    public info(message: string): void {
        return this.log("INFO", message);
    }

    public error(message: string): void {
        return this.log("ERROR", message);
    }
}
