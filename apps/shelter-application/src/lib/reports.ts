import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export type ReportRow = (string | number)[]

export type ReportSection = {
  title: string
  head: string[]
  rows: ReportRow[]
  summary?: { label: string; value: string }[]
}

export type ReportDocument = {
  serial: string
  title: string
  subtitle: string
  period: string
  filedBy: string
  shelter: string
  intro?: string
  sections: ReportSection[]
}

const INK = [30, 41, 59] as const // slate-800
const MUTED = [100, 116, 139] as const // slate-500
const RULE = [203, 213, 225] as const // slate-300
const ACCENT = [217, 70, 47] as const // warm rust accent for editorial feel

export function downloadReportPdf(doc: ReportDocument) {
  const pdf = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const margin = 56
  let y = margin

  // Masthead
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.setTextColor(...MUTED)
  pdf.text('OPENPETS  ·  SHELTER RECORDS BUREAU', margin, y)
  pdf.text(doc.serial, pageW - margin, y, { align: 'right' })
  y += 10
  pdf.setDrawColor(...INK)
  pdf.setLineWidth(1.4)
  pdf.line(margin, y, pageW - margin, y)
  y += 6
  pdf.setLineWidth(0.4)
  pdf.line(margin, y, pageW - margin, y)
  y += 28

  // Title block
  pdf.setFont('times', 'bold')
  pdf.setFontSize(28)
  pdf.setTextColor(...INK)
  const titleLines = pdf.splitTextToSize(doc.title, pageW - margin * 2)
  pdf.text(titleLines, margin, y)
  y += 28 * titleLines.length

  pdf.setFont('times', 'italic')
  pdf.setFontSize(12)
  pdf.setTextColor(...MUTED)
  pdf.text(doc.subtitle, margin, y)
  y += 22

  // Meta strip
  pdf.setFont('courier', 'normal')
  pdf.setFontSize(8.5)
  pdf.setTextColor(...INK)
  const meta = [
    ['PERIOD', doc.period],
    ['SHELTER', doc.shelter],
    ['FILED BY', doc.filedBy],
    ['ISSUED', new Date().toISOString().slice(0, 10)],
  ]
  const colW = (pageW - margin * 2) / meta.length
  meta.forEach((m, i) => {
    const x = margin + colW * i
    pdf.setTextColor(...MUTED)
    pdf.text(m[0], x, y)
    pdf.setTextColor(...INK)
    pdf.text(m[1], x, y + 12)
  })
  y += 28
  pdf.setDrawColor(...RULE)
  pdf.setLineWidth(0.5)
  pdf.line(margin, y, pageW - margin, y)
  y += 18

  if (doc.intro) {
    pdf.setFont('times', 'normal')
    pdf.setFontSize(11)
    pdf.setTextColor(...INK)
    const intro = pdf.splitTextToSize(doc.intro, pageW - margin * 2)
    pdf.text(intro, margin, y)
    y += intro.length * 14 + 14
  }

  // Sections
  doc.sections.forEach((section, idx) => {
    if (y > pageH - 140) {
      pdf.addPage()
      y = margin
    }
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(8)
    pdf.setTextColor(...ACCENT)
    pdf.text(`§ ${String(idx + 1).padStart(2, '0')}`, margin, y)
    pdf.setTextColor(...INK)
    pdf.setFont('times', 'bold')
    pdf.setFontSize(14)
    pdf.text(section.title.toUpperCase(), margin + 28, y)
    y += 8
    pdf.setDrawColor(...INK)
    pdf.setLineWidth(0.6)
    pdf.line(margin, y, pageW - margin, y)
    y += 12

    autoTable(pdf, {
      startY: y,
      head: [section.head],
      body: section.rows.map((r) => r.map((c) => String(c))),
      theme: 'plain',
      margin: { left: margin, right: margin },
      styles: {
        font: 'helvetica',
        fontSize: 9.5,
        textColor: [...INK],
        cellPadding: { top: 6, right: 8, bottom: 6, left: 0 },
        lineColor: [...RULE],
        lineWidth: { bottom: 0.3 } as never,
      },
      headStyles: {
        font: 'helvetica',
        fontStyle: 'bold',
        fontSize: 7.5,
        textColor: [...MUTED],
        cellPadding: { top: 4, right: 8, bottom: 6, left: 0 },
        lineColor: [...INK],
        lineWidth: { bottom: 0.6 } as never,
      },
      didParseCell: (data) => {
        if (data.section === 'head') {
          data.cell.text = data.cell.text.map((t) => t.toUpperCase())
        }
      },
    })
    // @ts-expect-error lastAutoTable injected by autotable
    y = pdf.lastAutoTable.finalY + 16

    if (section.summary && section.summary.length) {
      const sumW = (pageW - margin * 2) / section.summary.length
      section.summary.forEach((s, i) => {
        const x = margin + sumW * i
        pdf.setFont('courier', 'normal')
        pdf.setFontSize(7.5)
        pdf.setTextColor(...MUTED)
        pdf.text(s.label.toUpperCase(), x, y)
        pdf.setFont('times', 'bold')
        pdf.setFontSize(16)
        pdf.setTextColor(...INK)
        pdf.text(s.value, x, y + 18)
      })
      y += 32
    }
    y += 12
  })

  // Footer
  const pageCount = pdf.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setFont('courier', 'normal')
    pdf.setFontSize(7.5)
    pdf.setTextColor(...MUTED)
    pdf.text(
      `${doc.serial}  ·  CONFIDENTIAL  ·  ${doc.shelter.toUpperCase()}`,
      margin,
      pageH - 28,
    )
    pdf.text(`PAGE ${i} / ${pageCount}`, pageW - margin, pageH - 28, {
      align: 'right',
    })
  }

  pdf.save(`${doc.serial}_${doc.title.replace(/\s+/g, '-')}.pdf`)
}

