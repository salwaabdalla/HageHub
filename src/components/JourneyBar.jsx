const steps = ['Start', 'Learn', 'Ask', 'Connect', 'Build', 'Get Hired']

function JourneyBar({ activeStep = 'Start' }) {
  return (
    <div className="overflow-x-auto rounded-[2rem] border border-slate-200 bg-white/90 p-3 shadow-[0_16px_60px_rgba(15,23,42,0.06)]">
      <div className="flex min-w-max items-center gap-2">
        {steps.map((step, index) => {
          const isActive = step === activeStep

          return (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {step}
              </div>
              {index < steps.length - 1 ? (
                <div className="h-px w-6 bg-slate-200 sm:w-10" />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default JourneyBar
