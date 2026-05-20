import type { AdoptionApplication } from '@repo/domain'

export const adoptionApplications: AdoptionApplication[] = [
  {
    id: 'app-001',
    applicantName: 'Emily Thompson',
    applicantEmail: 'emily.t@example.com',
    petId: 'luna',
    petName: 'Luna',
    petBreed: 'Husky Mix',
    submittedAt: '2026-05-20T11:00:00Z',
    status: 'review',
    notes: '',
    notify: true,
    timeline: [
      {
        id: 't-001-1',
        at: '2026-05-20T11:00:00Z',
        actor: 'Applicant Portal',
        title: 'Application Submitted',
        detail: 'Application received via Applicant Portal.',
      },
    ],
  },
  {
    id: 'app-002',
    applicantName: 'Michael Rodriguez',
    applicantEmail: 'm.rod@example.com',
    petId: 'oliver',
    petName: 'Oliver',
    petBreed: 'Tabby Cat',
    submittedAt: '2026-05-19T14:00:00Z',
    status: 'pending',
    notes: '',
    notify: true,
    timeline: [
      {
        id: 't-002-1',
        at: '2026-05-19T14:00:00Z',
        actor: 'Applicant Portal',
        title: 'Application Submitted',
      },
    ],
  },
  {
    id: 'app-003',
    applicantName: 'Sarah Jenkins',
    applicantEmail: 's.jenkins@example.com',
    petId: 'luna',
    petName: 'Luna',
    petBreed: 'Labrador',
    submittedAt: '2023-10-24T09:18:00Z',
    status: 'review',
    notes: '',
    notify: true,
    timeline: [
      {
        id: 't-003-1',
        at: '2023-10-24T09:18:00Z',
        actor: 'System Admin',
        title: 'Status changed to Pending Review',
        detail:
          'Application received and background check initiated automatically.',
      },
      {
        id: 't-003-2',
        at: '2023-10-24T09:00:00Z',
        actor: 'Applicant Portal',
        title: 'Application Submitted',
        detail: 'Application form submitted via Applicant Portal.',
      },
    ],
  },
  {
    id: 'app-004',
    applicantName: 'David Kim',
    applicantEmail: 'dkim@example.com',
    petId: 'bella',
    petName: 'Bella',
    petBreed: 'Beagle',
    submittedAt: '2026-05-16T10:30:00Z',
    status: 'approved',
    notes: '',
    notify: true,
    timeline: [
      {
        id: 't-004-1',
        at: '2026-05-16T10:30:00Z',
        actor: 'Applicant Portal',
        title: 'Application Submitted',
      },
    ],
  },
]
