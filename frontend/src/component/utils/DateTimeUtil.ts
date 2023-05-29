export default class DateTimeUtils {
    static convertToGMT (date: Date) {
        let timezoneOffset = date.getTimezoneOffset();
        return new Date(date.setMinutes(date.getMinutes()+timezoneOffset))
    }
    static convertFromGMT (date: Date) {
        let timezoneOffset = date.getTimezoneOffset();
        return new Date(date.setMinutes(date.getMinutes()-timezoneOffset))
    }
}