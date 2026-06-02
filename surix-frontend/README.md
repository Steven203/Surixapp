# 🛒 Mercado App — Frontend

Aplicación web para clientes y administradores de un supermercado. Permite gestionar listas de compra con ruta sugerida por estantes.

---

## Stack

| Herramienta | Versión | Uso |
|---|---|---|
| Next.js | 14+ | Framework principal (App Router) |
| TypeScript | 5+ | Tipado estático |
| Tailwind CSS | 3+ | Estilos |
| shadcn/ui | latest | Componentes UI |
| Zustand | 4+ | Estado global |
| SWR | 2+ | Fetching y caché de datos |
| React Hook Form | 7+ | Manejo de formularios |
| Zod | 3+ | Validación de esquemas |

---

## Estructura de carpetas

```
src/
├── app/                              # App Router de Next.js
│   ├── (auth)/                       # Rutas públicas
│   │   └── login/
│   │       └── page.tsx
│   ├── (admin)/                      # Rutas protegidas — rol ADMIN
│   │   ├── layout.tsx
|   |   |__admin          # verifica rol antes de renderizar
│   │      ├── productos/
│   │      │   └── page.tsx
│   │      ├── estantes/
│   │      │   └── page.tsx
│   │      ├── categorias/
│   │      │   └── page.tsx
│   │      └── usuarios/
│   │          └── page.tsx
│   └── (cliente)/                    # Rutas protegidas — rol CLIENTE
│   |    ├── layout.tsx
│   |    ├── lista/
│   |    │   └── page.tsx              # lista activa del cliente
│   |    └── lista/[id]/
│   |        └── page.tsx              # items con ruta sugerida
│   |__catalogo
|      |__page.tsx
|
├── components/
│   ├── ui/                           # componentes genéricos (shadcn/ui) puedes instalarlos
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── badge.tsx
│   │   └── table.tsx
│   ├── productos/
│   │   ├── ProductoCard.tsx
│   │   ├── ProductoForm.tsx
│   │   └── ProductoTable.tsx
|   |   |__ ProductoFiltros.tsx
|   |   
│   ├── estantes/
│   │   ├── EstanteForm.tsx
│   │   └── EstanteMap.tsx            # mapa visual del supermercado
│   ├── lista/
│   │   ├── ItemLista.tsx             # item con checkbox recogido
│   │   ├── RutaSugerida.tsx          # items ordenados por orden_logico
│   │   └── ListaActions.tsx          # botones agregar, finalizar
│   └── layout/
│       ├── Navbar.tsx
│       └── Sidebar.tsx

|
├── api/                              # capa de comunicación con el backend
│   ├── client.ts                     # fetch base con URL y headers
│   ├── usuarios.ts
│   ├── roles.ts
│   ├── productos.ts
│   ├── estantes.ts
│   ├── categorias.ts
│   └── listas.ts
│
├── hooks/                            # lógica reutilizable
│   ├── useAuth.ts
│   ├── useProductos.ts
│   ├── useLista.ts
│   └── useRutaSugerida.ts
│
├── store/                            # estado global con Zustand
│   ├── authStore.ts                  # usuario logueado + rol
│   └── listaStore.ts                 # lista activa + items
│
├── types/                            # tipos TypeScript
│   ├── usuario.ts
│   ├── producto.ts
│   ├── estante.ts
│   ├── categoria.ts
│   └── lista.ts
│
└── proxy.ts                     # protege rutas según rol
```

## Convenciones

**Archivos:**
- Componentes: `PascalCase.tsx` — `ProductoCard.tsx`
- Hooks: `camelCase.ts` con prefijo `use` — `useLista.ts`
- Módulos API: `camelCase.ts` — `listas.ts`
- Tipos: `camelCase.ts` — `lista.ts`

**Componentes:**
- Un componente por archivo
- Props tipadas con `type` no `interface`
- Exportación por defecto para páginas, nombrada para componentes

**API:**
- Siempre usar los módulos de `api/` — nunca `fetch` directo en componentes
- Errores siempre capturados con `try/catch`
- Revalidar con `mutate()` después de mutaciones

**Variables de entorno:**
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Cómo correr el proyecto

```bash
# instalar dependencias
pnpm install

#  Desarrollo local
pnpm dev


# Compilar para producción

pnpm build

# Ejecutar modo producción
pnpm start

#Revisar errores de código

pnpm lint

La app corre en `http://localhost:3000`