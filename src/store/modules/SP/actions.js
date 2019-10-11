import { sp, PagedItemCollection } from '@pnp/sp'
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
    const { page, rowsPerPage, rowsNumber, sortBy, descending, minId, maxId } = props.pagination
    const filter = props.filter

    console.log(getters.getPagination)
    console.log(props.pagination)

    commit('setloading', true)

    // update rowsCount with appropriate value
    commit('setPagination', { rowsNumber: await getRowsNumberCount(filter) || rowsNumber })

    // get all rows if "All" (0) is selected
    const fetchCount = rowsPerPage === 0 ? rowsNumber : rowsPerPage

    // calculate starting row of data
    const startRow = (page - 1) * rowsPerPage

    // fetch data from "server"
    const returnedData = await fetchFromServer(startRow, fetchCount, filter, sortBy, descending, minId, maxId, page) || []

    // clear out existing data and add new
    commit('setData', returnedData)

    // don't forget to update local pagination object
    commit('setPagination', { page })
    commit('setPagination', { rowsPerPage })
    commit('setPagination', { sortBy })
    commit('setPagination', { descending })
    commit('setPagination', { minId: getMinimumId(returnedData) })
    commit('setPagination', { maxId: getMaximumId(returnedData) })

    // ...and turn of loading indicator
    commit('setloading', false)

  } catch (err) {
    console.error(err)
  }

  function getMinimumId (data) {
    return Math.min(...data.map(v => v.Id))
  }

  function getMaximumId (data) {
    return Math.max(...data.map(v => v.Id))
  }

  // SELECT * FROM ... WHERE...LIMIT...
  async function fetchFromServer (startRow, count, filter, sortBy, descending, min, max, page) {
    try {

      let data = []
      const list = sp.web.getList('/orgunits/vsk/Lists/List5')
      const items = list.items.orderBy(sortBy, !descending).top(count);
      let paged = await items.getPaged();

      if (!filter) {

        if (page === 1) {
          data = paged.results
          // data = await sp.web.getList('/orgunits/vsk/Lists/List5').items.top(count).orderBy(sortBy, !descending).getPaged()
          console.log(data)
          commit('setCurrentPaged', paged)
        } else if (page > getters.getPagination.page) {
          paged = await getters.getCurrentPaged.getNext();
          data = paged.results
          // data = await sp.web.getList('/orgunits/vsk/Lists/List5').items.filter(`Id gt ${max}`).top(count).orderBy(sortBy, !descending).get()
          console.log(data)
          commit('setCurrentPaged', paged)
        } else if (page < getters.getPagination.page) {
          paged = await getPrev(items, getters.getCurrentPaged);
          data = paged.results
          // data = await sp.web.getList('/orgunits/vsk/Lists/List5').items.filter(`Id lt ${min}`).top(count).orderBy(sortBy, !descending).get()
          console.log(data)
          commit('setCurrentPaged', paged)
        }

        // if (!descending) {

        //   // console.log('1st page results', paged.results.map(r => `${r.Id} - ${r.Title}`));

        //   // paged = await paged.getNext();
        //   // console.log('2nd page results', paged.results.map(r => `${r.Id} - ${r.Title}`));

        //   // paged = await getPrev(items, paged);
        //   // console.log('1st page again', paged.results.map(r => `${r.Id} - ${r.Title}`));



        // } else {
        //   data = await sp.web.getList('/orgunits/vsk/Lists/List5').items.filter(`Id gt 35204`).top(count).orderBy(sortBy, !descending).get()
        //   console.log(data)
        // }
        // data = getters.getOriginal.slice(startRow, startRow + count)
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

      function getPrev (items, paged) {
        const nextUrl = paged.nextUrl // Private
        const prevUrl = nextUrl
            .split('skiptoken=')[1].split('&')[0].split('%26')
            .map(p => p.split('%3d'))
            .filter(p => p[0].indexOf('p_') === 0)
            .reduce((r, p) => {
                const value = p[0].replace('p_', '').split('_x005f_').reduce((res, prop) => {
                    return res[prop];
                }, paged.results[0]);
                return r.replace(p.join('%3d'), `${p[0]}%3d${value}`);
            }, nextUrl)
            .replace(new RegExp('Paged%3dTRUE', 'i'), 'Paged%3dTRUE%26PagedPrev%3dTRUE');
        const pagedCollection = new PagedItemCollection(items, prevUrl, null);
        return pagedCollection.getNext();
      }

      // // handle sortBy
      // if (sortBy) {
      //   data.sort((a, b) => {
      //     let x = descending ? b : a
      //     let y = descending ? a : b
      //     if (sortBy === 'desc') {
      //       // string sort
      //       return x[sortBy] > y[sortBy] ? 1 : x[sortBy] < y[sortBy] ? -1 : 0
      //     }
      //     else {
      //       // numeric sort
      //       return parseFloat(x[sortBy]) - parseFloat(y[sortBy])
      //     }
      //   })
      // }

      return data
    } catch (err) {
      console.error(err)
    }
  }

  // emulate 'SELECT count(*) FROM ...WHERE...'
  async function getRowsNumberCount (filter) {
    try {

      if (!filter) {
        const itemCount = await sp.web.getList('/orgunits/vsk/Lists/List5').select('ItemCount').get()
        return itemCount.ItemCount
      }
      const returnedRows = await sp.web.getList('/orgunits/vsk/Lists/List5').items.select('ID').filter(`fldWorkType eq '${filter}'`).getAll()
      // let count = 0
      // getters.getOriginal.forEach((treat) => {
      //   if (treat['name'].includes(filter)) {
      //     ++count
      //   }
      // })
      // return count
      return returnedRows.length
    } catch (err) {
      console.error(err)
    }
  }
}
