class DateTimeUtils {
    static millisToDate(millis) {
        const date = new Date(millis);
        const options = {
            weekday: "short",
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        };
        const formattedDate = date.toLocaleDateString("en-US", options);
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const amPm = hours >= 12 ? "pm" : "am";
        const formattedTime = `${hours % 12 || 12}:${minutes}${amPm}`;
        return `${formattedDate} ${formattedTime}`;
    }
}

export default DateTimeUtils;
