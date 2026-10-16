-- Bucket "sedes" (público, ya creado vía API de Storage) para las imágenes de portada
-- subidas desde el formulario de /dashboard/administracion/sedes. La lectura es pública
-- porque el bucket es público; solo admin puede escribir.
create policy "sedes_imagenes_insert_admin"
on storage.objects for insert
to authenticated
with check (bucket_id = 'sedes' and public.rol_actual() = 'admin');

create policy "sedes_imagenes_update_admin"
on storage.objects for update
to authenticated
using (bucket_id = 'sedes' and public.rol_actual() = 'admin')
with check (bucket_id = 'sedes' and public.rol_actual() = 'admin');

create policy "sedes_imagenes_delete_admin"
on storage.objects for delete
to authenticated
using (bucket_id = 'sedes' and public.rol_actual() = 'admin');
