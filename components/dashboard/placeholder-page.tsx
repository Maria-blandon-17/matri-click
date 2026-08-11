export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-center">
      <h1 className="text-lg font-medium">{title}</h1>
      <p className="text-sm text-muted-foreground">
        Este módulo se construye en la siguiente fase del proyecto.
      </p>
    </div>
  )
}
