"use client"

import { useRef, useState } from "react"
import { Upload, Loader2, ImageOff } from "lucide-react"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"

export function SedeImagenInput({ defaultUrl }: { defaultUrl?: string | null }) {
  const [url, setUrl] = useState(defaultUrl ?? "")
  const [preview, setPreview] = useState(defaultUrl ?? "")
  const [subiendo, setSubiendo] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setSubiendo(true)

    const extension = file.name.split(".").pop() || "jpg"
    const path = `${crypto.randomUUID()}.${extension}`
    const supabase = createClient()
    const { error } = await supabase.storage.from("sedes").upload(path, file, {
      cacheControl: "3600",
    })

    setSubiendo(false)

    if (error) {
      toast.error("No se pudo subir la imagen. Intenta de nuevo.")
      return
    }

    const { data } = supabase.storage.from("sedes").getPublicUrl(path)
    setUrl(data.publicUrl)
  }

  return (
    <div className="space-y-2">
      <FieldLabel htmlFor="imagenArchivo">Imagen de portada</FieldLabel>
      <input type="hidden" name="imagenUrl" value={url} />
      <div className="flex items-center gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/20">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- preview puede ser un blob: URL de recién seleccionado, next/image no lo soporta
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500">
              <ImageOff className="size-6" />
            </div>
          )}
          {subiendo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          )}
        </div>
        <div className="space-y-1">
          <input
            ref={inputRef}
            id="imagenArchivo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="border-white/15"
            disabled={subiendo}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-4" />
            {subiendo ? "Subiendo..." : "Elegir desde el explorador"}
          </Button>
          <p className="text-xs text-muted-foreground">JPG, PNG o WebP, máx. 5 MB.</p>
        </div>
      </div>
    </div>
  )
}
