import { getField } from 'vuex-map-fields'

export { getField }

export function getOriginal (state) {
  return state.original
}

export function getPagination (state) {
  return state.pagination
}
