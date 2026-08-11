export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="font-bold">© {new Date().getFullYear()} MatriClick. Precisión sin fricción.</div>
        <div className="flex gap-6">
          <a
            href="#features"
            className="font-label-mono text-xs text-muted-foreground opacity-80 transition-opacity hover:opacity-100"
          >
            Funciones
          </a>
          <a
            href="#how-it-works"
            className="font-label-mono text-xs text-muted-foreground opacity-80 transition-opacity hover:opacity-100"
          >
            Cómo funciona
          </a>
        </div>
      </div>
    </footer>
  )
}
