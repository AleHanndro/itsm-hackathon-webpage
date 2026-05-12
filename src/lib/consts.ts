import type { Post } from '$content-collections'

import { engineerings } from '$lib/schema/pre-registrations'

export const EVENT_START_DATE = new Date('2026-05-29T09:00:00-06:00')

export const SITE_TITLE = 'ITSM Hackatón'
export const SITE_DESCRIPTION = 'ITSM Hackatón 2026'

export const categoryMap: Record<Required<Post>['category'], string> = {
  anuncio: 'Anuncio',
  blog: 'Blog',
  evento: 'Evento',
  noticia: 'Noticia',
}

export const engineeringMap: Record<(typeof engineerings)[number], string> = {
  IE: 'Ingeniería Electrónica',
  IEM: 'Ingeniería Electromecánica',
  IER: 'Ingeniería en Energías Renovables',
  II: 'Ingeniería Industrial',
  ISC: 'Ingeniería en Sistemas Computacionales',
}
