import { sp } from '@pnp/sp'
import { Notify } from 'quasar'

export async function actFetchND ({ commit }) {
  commit('setloading', true)
  try {
    const result = await Promise.all([
      sp.web.getList('/orgunits/vsk/Lists/List5').items.get(),    /* 06 Журнал регистрации НД */
      sp.web.getList('/orgunits/vsk/Lists/00').items.getAll(),    /* 00 Справочник служб и производств */   
      sp.web.getList('/orgunits/vsk/Lists/001').items.getAll()    /* 00 Справочник отделов и установок */
    ])
    // commit('setItems', items)
    commit('setloading', false)
    commit('setItemsND', result[0])
    commit('setItemsProduction', result[1])
    commit('setItemsPlant', result[2])
    // console.log('result', result)
  } catch (e) {
    commit('setloading', false)
    console.error('Ошибка загрузки данных\n', e)
  }
}

export async function onRequest ({ commit, getters }, props) {
  try {
    let { page, rowsPerPage, rowsNumber, sortBy, descending } = props.pagination
    let filter = props.filter
  
    commit('setloading', true)
  
    // update rowsCount with appropriate value
    commit('setPagination', { rowsNumber: await getRowsNumberCount(filter) || rowsNumber })

    // get all rows if "All" (0) is selected
    let fetchCount = rowsPerPage === 0 ? rowsNumber : rowsPerPage

    // calculate starting row of data
    let startRow = (page - 1) * rowsPerPage

    // fetch data from "server"
    let returnedData = await fetchFromServer(startRow, fetchCount, filter, sortBy, descending) || []

    // clear out existing data and add new
    commit('setData', returnedData)

    // don't forget to update local pagination object
    commit('setPagination', { page })
    commit('setPagination', { rowsPerPage })
    commit('setPagination', { sortBy })
    commit('setPagination', { descending })

    // ...and turn of loading indicator
    commit('setloading', false)

  } catch (err) {
    console.error(err)
  }

  // SELECT * FROM ... WHERE...LIMIT...
  async function fetchFromServer (startRow, count, filter, sortBy, descending) {
    try {
      // await (new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve()
      //   }, 1500)
      // }))
  
      let data = []
  
      if (!filter) {
        data = getters.getOriginal.slice(startRow, startRow + count)
      }
      else {
        let found = 0
        for (let index = startRow, items = 0; index < getters.getOriginal.length && items < count; ++index) {
          let row = getters.getOriginal[index]
          // match filter?
          if (!row['name'].includes(filter)) {
            // get a different row, until one is found
            continue
          }
          ++found
          if (found >= startRow) {
            data.push(row)
            ++items
          }
        }
      }
  
      // handle sortBy
      if (sortBy) {
        data.sort((a, b) => {
          let x = descending ? b : a
          let y = descending ? a : b
          if (sortBy === 'desc') {
            // string sort
            return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
          }
          else {
            // numeric sort
            return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
          }
        })
      }
  
      return data
    } catch (err) {
      console.error(err)
    }
  }

  // emulate 'SELECT count(*) FROM ...WHERE...'
  async function getRowsNumberCount (filter) {
    try {
      // await (new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     reject('ERROR RowNumberCount')
      //   }, 1500)
      // }))

      if (!filter) {
        return getters.getOriginal.length
      }
      let count = 0
      getters.getOriginal.forEach((treat) => {
        if (treat['name'].includes(filter)) {
          ++count
        }
      })
      return count
    } catch (err) {
      console.error(err)
    }
  }
}