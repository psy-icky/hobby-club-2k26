// Real Google Meet & Google Calendar Integration Utilities for Hobby Club 2k26

export function getRealInstantMeetUrl() {
  return `https://meet.google.com/new`;
}

export function generateMeetCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const segment = (len) => {
    let str = '';
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  };
  return `${segment(3)}-${segment(4)}-${segment(3)}`;
}

export function createMeetUrl(code) {
  const cleanCode = code ? code.trim().replace(/^https?:\/\/meet\.google\.com\//, '') : generateMeetCode();
  return `https://meet.google.com/${cleanCode}`;
}

export function formatMeetUrl(inputUrl) {
  if (!inputUrl) return `https://meet.google.com/new`;
  const trimmed = inputUrl.trim();
  if (trimmed.startsWith('https://meet.google.com/')) {
    return trimmed;
  }
  const cleanCode = trimmed.replace(/[^a-z0-9-]/gi, '').toLowerCase();
  return `https://meet.google.com/${cleanCode}`;
}

export function generateGoogleCalendarUrl({ title, description, date, startTime, endTime, meetUrl }) {
  try {
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime || startTime}:00`);
    
    if (endDateTime <= startDateTime) {
      endDateTime.setTime(startDateTime.getTime() + 60 * 60 * 1000);
    }

    const formatCalTime = (d) => {
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const datesParam = `${formatCalTime(startDateTime)}/${formatCalTime(endDateTime)}`;
    const details = `${description || 'Hobby Club 2k26 Executive Assembly'}\n\nGoogle Meet Room: ${meetUrl || 'https://meet.google.com/new'}\nCreated via Hobby Club 2k26 Executive Portal.`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `[Hobby Club 2k26] ${title}`,
      dates: datesParam,
      details: details,
      location: meetUrl || 'Google Meet'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch (err) {
    console.error('Error generating Google Calendar URL:', err);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&location=Google+Meet`;
  }
}

export function downloadIcsFile({ title, description, date, startTime, endTime, meetUrl }) {
  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(`${date}T${endTime || startTime}:00`);
  if (endDateTime <= startDateTime) {
    endDateTime.setTime(startDateTime.getTime() + 60 * 60 * 1000);
  }

  const formatIcsTime = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hobby Club 2k26//Executive Portal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `SUMMARY:[Hobby Club 2k26] ${title}`,
    `DESCRIPTION:${description ? description.replace(/\n/g, '\\n') : ''}\\n\\nGoogle Meet Link: ${meetUrl}`,
    `LOCATION:${meetUrl || 'Google Meet'}`,
    `DTSTART:${formatIcsTime(startDateTime)}`,
    `DTEND:${formatIcsTime(endDateTime)}`,
    `URL:${meetUrl || 'https://meet.google.com'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '-')}-hobby-club.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
