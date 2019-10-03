<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-table
        title="Журнал наряд-допусков"
        :data="itemsND"
        :columns="columnsND"
        no-data-label="Нет данных"
        row-key="Id"
        :loading="loadingND"
      />
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'PageIndex',
  computed: {
    ...mapState('SP', [
      'itemsND',
      'columnsND',
      'loadingND',
    ]),
  },
  data () {
    return {

    }
  },
  methods: {
    ...mapActions('SP', [
      'actFetchItemsNDAll',
    ])
  },
  created () {
    if (process.env.PROD) {
      this.actFetchItemsNDAll()
    } else if (process.env.DEV) {}
  },
}
</script>
