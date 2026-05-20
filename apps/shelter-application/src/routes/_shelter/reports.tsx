import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Icon } from '../../components/icon'
import {
  downloadReportPdf,
  reportLibrary,
  type ReportDocument,
} from '../../lib/reports'

export const Route = createFileRoute('/_shelter/reports')({
  component: ReportsPage,
})

const periods = ['7 days', '20 days', 'Quarter', 'Year', 'Custom']

function ReportsPage() {
  const [period, setPeriod] = React.useState('20 days')
  const [active, setActive] = React.useState<ReportDocument>(reportLibrary[0])

  return (
    <div className="font-body">
      {/* ── Masthead ───────────────────────────────────────────── */}
      <header className="border-t-[3px] border-on-background pt-4 mb-10">
        <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-on-surface-variant mb-6">
          <span>Vol. III · No. 05 — Records Bureau</span>
          <span className="hidden md:inline">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[color:var(--color-status-alert)] mb-3">
              § Reports
            </p>
            <h1 className="font-display text-[56px] leading-[1.02] tracking-[-0.025em] text-on-background max-w-2xl">
              The Shelter <em className="font-serif italic">Dossier</em>.
            </h1>
            <p className="text-body-lg text-on-surface-variant mt-4 max-w-xl">
              Filed records of intake, placement, medical care, and stewardship —
              archived, signed, and ready for export.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-end">
            {periods.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] border transition-colors ${
                  period === p
                    ? 'bg-on-background text-background border-on-background'
                    : 'border-outline-variant text-on-surface-variant hover:border-on-background hover:text-on-background'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 border-b border-on-background" />
        <div className="border-b border-on-background mt-[3px]" />
      </header>

      {/* ── Featured dossier ───────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <article className="lg:col-span-8 relative">
          <div className="absolute -top-3 left-6 bg-background px-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-status-alert)] z-10">
            Featured Dossier
          </div>
          <div className="border border-on-background bg-[color:var(--color-surface-container-lowest,white)] p-10 md:p-14 relative overflow-hidden shadow-[6px_6px_0_0_rgba(30,41,59,0.08)]">
            {/* corner fold */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[linear-gradient(225deg,transparent_50%,#1e293b_50%)] opacity-10" />
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-on-surface-variant mb-8">
              <span>{active.serial}</span>
              <span>FILED · {active.period}</span>
            </div>

            <h2 className="font-display text-[44px] leading-[1.05] tracking-[-0.02em] text-on-background mb-3">
              {active.title}
            </h2>
            <p className="font-serif italic text-body-lg text-on-surface-variant mb-8 max-w-2xl">
              {active.subtitle}
            </p>

            {active.intro && (
              <div className="relative pl-6 border-l-2 border-[color:var(--color-status-alert)] mb-10">
                <p className="text-body-md text-on-background leading-relaxed max-w-2xl">
                  {active.intro}
                </p>
              </div>
            )}

            {/* meta strip */}
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-on-background pt-6 mb-10">
              {[
                ['Period', active.period],
                ['Shelter', active.shelter],
                ['Filed by', active.filedBy],
                ['Pages', String(active.sections.length + 1)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">
                    {k}
                  </dt>
                  <dd className="text-label-md text-on-background">{v}</dd>
                </div>
              ))}
            </dl>

            {/* preview of first section */}
            {active.sections[0] && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[10px] text-[color:var(--color-status-alert)]">
                    § 01
                  </span>
                  <h3 className="font-display text-headline-md text-on-background uppercase tracking-wide">
                    {active.sections[0].title}
                  </h3>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-on-background">
                      {active.sections[0].head.map((h) => (
                        <th
                          key={h}
                          className="font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant text-left py-2 pr-4"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {active.sections[0].rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-outline-variant/60 hover:bg-surface-container/40"
                      >
                        {row.map((c, j) => (
                          <td
                            key={j}
                            className={`py-3 pr-4 ${
                              j === 0
                                ? 'font-display text-body-lg text-on-background'
                                : 'font-mono text-body-sm tabular-nums text-on-background'
                            }`}
                          >
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {active.sections[0].summary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-5 border-t border-on-background">
                    {active.sections[0].summary.map((s) => (
                      <div key={s.label}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">
                          {s.label}
                        </p>
                        <p className="font-display text-headline-md text-on-background tabular-nums">
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-on-background">
              <button
                type="button"
                onClick={() => downloadReportPdf(active)}
                className="group inline-flex items-center gap-3 bg-on-background text-background px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-[color:var(--color-status-alert)] transition-colors"
              >
                <Icon name="picture_as_pdf" className="text-[18px]" />
                Download Dossier (PDF)
                <span className="font-serif italic normal-case tracking-normal text-[12px] opacity-70 group-hover:opacity-100">
                  →
                </span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] border border-on-background text-on-background hover:bg-on-background hover:text-background transition-colors"
              >
                <Icon name="visibility" className="text-[16px]" />
                Preview
              </button>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                Sealed · {active.serial}
              </span>
            </div>
          </div>
        </article>

        {/* index of recent reports */}
        <aside className="lg:col-span-4">
          <div className="sticky top-6">
            <h3 className="font-display text-headline-md text-on-background mb-1 uppercase tracking-wide">
              In this issue
            </h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-surface-variant mb-5">
              Index — five filings
            </p>
            <ul className="border-t border-on-background">
              {reportLibrary.map((r, i) => {
                const isActive = r.serial === active.serial
                return (
                  <li
                    key={r.serial}
                    className="border-b border-outline-variant/60"
                  >
                    <button
                      type="button"
                      onClick={() => setActive(r)}
                      className={`w-full text-left flex gap-4 py-4 px-2 transition-colors ${
                        isActive
                          ? 'bg-on-background text-background'
                          : 'hover:bg-surface-container/60'
                      }`}
                    >
                      <span
                        className={`font-mono text-[11px] tabular-nums shrink-0 mt-1 ${
                          isActive
                            ? 'text-background/70'
                            : 'text-[color:var(--color-status-alert)]'
                        }`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block font-mono text-[10px] uppercase tracking-[0.18em] ${
                            isActive
                              ? 'text-background/70'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {r.serial}
                        </span>
                        <span
                          className={`block font-display text-body-lg leading-tight mt-1 ${
                            isActive ? 'text-background' : 'text-on-background'
                          }`}
                        >
                          {r.title}
                        </span>
                        <span
                          className={`block font-serif italic text-body-sm mt-1 line-clamp-1 ${
                            isActive
                              ? 'text-background/80'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {r.subtitle}
                        </span>
                      </span>
                      <Icon
                        name={isActive ? 'east' : 'north_east'}
                        className={`text-[18px] mt-1 ${
                          isActive ? 'text-background' : 'text-on-surface-variant'
                        }`}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>
      </section>

      {/* ── Archive ledger ─────────────────────────────────────── */}
      <section className="mb-12">
        <div className="flex items-end justify-between border-b-2 border-on-background pb-4 mb-0">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-status-alert)] mb-2">
              § Archive
            </p>
            <h2 className="font-display text-headline-xl text-on-background tracking-tight">
              The full ledger
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hidden md:block">
            {reportLibrary.length} entries · sorted by serial
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 py-3 border-b border-on-background font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
          <div className="col-span-2">Serial</div>
          <div className="col-span-5">Title</div>
          <div className="col-span-2">Period</div>
          <div className="col-span-2">Filed by</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        <ul>
          {reportLibrary.map((r) => (
            <li
              key={r.serial}
              className="grid grid-cols-12 gap-4 py-5 border-b border-outline-variant/60 items-center group hover:bg-surface-container/40 transition-colors px-1"
            >
              <div className="col-span-2 font-mono text-body-sm tabular-nums text-on-background">
                {r.serial}
              </div>
              <div className="col-span-5">
                <p className="font-display text-body-lg text-on-background leading-tight">
                  {r.title}
                </p>
                <p className="font-serif italic text-body-sm text-on-surface-variant mt-0.5">
                  {r.subtitle}
                </p>
              </div>
              <div className="col-span-2 font-mono text-body-sm text-on-surface-variant">
                {r.period.replace('2026', '’26')}
              </div>
              <div className="col-span-2 text-body-sm text-on-background">
                {r.filedBy}
              </div>
              <div className="col-span-1 flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => setActive(r)}
                  title="Open"
                  className="w-9 h-9 grid place-items-center border border-outline-variant text-on-surface-variant hover:border-on-background hover:text-on-background transition-colors"
                >
                  <Icon name="open_in_new" className="text-[16px]" />
                </button>
                <button
                  type="button"
                  onClick={() => downloadReportPdf(r)}
                  title="Download PDF"
                  className="w-9 h-9 grid place-items-center bg-on-background text-background hover:bg-[color:var(--color-status-alert)] transition-colors"
                >
                  <Icon name="download" className="text-[16px]" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Colophon ───────────────────────────────────────────── */}
      <footer className="border-t-2 border-on-background pt-6 pb-2 mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
        <div>
          <p className="mb-1 text-[color:var(--color-status-alert)]">Colophon</p>
          <p className="normal-case tracking-normal font-serif italic text-body-sm text-on-surface-variant">
            Set in Plus Jakarta Sans, Inter & a courier monospace. Printed on
            demand from the Records Bureau.
          </p>
        </div>
        <div>
          <p className="mb-1">Issued</p>
          <p className="text-on-background">
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
            })}
          </p>
        </div>
        <div className="md:text-right">
          <p className="mb-1">Confidential</p>
          <p className="text-on-background">For shelter staff only</p>
        </div>
      </footer>
    </div>
  )
}
