function QuestionCard({ question }) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-brand-600">
              Somali
            </p>
            <h3 className="font-display text-2xl leading-tight text-slate-950">
              {question.title.so}
            </h3>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              English
            </p>
            <p className="text-base text-slate-600">{question.title.en}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-500">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Upvotes
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {question.upvotes}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Answers
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {question.answers}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-brand-500/15 bg-brand-500/8 px-3 py-1 text-sm text-brand-700"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <span>{question.author.name}</span>
        <span>{question.author.city}</span>
      </div>
    </article>
  )
}

export default QuestionCard
