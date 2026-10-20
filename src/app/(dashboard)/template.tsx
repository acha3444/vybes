// Rejoue une entrée douce à chaque navigation dans l'espace freelance.
export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-up">{children}</div>
}
