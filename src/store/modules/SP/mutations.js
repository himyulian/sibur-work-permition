import { updateField } from 'vuex-map-fields'

export { updateField }

export function setloading (state, status) {
  state.loading = status
}

export function setItemsND (state, data) {
  state.itemsND = data
}

export function setItemsProduction (state, data) {
  state.itemsProduction = data
}

export function setItemsPlant (state, data) {
  state.itemsPlant = data
}

export function setFilter (state, data) {
  state.filter = data
}

export function setPagination (state, data) {
  Object.assign(state.pagination, data)
}

export function setData (state, data) {
  state.data.splice(0, state.data.length, ...data)
}

export function setCurrentPaged (state, paged) {
  state.currentPaged = paged
}
