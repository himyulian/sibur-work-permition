import { getField } from 'vuex-map-fields'

export { getField }

export function getOriginal (state) {
  return state.original
}

export function getPagination (state) {
  return state.pagination
}

export function getCurrentPaged (state) {
  return state.currentPaged
}