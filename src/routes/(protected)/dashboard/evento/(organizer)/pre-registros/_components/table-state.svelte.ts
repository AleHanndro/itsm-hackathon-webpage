import type { PreRegistrations } from './columns'

export class TableState {
  get isOpen() {
    return this.#isOpen
  }
  set isOpen(value: boolean) {
    this.#isOpen = value
  }

  get selected() {
    return this.#selected
  }
  #isOpen = $state(false)
  #selected = $state<null | PreRegistrations>(null)

  openDetails(data: PreRegistrations) {
    this.#selected = data
    this.#isOpen = true
  }
}

export const TABLE_STATE_KEY = Symbol('TABLE_STATE')
