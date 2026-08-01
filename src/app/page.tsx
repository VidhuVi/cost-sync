'use client'

import { useMeetingCalculator } from '@/hooks/useMeetingCalculator'
import { RecommendationStatus } from '@/lib/models'
import { saveMeetingAction } from '@/app/actions'
import { useState } from 'react'
import Link from 'next/link'
import { Settings, UserCircle, Users, Clock, Activity, Code, Badge, Palette, Gem, Search, X, Send, PiggyBank, History, BadgeCheck } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  const {
    attendees,
    meetingContext,
    totalCost,
    recommendation,
    addAttendee,
    removeAttendee,
    updateDuration,
    updateAgenda,
    clearSession
  } = useMeetingCalculator()

  const [isSaving, setIsSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  const handleSave = async () => {
    if (attendees.length === 0 || meetingContext.durationInMinutes === 0) {
      setToastMessage("Please add attendees and set a duration.")
      setTimeout(() => setToastMessage(null), 3000)
      return
    }
    
    setIsSaving(true)
    const result = await saveMeetingAction(meetingContext, attendees, totalCost, recommendation)
    setIsSaving(false)
    
    if (result.success) {
      setToastMessage('Meeting saved successfully!')
      setTimeout(() => setToastMessage(null), 3000)
      clearSession()
    } else {
      setToastMessage(result.error || 'Failed to save meeting')
      setTimeout(() => setToastMessage(null), 3000)
    }
  }

  // Derived styles for recommendation
  let roiProgressWidth = '0%'
  let roiColorClass = 'bg-outline-variant'
  
  switch (recommendation.status) {
    case RecommendationStatus.APPROVE:
      roiProgressWidth = '100%'
      roiColorClass = 'bg-primary'
      break
    case RecommendationStatus.WARN:
      roiProgressWidth = '50%'
      roiColorClass = 'bg-warning' // Amber
      break
    case RecommendationStatus.REJECT:
      roiProgressWidth = '15%'
      roiColorClass = 'bg-error'
      break
    case RecommendationStatus.INCOMPLETE:
    default:
      roiProgressWidth = '0%'
      break
  }

  return (
    <div className="min-h-screen">
      {/* TopNavBar */}
      <header className="w-full top-0 bg-surface dark:bg-background border-b border-outline-variant dark:border-outline z-50 sticky">
        <div className="flex justify-between items-center h-16 px-margin-desktop max-w-container-max mx-auto relative">
          <div className="font-display-lg text-display-lg font-semibold text-primary dark:text-primary-fixed">CostSync</div>
          <nav className="hidden md:flex items-center gap-stack-lg absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="font-headline-md text-headline-md text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1 transition-all duration-300 ease-out">
              Calculator
            </Link>
            <Link href="/history" className="font-headline-md text-headline-md text-on-secondary-fixed-variant dark:text-on-secondary-container hover:text-primary dark:hover:text-primary-fixed transition-colors">
              History
            </Link>
          </nav>
          <div className="flex items-center gap-stack-md">
            <ThemeToggle />
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
        {/* Page Header */}
        <div className="mb-stack-lg">
          <h1 className="font-display-lg text-display-lg text-primary mb-stack-sm">Meeting Cost Estimator</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Quantify the investment of your collective time. Sync team rates with duration to reveal the true cost of your next sync.
          </p>
        </div>
        
        <div className="bento-grid">
          {/* Main Stage: Total Cost */}
          <div className="col-span-12 lg:col-span-8 premium-card p-stack-lg flex flex-col justify-center items-center relative overflow-hidden min-h-[320px]">
            <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant mb-unit">Current Estimated Investment</span>
            <div className="flex items-baseline gap-unit">
              <span className="font-display-lg text-display-lg text-on-surface-variant opacity-50">₹</span>
              <span className="font-display-lg text-[80px] font-bold text-primary leading-none transition-all duration-500 ease-out">
                {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="mt-stack-lg flex gap-stack-md">
              <div className="flex items-center gap-unit px-4 py-2 bg-surface-container rounded-full">
                <Users className="text-primary w-5 h-5" />
                <span className="font-label-md text-label-md">{attendees.length} Participants</span>
              </div>
              <div className="flex items-center gap-unit px-4 py-2 bg-surface-container rounded-full">
                <Clock className="text-primary w-5 h-5" />
                <span className="font-label-md text-label-md">{meetingContext.durationInMinutes} Minutes</span>
              </div>
            </div>
          </div>

          {/* Value Assessment & ROI */}
          <div className="col-span-12 lg:col-span-4 premium-card p-stack-lg flex flex-col">
            <div className="flex justify-between items-center mb-stack-md">
              <h3 className="font-headline-md text-headline-md text-primary">Value Assessment</h3>
              <Activity className="text-secondary" />
            </div>
            <div className="flex flex-col gap-stack-md flex-grow">
              <label className="flex flex-col gap-stack-sm cursor-pointer group">
                <span className="font-label-md text-label-md text-on-surface-variant">Agenda</span>
                <textarea 
                  className="w-full px-3 py-2 border border-outline-variant rounded-md resize-none h-24 focus:ring-1 focus:ring-primary focus:outline-none font-body-sm text-body-sm"
                  placeholder="Enter a specific, actionable agenda..."
                  value={meetingContext.agenda}
                  onChange={(e) => updateAgenda(e.target.value)}
                />
              </label>
              
              <div className="mt-auto p-stack-md bg-secondary-container/30 border border-secondary-container rounded-lg">
                <div className="flex items-center justify-between mb-unit">
                  <span className="font-label-md text-label-md text-on-secondary-container">Predicted ROI</span>
                  <span className={`font-label-md text-label-md font-bold ${
                    recommendation.status === RecommendationStatus.APPROVE ? 'text-primary' : 
                    recommendation.status === RecommendationStatus.WARN ? 'text-warning' : 
                    recommendation.status === RecommendationStatus.REJECT ? 'text-error' : 'text-on-surface-variant'
                  }`}>
                    {recommendation.status}
                  </span>
                </div>
                <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-700 ease-out ${roiColorClass}`} style={{ width: roiProgressWidth }}></div>
                </div>
                <p className="mt-stack-sm font-body-sm text-body-sm text-on-secondary-container italic">
                  {recommendation.message}
                </p>
              </div>
            </div>
          </div>

          {/* Add Participants Section */}
          <div className="col-span-12 lg:col-span-6 premium-card p-stack-lg">
            <div className="flex justify-between items-center mb-stack-md">
              <h3 className="font-headline-md text-headline-md text-primary">Add Participants</h3>
            </div>
            <div className="grid grid-cols-2 gap-stack-sm mb-stack-md">
              <button 
                className="flex flex-col items-start p-stack-md border border-outline-variant rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300 ease-out text-left" 
                onClick={() => addAttendee('Engineer', 525)}
              >
                <Code className="text-primary mb-unit w-6 h-6" />
                <span className="font-label-md text-label-md font-bold">Engineer</span>
                <span className="font-body-sm text-body-sm text-on-surface opacity-80">₹525/hr</span>
              </button>
              <button 
                className="flex flex-col items-start p-stack-md border border-outline-variant rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300 ease-out text-left" 
                onClick={() => addAttendee('Manager', 800)}
              >
                <Badge className="text-primary mb-unit w-6 h-6" />
                <span className="font-label-md text-label-md font-bold">Manager</span>
                <span className="font-body-sm text-body-sm text-on-surface opacity-80">₹800/hr</span>
              </button>
              <button 
                className="flex flex-col items-start p-stack-md border border-outline-variant rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300 ease-out text-left" 
                onClick={() => addAttendee('Designer', 425)}
              >
                <Palette className="text-primary mb-unit w-6 h-6" />
                <span className="font-label-md text-label-md font-bold">Designer</span>
                <span className="font-body-sm text-body-sm text-on-surface opacity-80">₹425/hr</span>
              </button>
              <button 
                className="flex flex-col items-start p-stack-md border border-outline-variant rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-300 ease-out text-left" 
                onClick={() => addAttendee('Executive', 2500)}
              >
                <Gem className="text-primary mb-unit w-6 h-6" />
                <span className="font-label-md text-label-md font-bold">Executive</span>
                <span className="font-body-sm text-body-sm text-on-surface opacity-80">₹2,500/hr</span>
              </button>
            </div>
            <div className="relative">
              <input 
                className="w-full px-stack-md py-stack-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-on-surface/50" 
                placeholder="Custom roles aren't available in demo yet..." 
                type="text"
                disabled
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            </div>
            <div className="mt-stack-md space-y-2 max-h-[160px] overflow-y-auto pr-2">
              {attendees.length === 0 ? (
                <p className="text-center py-stack-md text-on-surface-variant italic font-body-sm text-body-sm">No participants added yet.</p>
              ) : (
                attendees.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-stack-sm bg-surface rounded-lg border border-outline-variant/30 animate-in fade-in slide-in-from-left-4 duration-500 ease-out">
                    <div className="flex items-center gap-unit">
                        <span className="font-label-md text-label-md font-bold">{p.name}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">₹{p.hourlyRate}/hr</span>
                    </div>
                    <button onClick={() => removeAttendee(p.id)} className="text-error/60 hover:text-error transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Duration & Visualization */}
          <div className="col-span-12 lg:col-span-6 premium-card p-stack-lg flex flex-col">
            <h3 className="font-headline-md text-headline-md text-primary mb-stack-md">Duration &amp; Analysis</h3>
            <div className="mb-stack-lg">
              <div className="flex justify-between items-center mb-unit">
                <span className="font-label-md text-label-md text-on-surface-variant">Meeting Length</span>
                <span className="font-headline-md text-headline-md text-primary">{meetingContext.durationInMinutes}m</span>
              </div>
              <input 
                max="240" min="0" step="15" type="range" 
                value={meetingContext.durationInMinutes}
                onChange={(e) => updateDuration(parseInt(e.target.value))}
              />
              <div className="flex justify-between mt-unit font-label-sm text-label-sm text-on-surface-variant">
                <span>0m</span>
                <span>1h</span>
                <span>2h</span>
                <span>3h</span>
                <span>4h+</span>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col">
              <span className="font-label-md text-label-md text-on-surface-variant mb-stack-sm">Cost Scaler</span>
              <div className="relative flex-grow min-h-[140px] border-l-2 border-b-2 border-outline-variant/30 flex items-end px-stack-sm">
                <div className="flex-1 flex gap-2 items-end h-full w-full">
                  <div className="flex-1 bg-primary rounded-t-sm transition-all duration-1000 ease-out max-h-full" style={{ height: `${Math.min(100, (totalCost / 20000) * 100)}%` }}></div>
                </div>
              </div>
            </div>
            
            <button 
              className="mt-stack-lg w-full bg-primary text-white py-stack-md rounded-lg font-headline-md text-headline-md hover:bg-primary-container transition-all duration-300 ease-out flex items-center justify-center gap-stack-sm shadow-lg shadow-primary/10 group disabled:opacity-50" 
              onClick={handleSave}
              disabled={isSaving}
            >
              <span>{isSaving ? 'Saving...' : 'Save & Confirm Cost'}</span>
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        {/* Secondary Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg mt-stack-lg mb-stack-lg">
          <div className="p-stack-md premium-card">
            <div className="flex items-center gap-stack-sm mb-unit">
              <PiggyBank className="text-primary w-5 h-5" />
              <span className="font-label-md text-label-md font-bold">Optimization Tip</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Reducing this meeting by 15 minutes would save approximately <span className="font-bold text-primary">₹{((totalCost / meetingContext.durationInMinutes) * 15 || 0).toFixed(0)}</span> in company time.
            </p>
          </div>
          <div className="p-stack-md premium-card">
            <div className="flex items-center gap-stack-sm mb-unit">
              <History className="text-primary w-5 h-5" />
              <span className="font-label-md text-label-md font-bold">Recent Comparison</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Check the history tab to compare with past meetings.</p>
          </div>
          <div className="p-stack-md premium-card">
            <div className="flex items-center gap-stack-sm mb-unit">
              <BadgeCheck className="text-primary w-5 h-5" />
              <span className="font-label-md text-label-md font-bold">Budget Status</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Allocated department budget: ₹10,00,000/mo. Monitor expenses strictly.</p>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-inverse-surface text-inverse-on-surface px-stack-lg py-stack-md rounded-lg shadow-lg font-label-md text-label-md flex items-center gap-stack-sm z-[100] animate-in slide-in-from-bottom-5 slide-in-from-right-5 fade-in duration-500 ease-out">
          <BadgeCheck className="w-5 h-5 text-primary-fixed" />
          {toastMessage}
        </div>
      )}
    </div>
  )
}
