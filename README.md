# Sitio web del ITSM Hackathon 2026

Sitio para el ITSM Hackathon 2026, construido con SvelteKit, Tailwind CSS 4 y TypeScript.

## 🛠️ Desarrollo

### Prerrequisitos

- **Node.js:** `>= 24.12.0`
- **pnpm:** `>= 10.0.0`

### Primeros pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/AleHanndro/itsm-hackathon-webpage.git
cd itsm-hackathon-webpage

# 2. Instalar dependencias
pnpm install

# 3. Iniciar el servidor de desarrollo
pnpm run dev
```

El servidor estará disponible en [http://localhost:5173](http://localhost:5173).

### Scripts disponibles

| Comando            | Descripción                                                     |
| :----------------- | :-------------------------------------------------------------- |
| `pnpm run dev`     | Inicia el servidor de desarrollo con Vite.                      |
| `pnpm run build`   | Genera la versión de producción en `.svelte-kit/output`.        |
| `pnpm run preview` | Previsualiza localmente la versión de producción generada.      |
| `pnpm run check`   | Ejecuta comprobaciones de tipos de Svelte y TypeScript.         |
| `pnpm run lint`    | Analiza el código buscando problemas de estilo y posibles bugs. |
| `pnpm run format`  | Aplica formato al código usando Prettier.                       |

## 🚢 Despliegue

Este proyecto está configurado para desplegarse automáticamente en **Vercel** mediante la integración con GitHub utilizando `@sveltejs/adapter-vercel`.
