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

export function formatDate(inputString) {
    // Create a Date object from the input string
    const date = new Date(inputString);
  
    // Ensure two digits for day and month (leading zeros if needed)
    const pad = (number) => String(number).padStart(2, '0');
  
    // Format day, month, year, and day of the week 
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Month starts at 0
    const year = date.getFullYear();
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: 'long' }); // Get full weekday name
  
    // Combine formatted parts with separator
    return `${dayOfWeek}, ${day}-${month}-${year}`;
  }

export function dateTimeFormatter(date, timeString) {
    let [hours, minutes] = timeString.split(':').map(Number);
    let newDate = new Date(date.setHours(hours, minutes));
    console.log(newDate);
    return newDate
}