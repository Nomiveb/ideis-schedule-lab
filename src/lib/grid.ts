import { ScheduleEvent, toDottedDate } from "./schedule";

const columns = [
  "Czas od",
  "Czas do",
  "Liczba godzin",
  "Grupy",
  "Zajęcia",
  "Forma",
  "Sala",
  "Prowadzący",
  "Forma zaliczenia",
  "ProwGr ID",
  "Uwagi",
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderScheduleGrid(events: ScheduleEvent[]) {
  let currentDate = "";
  let rowIndex = 0;
  const rows: string[] = [];

  for (const event of events) {
    if (event.date !== currentDate) {
      currentDate = event.date;
      rows.push(`
        <tr class="dxgvGroupRow">
          <td colspan="11">Date of Activities: ${toDottedDate(event.date)}</td>
        </tr>
      `);
    }

    rowIndex += 1;
    rows.push(`
      <tr id="gridViewPlanyTokow_DXDataRow${rowIndex}" class="dxgvDataRow">
        <td>${escapeHtml(event.startTime)}</td>
        <td>${escapeHtml(event.endTime)}</td>
        <td>${escapeHtml(event.duration)}</td>
        <td>${escapeHtml(event.groupName)}</td>
        <td>${escapeHtml(event.subject)}</td>
        <td>${escapeHtml(event.form)}</td>
        <td>${escapeHtml(event.room)}</td>
        <td>${escapeHtml(event.teacher)}</td>
        <td>${escapeHtml(event.credit)}</td>
        <td>${escapeHtml(event.prowgrId)}</td>
        <td>${escapeHtml(event.notes)}</td>
      </tr>
    `);
  }

  return `
    <table id="gridViewPlanyTokow_DXMainTable" class="dxgvTable">
      <thead>
        <tr class="dxgvHeader">
          ${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>${rows.join("")}</tbody>
    </table>
  `;
}
