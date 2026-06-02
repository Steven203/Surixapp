# TODO - Integración de componentes/hooks sin romper lógica

- [x] Verificar estructura vs README de `surix-frontend/`.
- [x] Implementar `components/lista/ItemLista.tsx` (antes era stub) con el JSX ya existente en `app/(cliente)/lista/page.tsx`.
- [x] Implementar `components/lista/RutaSugerida.tsx` (antes era stub) para que exista como componente real.
- [x] Actualizar `app/(cliente)/lista/page.tsx` para renderizar ítems usando `ItemLista`.
- [ ] Refactor 2 (seguir con `ListaActions.tsx`): mover solo UI de acciones que sea necesario a `ListaActions.tsx` y reemplazar en la page mediante props.
- [ ] Verificar `lista/[id]/page.tsx` (actualmente `return null`) para integrarlo con `RutaSugerida`/`ItemLista` usando la misma lógica.
- [ ] Ejecutar `pnpm lint` y `pnpm dev` en `surix-frontend` para validar compilación.
