export function formatDateHumanReadable(dateStr: string) {
  const dateObj = new Date(dateStr);

  // Options for formatting the date
  const options: any = {
    day: 'numeric',   // "2"
    month: 'long',    // "April"
    year: 'numeric'   // "2019"
  };

  // Format the date using the browser's/system's locale settings
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);
  
  // The default output will be "April 2, 2019" (or "2 April, 2019" depending on locale)
  // To get the 'th' suffix ("2nd April, 2019"), we need one extra step.
  return addDaySuffix(formattedDate);
}

export function addDaySuffix(dateStr: string): string {
    
    return dateStr.replace(/(\d+)/, (match, dayStr) => {
        // Convert the string day number to an integer
        const day = parseInt(dayStr, 10); 

        // Now we can safely use comparison and modulo operators with 'day'
        if (day > 3 && day < 21) return day + 'th'; // 4th through 20th
        switch (day % 10) {
            case 1:  return day + 'st';
            case 2:  return day + 'nd';
            case 3:  return day + 'rd';
            default: return day + 'th';
        }
    });
}