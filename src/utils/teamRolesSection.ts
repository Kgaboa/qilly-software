import { Paragraph, TextRun, HeadingLevel } from 'docx';

export function getTeamRolesSection() {
  return [
    // ===== KEY TEAM ROLES & RESPONSIBILITIES =====
    new Paragraph({
      text: "7. KEY TEAM ROLES & RESPONSIBILITIES",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 200 },
    }),
  ];
}