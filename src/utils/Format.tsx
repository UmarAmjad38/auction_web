export const formatTime = (time: any) => {
    if (time) {
        const [hour, minute] = time.split(":");
        const suffix = +hour >= 12 ? "PM" : "AM";
        const formattedHour = +hour % 12 || 12; // Convert hour to 12-hour format
        return `${formattedHour}:${minute} ${suffix}`;
    }
};

export const formatDate = (dateString: any) => {
    const date = new Date(dateString); // Convert string to Date object
    const month = date.getMonth() + 1; // Months are zero-indexed
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year} 12:00:00 AM`;
};

export const formatDateInput = (dateStr: string) => {
    // Split the input string into day, month, and year
    const [day, month, year] = dateStr.split('-');

    // Construct a valid date string in the format 'YYYY-MM-DD'
    const validDateStr = `${year}-${month}-${day}`;

    // Create a new Date object
    const date = new Date(validDateStr);

    // Format the date back to 'YYYY-MM-DD'
    const formattedYear = date.getFullYear();
    const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const formattedDay = String(date.getDate()).padStart(2, '0');

    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
};

export const formatTimeInput = (timeStr: string) => {

    // Extract hours, minutes, and period (AM/PM) using regex
    if (timeStr) {
        const match = timeStr?.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) {
            return '';
        }

        let [_, hours, minutes, period] = match;
        let formattedHours = parseInt(hours, 10);

        // Convert hours to 24-hour format
        if (period.toUpperCase() === "PM" && formattedHours !== 12) {
            formattedHours += 12;
        } else if (period.toUpperCase() === "AM" && formattedHours === 12) {
            formattedHours = 0;
        }

        const formattedTime = `${String(formattedHours).padStart(2, '0')}:${minutes}`;
        return formattedTime;
    }
};