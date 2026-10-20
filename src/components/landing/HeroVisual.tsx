import { Search, Zap, Eye, MessageCircle, MapPin, Clock, Star } from "lucide-react"

/** Mockup animé du hero : un téléphone affichant une démo, entouré des étapes du parcours. */
export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[420px] aspect-[4/5] select-none" aria-hidden>
      {/* Halo derrière le téléphone */}
      <div className="absolute inset-[12%] rounded-full bg-gradient-to-tr from-indigo-600/40 via-violet-500/30 to-fuchsia-500/30 blur-3xl" />

      {/* Téléphone */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[62%] animate-float-slow">
        <div className="rounded-[2.4rem] p-[7px] bg-gradient-to-b from-neutral-700 to-neutral-900 shadow-2xl shadow-indigo-950/60 ring-1 ring-white/10">
          <div className="relative rounded-[2rem] overflow-hidden bg-[#faf7f2] aspect-[9/19]">
            {/* Encoche */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-black z-10" />

            {/* Hero du site de démo */}
            <div className="relative h-[42%] bg-gradient-to-br from-amber-700 via-orange-800 to-stone-900 flex flex-col justify-end p-3.5">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,#fde68a,transparent_55%)]" />
              <span className="relative text-[8px] font-semibold uppercase tracking-[0.2em] text-amber-200/90">
                Bistrot · Lyon 4e
              </span>
              <span className="relative font-serif text-xl leading-tight text-white">
                Le Petit Zinc
              </span>
              <span className="relative mt-1 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                ))}
              </span>
            </div>

            {/* Contenu */}
            <div className="p-3 space-y-2.5">
              <div className="h-8 rounded-xl bg-stone-900 text-white text-[10px] font-semibold flex items-center justify-center">
                Réserver une table
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white border border-stone-200 p-2">
                  <Clock className="w-3 h-3 text-amber-700 mb-1" />
                  <div className="h-1.5 w-10 rounded bg-stone-300" />
                  <div className="h-1.5 w-7 rounded bg-stone-200 mt-1" />
                </div>
                <div className="rounded-xl bg-white border border-stone-200 p-2">
                  <MapPin className="w-3 h-3 text-amber-700 mb-1" />
                  <div className="h-1.5 w-9 rounded bg-stone-300" />
                  <div className="h-1.5 w-11 rounded bg-stone-200 mt-1" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-14 flex-1 rounded-xl bg-gradient-to-br from-orange-200 to-amber-400" />
                <div className="h-14 flex-1 rounded-xl bg-gradient-to-br from-rose-200 to-orange-300" />
                <div className="h-14 flex-1 rounded-xl bg-gradient-to-br from-lime-200 to-emerald-300" />
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded bg-stone-200" />
                <div className="h-1.5 w-4/5 rounded bg-stone-200" />
                <div className="h-1.5 w-3/5 rounded bg-stone-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications flottantes */}
      <FloatingCard
        className="left-0 top-[10%]"
        enterDelay="400ms"
        floatDelay="0s"
        icon={<Search className="w-4 h-4" />}
        tone="indigo"
        title="Commerce trouvé"
        subtitle="Aucun site web"
      />
      <FloatingCard
        className="right-0 top-[28%]"
        enterDelay="700ms"
        floatDelay="-2s"
        icon={<Zap className="w-4 h-4" />}
        tone="violet"
        title="Démo générée"
        subtitle="en 58 secondes"
      />
      <FloatingCard
        className="left-[-2%] bottom-[22%]"
        enterDelay="1000ms"
        floatDelay="-4s"
        icon={<Eye className="w-4 h-4" />}
        tone="emerald"
        title="Démo consultée"
        subtitle="3 visites aujourd'hui"
        live
      />
      <FloatingCard
        className="right-[2%] bottom-[6%]"
        enterDelay="1300ms"
        floatDelay="-1s"
        icon={<MessageCircle className="w-4 h-4" />}
        tone="pink"
        title="Nouveau message"
        subtitle="« On en parle demain ? »"
      />
    </div>
  )
}

const TONES = {
  indigo: "bg-indigo-500/15 text-indigo-300",
  violet: "bg-violet-500/15 text-violet-300",
  emerald: "bg-emerald-500/15 text-emerald-300",
  pink: "bg-pink-500/15 text-pink-300",
}

function FloatingCard({
  className,
  enterDelay,
  floatDelay,
  icon,
  tone,
  title,
  subtitle,
  live,
}: {
  className: string
  enterDelay: string
  floatDelay: string
  icon: React.ReactNode
  tone: keyof typeof TONES
  title: string
  subtitle: string
  live?: boolean
}) {
  return (
    <div className={`absolute z-10 animate-fade-up ${className}`} style={{ animationDelay: enterDelay }}>
      <div
        className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl px-3 py-2.5 shadow-xl shadow-black/40 animate-float"
        style={{ animationDelay: floatDelay }}
      >
        <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center ${TONES[tone]}`}>
          {icon}
          {live && (
            <span className="absolute -top-0.5 -right-0.5 flex w-2.5 h-2.5">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping-soft" />
              <span className="relative w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-neutral-900" />
            </span>
          )}
        </div>
        <div className="leading-tight pr-1">
          <p className="text-[12px] font-semibold text-white whitespace-nowrap">{title}</p>
          <p className="text-[11px] text-neutral-400 whitespace-nowrap">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
