export default class DateTimeUtils {
    static convertToGMT (date: Date) {
        const timezoneOffset = date.getTimezoneOffset();
        return new Date(date.setMinutes(date.getMinutes()+timezoneOffset))
    }
    static convertFromGMT (date: Date) {
        const timezoneOffset = date.getTimezoneOffset();
        return new Date(date.setMinutes(date.getMinutes()-timezoneOffset))
    }
}