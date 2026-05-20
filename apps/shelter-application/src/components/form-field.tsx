import * as React from 'react'
import type { AnyFieldApi } from '@tanstack/react-form'
import { Icon } from './icon'

export function RequiredMark() {
  return <span className="text-error mr-1">*</span>
}

function FieldErrors({ field }: { field: AnyFieldApi }) {
  const meta = field.state.meta
  if (!meta.isTouched || !meta.errors?.length) return null
  return (
    <p className="text-label-sm text-error">
      {meta.errors
        .map((e) => (typeof e === 'string' ? e : e?.message))
        .filter(Boolean)
        .join(', ')}
    </p>
  )
}

const baseInput =
  'w-full h-11 rounded-lg border bg-surface-container-lowest px-4 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow'

export function TextInput({
  field,
  label,
  required,
  type = 'text',
  placeholder,
  hint,
}: {
  field: AnyFieldApi
  label: React.ReactNode
  required?: boolean
  type?: string
  placeholder?: string
  hint?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={field.name}
        className="text-label-md font-label-md text-on-surface"
      >
        {required ? <RequiredMark /> : null}
        {label}
      </label>
      {hint ? (
        <p className="text-label-sm text-on-surface-variant -mt-1">{hint}</p>
      ) : null}
      <input
        id={field.name}
        name={field.name}
        type={type}
        value={String(field.state.value ?? '')}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        className={`${baseInput} border-outline`}
      />
      <FieldErrors field={field} />
    </div>
  )
}

export function ReadOnlyInput({
  label,
  value,
}: {
  label: React.ReactNode
  value: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-label-md font-label-md text-on-surface">
        {label}
      </label>
      <input
        readOnly
        value={value}
        className="w-full h-11 rounded-lg border border-transparent bg-surface-container-high px-4 text-body-md text-on-surface-variant cursor-not-allowed focus:outline-none"
      />
    </div>
  )
}

export function TextArea({
  field,
  label,
  required,
  placeholder,
  rows = 4,
  showCounter = true,
  minChars = 50,
  maxChars = 1000,
  description,
}: {
  field: AnyFieldApi
  label: React.ReactNode
  required?: boolean
  placeholder?: string
  rows?: number
  showCounter?: boolean
  minChars?: number
  maxChars?: number
  description?: React.ReactNode
}) {
  const value = String(field.state.value ?? '')
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={field.name}
        className="text-label-md font-label-md text-on-surface"
      >
        {required ? <RequiredMark /> : null}
        {label}
      </label>
      {description ? (
        <p className="text-body-sm text-on-surface-variant -mt-1">
          {description}
        </p>
      ) : null}
      <textarea
        id={field.name}
        name={field.name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="w-full p-4 text-body-md bg-surface-container-lowest border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow resize-y"
      />
      {showCounter ? (
        <div className="flex justify-between items-center px-1">
          <span className="text-label-sm text-on-surface-variant">
            Char Limit: Min. {minChars} – Max. {maxChars}
          </span>
          <span className="text-label-sm text-on-surface-variant">
            {value.length}
          </span>
        </div>
      ) : null}
      <FieldErrors field={field} />
    </div>
  )
}

