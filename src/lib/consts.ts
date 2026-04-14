import type { Post } from '$content-collections'

export const SITE_TITLE = 'ITSM Hackatón'
export const SITE_DESCRIPTION = 'ITSM Hackatón 2026'

export const categoryMap: Record<Required<Post>['category'], string> = {
  anuncio: 'Anuncio',
  blog: 'Blog',
  evento: 'Evento',
  noticia: 'Noticia',
}
