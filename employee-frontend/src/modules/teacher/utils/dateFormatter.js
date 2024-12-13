export function getTodaysDate() {
    var currentDate = new Date();
    var month = currentDate.toLocaleString('default', { month: 'long' }); // Get full name of the month
    var day = currentDate.getDate();

    // Add leading zero if necessary
    day = (day < 10 ? '0' : '') + day;

    // Return the formatted date string in "Month day" format
    return month + ' ' + day;
}

export function getTodaysDay() {
    // Create a new Date object
    var today = new Date();

    // Get the day of the week (0-6, where 0 is Sunday, 1 is Monday, ..., 6 is Saturday)
    var dayOfWeek = today.getDay();

    // Array of day names
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Return the day of the week as a string
    return days[dayOfWeek];
}

export function dateString(dateString){

    let date = new Date(dateString);

    // Get the year, month, and day from the Date object
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    let day = String(date.getDate()).padStart(2, '0');

    // Construct the formatted date string in YYYY-MM-DD format
    let formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

export function daysBetween(dateString1, dateString2) {
    // Parse the input date strings into Date objects
    let date1 = new Date(dateString1);
    let date2 = new Date(dateString2);

    // Calculate the difference in time (in milliseconds)
    let timeDifference = Math.abs(date2 - date1);

    // Convert time difference from milliseconds to days
    let daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysDifference;
}

export function dateTimeFormatter(date, timeString) {
    let [hours, minutes] = timeString.split(':').map(Number);
    console.log("date: ",date, "time: ",timeString);
    console.log(hours, minutes);
    let newDate = new Date(date.setHours(hours, minutes));
    console.log(newDate);
    return newDate
}

// Example usage
// let date1 = '2024-06-04';
// let date2 = '2024-06-10';
// let numberOfDays = daysBetween(date1, date2);

// // console.log(numberOfDays); // Output: 6
