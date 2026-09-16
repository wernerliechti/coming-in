const EVENT = {
  title: "Wernus Comming In",
  startUtc: "20261013T160000Z",
  endUtc: "20261013T220000Z",
  location: "47.002972,7.699611",
  mapsUrl:
    "https://www.google.com/maps/place/47%C2%B000'10.7%22N+7%C2%B041'58.6%22E/@47.0029719,7.6989573,187",
};

function escapeIcs(value) {
  return value.replace(/([,;])/g, "\\$1");
}

function nowStamp() {
  return new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function buildIcs() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wernus Comming In//DE",
    "BEGIN:VEVENT",
    "UID:wernus-comming-in-2026@wernerliechti.ch",
    `DTSTAMP:${nowStamp()}`,
    `DTSTART:${EVENT.startUtc}`,
    `DTEND:${EVENT.endUtc}`,
    `SUMMARY:${escapeIcs(EVENT.title)}`,
    `LOCATION:${escapeIcs(EVENT.location)}`,
    `DESCRIPTION:${escapeIcs("Weg zum Event: " + EVENT.mapsUrl)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

const calendarLink = document.getElementById("calendar-link");
if (calendarLink) {
  calendarLink.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(buildIcs());
  calendarLink.setAttribute("download", "wernus-comming-in.ics");
}
