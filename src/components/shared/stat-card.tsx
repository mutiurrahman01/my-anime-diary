import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  description?: string
  className?: string
}

export function StatCard({ label, value, description, className }: StatCardProps) {
  return (
    <div className={cn("rounded-2xl border bg-card p-5 shadow-sm", className)}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}