export function Select({
  field,
  label,
  required,
  options,
  placeholder = 'Select…',
  disabled,
}: {
  field: AnyFieldApi
  label: React.ReactNode
  required?: boolean
  options: ReadonlyArray<{ value: string; label: string }>
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={field.name}
        className="text-label-md font-label-md text-on-surface"
      >
        {required ? <RequiredMark /> : null}
        {label}
      </label>
      <div className="relative">
        <select
          id={field.name}
          name={field.name}
          value={String(field.state.value ?? '')}
          disabled={disabled}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className={`${baseInput} appearance-none pr-10 cursor-pointer ${
            disabled
              ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed border-transparent'
              : 'border-outline'
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon
          name="expand_more"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
      </div>
      <FieldErrors field={field} />
    </div>
  )
}

export function RadioGroup({
  field,
  label,
  required,
  options,
  description,
}: {
  field: AnyFieldApi
  label: React.ReactNode
  required?: boolean
  options: ReadonlyArray<{ value: string; label: string }>
  description?: React.ReactNode
}) {
  const current = String(field.state.value ?? '')
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-body-md font-medium text-on-surface">
          {required ? <RequiredMark /> : null}
          {label}
        </label>
        {description ? (
          <p className="text-body-sm text-on-surface-variant mt-1">
            {description}
          </p>
        ) : null}
      </div>
      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden">
        {options.map((o, idx) => {
          const checked = current === o.value
          return (
            <label
              key={o.value}
              className={`flex items-center p-4 cursor-pointer transition-colors ${
                idx < options.length - 1 ? 'border-b border-outline-variant' : ''
              } ${
                checked
                  ? 'bg-surface-container-low border-l-4 border-l-primary'
                  : 'hover:bg-surface-container-low'
              }`}
            >
              <input
                type="radio"
                name={field.name}
                value={o.value}
                checked={checked}
                onChange={() => field.handleChange(o.value)}
                onBlur={field.handleBlur}
                className="h-5 w-5 accent-primary"
              />
              <span
                className={`ml-3 text-body-md text-on-surface ${
                  checked ? 'font-medium' : ''
                }`}
              >
                {o.label}
              </span>
            </label>
          )
        })}
      </div>
      <FieldErrors field={field} />
    </div>
  )
}

export function CheckboxGroup({
  field,
  label,
  required,
  description,
  options,
  columns = 2,
}: {
  field: AnyFieldApi
  label?: React.ReactNode
  required?: boolean
  description?: React.ReactNode
  options: ReadonlyArray<{ value: string; label: string; full?: boolean }>
  columns?: 1 | 2
}) {
  const arr: Array<string> = Array.isArray(field.state.value)
    ? (field.state.value as Array<string>)
    : []
  const toggle = (v: string) => {
    if (arr.includes(v)) field.handleChange(arr.filter((x) => x !== v))
    else field.handleChange([...arr, v])
  }
  return (
    <div className="space-y-4">
      {label ? (
        <div>
          <h2 className="text-body-md font-bold flex items-start gap-1 text-on-surface">
            {required ? <RequiredMark /> : null}
            {label}
          </h2>
          {description ? (
            <p className="text-body-sm text-on-surface-variant mt-1">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      <div
        className={`grid gap-y-4 gap-x-8 ${
          columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {options.map((o) => {
          const checked = arr.includes(o.value)
          return (
            <label
              key={o.value}
              className={`flex items-center gap-3 cursor-pointer group ${
                o.full ? 'md:col-span-2' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(o.value)}
                onBlur={field.handleBlur}
                className="w-5 h-5 rounded border-outline accent-primary"
              />
              <span
                className={`text-body-md transition-colors ${
                  checked
                    ? 'text-primary font-medium'
                    : 'text-on-surface group-hover:text-primary'
                }`}
              >
                {o.label}
              </span>
            </label>
          )
        })}
      </div>
      <FieldErrors field={field} />
    </div>
  )
}

export function MoneyRange({
  fieldMin,
  fieldMax,
  label,
  description,
}: {
  fieldMin: AnyFieldApi
  fieldMax: AnyFieldApi
  label: React.ReactNode
  description?: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <label className="block text-body-md font-medium text-on-surface">
        {label}
        {description ? (
          <span className="block text-body-sm font-normal text-on-surface-variant mt-1">
            {description}
          </span>
        ) : null}
      </label>
      <div className="flex items-center gap-4">
        <MoneyInput field={fieldMin} suffix="min" example="Example: 0" />
        <Icon name="arrow_forward" className="text-outline-variant" />
        <MoneyInput field={fieldMax} suffix="max" example="Example: 100" />
      </div>
    </div>
  )
}

function MoneyInput({
  field,
  suffix,
  example,
}: {
  field: AnyFieldApi
  suffix: string
  example: string
}) {
  return (
    <div className="flex-1 space-y-1">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-on-surface-variant">$</span>
        </div>
        <input
          type="number"
          value={String(field.state.value ?? '')}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          className="w-full h-12 pl-8 pr-12 text-body-md bg-surface-container-lowest border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <span className="text-on-surface-variant text-body-sm">{suffix}</span>
        </div>
      </div>
      <span className="text-label-sm text-on-surface-variant px-1">
        {example}
      </span>
    </div>
  )
}

export function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-4 flex gap-3 items-start border border-outline-variant">
      <Icon
        name="info"
        className="text-primary-container flex-shrink-0 mt-0.5"
      />
      <p className="text-body-sm text-on-surface">{children}</p>
    </div>
  )
}

export function VisibilityBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-4 flex gap-3 items-start">
      <Icon name="visibility" className="text-primary flex-shrink-0 mt-0.5" />
      <p className="text-body-sm text-on-surface-variant">{children}</p>
    </div>
  )
}

export function FieldsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-sm border border-outline-variant flex flex-col gap-6">
      {children}
    </div>
  )
}
