import type { Post } from '$content-collections'

import { engineerings } from '$lib/schema/pre-registrations'

export const EVENT_START_DATE = new Date('2026-05-29T09:00:00-06:00')

export const SITE_TITLE = 'ITSM Hackatón'
export const SITE_DESCRIPTION = 'ITSM Hackatón 2026'

// This does not change on the database, so we can save a query to the database to get the stages
export const stages: Record<number, string> = {
  1: 'Scoping',
  2: 'Problem Exploration',
  3: 'Solution Development',
  4: 'Validation & Testing',
  5: 'Business Model',
  6: 'Pitch Design',
}

export const userRolesMap: Record<string, string> = {
  admin: 'Administrador',
  evaluator: 'Evaluador',
  leader: 'Líder',
  organizer: 'Organizador',
  speaker: 'Expositor',
  staff: 'Staff',
  user: 'Usuario',
}

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