// ────────────────────────────────────────────────────────────────────────────
// Mock report data — these mirror what would come from server fns later

export const reportLibrary: ReportDocument[] = [
  {
    serial: 'RPT-2026-0042',
    title: 'Monthly Adoption Summary',
    subtitle: 'A complete record of placements, returns, and pending matches.',
    period: 'May 1 – May 20, 2026',
    filedBy: 'Sarah Jenkins',
    shelter: 'Hope Shelter',
    intro:
      'This dossier captures every adoption event recorded during the period, with applicant outcomes, average placement time, and follow-up obligations carried into the next cycle.',
    sections: [
      {
        title: 'Placements by species',
        head: ['Species', 'Listed', 'Adopted', 'Pending', 'Returned', 'Rate'],
        rows: [
          ['Dog', 64, 42, 6, 1, '65.6%'],
          ['Cat', 48, 28, 4, 0, '58.3%'],
          ['Rabbit', 9, 5, 1, 0, '55.5%'],
          ['Other', 6, 3, 1, 0, '50.0%'],
        ],
        summary: [
          { label: 'Total adopted', value: '78' },
          { label: 'Avg. days to placement', value: '11.2' },
          { label: 'Return rate', value: '0.8%' },
          { label: 'Adoption fee revenue', value: '$14,820' },
        ],
      },
      {
        title: 'Notable placements',
        head: ['Pet', 'Breed', 'Adopter', 'Filed', 'Outcome'],
        rows: [
          ['Max', 'Golden Retriever', 'D. Kim', '2026-05-16', 'Adopted'],
          ['Luna', 'Husky Mix', 'E. Thompson', '2026-05-12', 'Adopted'],
          ['Bella', 'Beagle', 'M. Rodriguez', '2026-05-09', 'Adopted'],
          ['Hoover', 'Tabby', 'S. Patel', '2026-05-04', 'Adopted'],
        ],
      },
    ],
  },
  {
    serial: 'RPT-2026-0041',
    title: 'Animal Intake Ledger',
    subtitle: 'New arrivals by source, condition, and receiving officer.',
    period: 'May 1 – May 20, 2026',
    filedBy: 'Marcus Lee',
    shelter: 'Hope Shelter',
    intro:
      'Intake activity remained above seasonal average. Owner surrenders dominated the mix, with a notable rise in stray cat intake from the eastern corridor.',
    sections: [
      {
        title: 'Intake by source',
        head: ['Source', 'Count', 'Healthy', 'Medical hold', 'Quarantine'],
        rows: [
          ['Owner surrender', 31, 22, 7, 2],
          ['Stray', 24, 14, 6, 4],
          ['Transfer in', 12, 11, 1, 0],
          ['Born in care', 5, 5, 0, 0],
        ],
        summary: [
          { label: 'Total intake', value: '72' },
          { label: 'Healthy at intake', value: '72.2%' },
          { label: 'Avg. intake / day', value: '3.6' },
        ],
      },
    ],
  },
  {
    serial: 'RPT-2026-0040',
    title: 'Medical & Vaccination Log',
    subtitle: 'Procedures performed and vaccines administered in-period.',
    period: 'May 1 – May 20, 2026',
    filedBy: 'Dr. A. Okafor',
    shelter: 'Hope Shelter',
    sections: [
      {
        title: 'Procedures',
        head: ['Procedure', 'Performed', 'Pending', 'Avg. cost'],
        rows: [
          ['Spay / Neuter', 41, 6, '$120'],
          ['Dental', 9, 2, '$240'],
          ['Microchip', 58, 0, '$25'],
          ['Heartworm tx.', 4, 1, '$450'],
        ],
        summary: [
          { label: 'Procedures total', value: '112' },
          { label: 'Vaccines given', value: '186' },
          { label: 'Medical spend', value: '$9,640' },
        ],
      },
    ],
  },
  {
    serial: 'RPT-2026-0039',
    title: 'Foster Network Report',
    subtitle: 'Active foster households, capacity, and rotation.',
    period: 'May 1 – May 20, 2026',
    filedBy: 'Priya N.',
    shelter: 'Hope Shelter',
    sections: [
      {
        title: 'Active fosters',
        head: ['Household', 'Animals', 'Since', 'Status'],
        rows: [
          ['Carter, J.', 2, '2026-04-18', 'Active'],
          ['Nguyen, T.', 3, '2026-03-02', 'Active'],
          ['Alvarez, R.', 1, '2026-05-09', 'Onboarding'],
          ['Yamada, K.', 4, '2026-02-14', 'Active'],
        ],
        summary: [
          { label: 'Active households', value: '34' },
          { label: 'Animals in foster', value: '61' },
          { label: 'Capacity used', value: '78%' },
        ],
      },
    ],
  },
  {
    serial: 'RPT-2026-0038',
    title: 'Donation & Sponsorship Snapshot',
    subtitle: 'Inflows by channel and recurring sponsor activity.',
    period: 'May 1 – May 20, 2026',
    filedBy: 'Hope Shelter Treasury',
    shelter: 'Hope Shelter',
    sections: [
      {
        title: 'Inflow by channel',
        head: ['Channel', 'Donors', 'Gross', 'Recurring'],
        rows: [
          ['Online — site', 142, '$8,340', '$3,200'],
          ['Online — partners', 64, '$2,910', '$1,100'],
          ['Mail-in', 28, '$1,640', '$0'],
          ['Events', 1, '$4,500', '$0'],
        ],
        summary: [
          { label: 'Total raised', value: '$17,390' },
          { label: 'Recurring base', value: '$4,300/mo' },
          { label: 'New donors', value: '38' },
        ],
      },
    ],
  },
]
