import { sp } from '@pnp/sp'
import { Notify } from 'quasar'

export async function actFetchItemsNDAll ({ commit }) {
  commit('setLoadingND', true)
  try {
    const result = await Promise.all([
      sp.web.getList('/orgunits/vsk/Lists/List5').items.get(), /* 06 Журнал регистрации НД */
      sp.web.getList('/orgunits/vsk/Lists/00').items.getAll(),    /* 00 Справочник служб и производств */   
      sp.web.getList('/orgunits/vsk/Lists/001').items.getAll()    /* 00 Справочник отделов и установок */
    ])
    // commit('setItems', items)
    commit('setLoadingND', false)
    commit('setItemsND', result[0])
    commit('setItemsProduction', result[1])
    commit('setItemsPlant', result[2])
    console.log('result', result)
  } catch (e) {
    commit('setLoadingND', false)
    console.error('Ошибка загрузки данных\n', e)
  }
}
