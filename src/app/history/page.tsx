import { getHistoryAction } from '@/app/actions'
import Link from 'next/link'
import { Settings, UserCircle, Users, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default async function HistoryPage() {
  const meetings = await getHistoryAction()

  return (
    <div className="min-h-screen">
      <header className="w-full top-0 bg-surface dark:bg-background border-b border-outline-variant dark:border-outline z-50 sticky">
        <div className="flex justify-between items-center h-16 px-margin-desktop max-w-container-max mx-auto relative">
          <div className="font-display-lg text-display-lg font-semibold text-primary dark:text-primary-fixed">CostSync</div>
          <nav className="hidden md:flex items-center gap-stack-lg absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="font-headline-md text-headline-md text-on-secondary-fixed-variant dark:text-on-secondary-container hover:text-primary dark:hover:text-primary-fixed transition-colors">
              Calculator
            </Link>
            <Link href="/history" className="font-headline-md text-headline-md text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1 transition-all duration-200 ease-in-out">
              History
            </Link>
          </nav>
          <div className="flex items-center gap-stack-md">
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <Settings />
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <UserCircle />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        <div className="mb-stack-lg">
          <h1 className="font-display-lg text-display-lg text-primary mb-stack-sm">Meeting History</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Review past estimated meetings and their costs.
          </p>
        </div>

        <div className="space-y-4">
          {meetings.length === 0 ? (
            <div className="p-stack-lg text-center bg-surface border border-outline-variant rounded-xl">
              <p className="font-body-md text-body-md text-on-surface-variant">No meetings have been saved yet.</p>
            </div>
          ) : (
            meetings.map(meeting => (
              <div key={meeting.id} className="bg-white border border-outline-variant rounded-xl p-stack-md flex flex-col md:flex-row justify-between gap-stack-md items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {meeting.recommendationStatus === 'APPROVE' && <CheckCircle className="text-primary w-5 h-5" />}
                    {meeting.recommendationStatus === 'WARN' && <AlertCircle className="text-on-tertiary-container w-5 h-5" />}
                    {meeting.recommendationStatus === 'REJECT' && <XCircle className="text-error w-5 h-5" />}
                    <span className="font-label-md text-label-md font-bold">{meeting.recommendationStatus}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface line-clamp-1">{meeting.agenda || "No Agenda Provided"}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {new Date(meeting.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-stack-lg w-full md:w-auto bg-surface p-stack-sm rounded-lg border border-outline-variant/30 justify-between md:justify-end">
                  <div className="flex items-center gap-unit">
                    <Users className="text-primary w-4 h-4" />
                    <span className="font-label-sm text-label-sm">{meeting.attendees.length}</span>
                  </div>
                  <div className="flex items-center gap-unit">
                    <Clock className="text-primary w-4 h-4" />
                    <span className="font-label-sm text-label-sm">{meeting.durationInMinutes}m</span>
                  </div>
                  <div className="text-right ml-4">
                    <span className="font-display-lg text-2xl font-bold text-primary">
                      ${meeting.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
