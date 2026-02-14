document.addEventListener('DOMContentLoaded', () => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Helper function to get the start of the week (Sunday) for a given date
    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay(); // 0 for Sunday, 1 for Monday, etc.
        const diff = d.getDate() - day; // Adjust date to Sunday
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    document.querySelectorAll('[id^="event-date-"]').forEach(timeElement => {
        let eventDate;
        const datetimeAttr = timeElement.getAttribute('datetime');
        
        if (datetimeAttr) {
            eventDate = new Date(datetimeAttr);
        } else {
            // Extract date from the ID: "event-date-YYYYMMDD"
            const id = timeElement.id;
            const dateMatch = id.match(/event-date-(\d{4})(\d{2})(\d{2})/);
            if (dateMatch) {
                const year = parseInt(dateMatch[1]);
                const month = parseInt(dateMatch[2]) - 1; // Month is 0-indexed
                const day = parseInt(dateMatch[3]);
                eventDate = new Date(year, month, day);
            } else {
                console.error("Could not parse date from ID:", id);
                return;
            }
        }

        if (isNaN(eventDate.getTime())) {
            console.error("Invalid date object after parsing:", eventDate);
            return;
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0); // Normalize 'now' to start of today
        eventDate.setHours(0, 0, 0, 0); // Normalize 'eventDate' to start of its day

        const diffTime = eventDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let tag = '';
        let tagClass = 'seminar-dynamic-tag'; // Base class

        if (diffDays === 0) {
            tag = 'Today';
            tagClass += ' seminar-tag-today';
        } else if (diffDays === 1) {
            tag = 'Tomorrow';
            tagClass += ' seminar-tag-tomorrow';
        } else if (diffDays > 1 && diffDays <= 7) {
            const eventDayOfWeek = eventDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
            const nowDayOfWeek = now.getDay();

            // Use seminar-tag-recent for all "This Xday" and "Next Xday"
            if (eventDayOfWeek > nowDayOfWeek) { // If event day is later in the current week
                tag = `This ${dayNames[eventDayOfWeek]}`;
            } else { // If event day is earlier in the week (meaning it must be next week since diffDays > 1)
                tag = `Next ${dayNames[eventDayOfWeek]}`;
            }
            tagClass += ' seminar-tag-recent'; // Use the simplified class
        } else if (diffDays > 7 && diffDays <= 21) {
            tag = 'Upcoming';
            tagClass += ' seminar-tag-upcoming';
        }

        if (tag) {
            const tagSpan = document.createElement('span');
            tagSpan.textContent = tag;
            tagSpan.className = tagClass;
            timeElement.parentNode.prepend(tagSpan);
        }
    });
});
