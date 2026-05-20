import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_shelter/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div>
      <h2 className="text-headline-lg text-on-background mb-2">Settings</h2>
      <p className="text-body-md text-on-surface-variant">
        Manage shelter profile, members, and integrations.
      </p>
    </div>
  )
}
