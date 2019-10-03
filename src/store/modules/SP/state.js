export default {
  loadingND: false,
  itemsND: [
    {
      Id: 11,
      fldWorkType: 'Огневые работы',
      fldOrgunit1Site: 6.0,
      carbs: 24,
      protein: 4.0,
      sodium: 87,
      calcium: '14%',
      iron: '1%'
    },
    {
      Id: 22,
      fldWorkType: 'Газоопасные работы',
      fldOrgunit1Site: 9.0,
      carbs: 37,
      protein: 4.3,
      sodium: 129,
      calcium: '8%',
      iron: '1%'
    },
    {
      Id: 33,
      fldWorkType: 'Огневые работы',
      fldOrgunit1Site: 16.0,
      carbs: 23,
      protein: 6.0,
      sodium: 337,
      calcium: '6%',
      iron: '7%'
    }
  ],
  itemsProduction: [],
  itemsPlant: [],
  columnsND: [
    {
      name: 'Id',
      label: 'ID',
      field: 'Id',
      align: 'left',
      sortable: true,
    },
    { 
      name: 'fldWorkType',
      label: 'Вид работ',
      field: 'fldWorkType',
      align: 'center',
      sortable: true 
    },
    { 
      name: 'fldOrgunit1SiteId',
      label: 'Производство/Служба',
      field: 'fldOrgunit1SiteId',
      sortable: true
    },
    { 
      name: 'fldOrgunit2siteId',
      label: 'Установка/Отделение/Отдел',
      field: 'fldOrgunit2siteId',
      sortable: true
    },
    { 
      name: 'fldWorkPlace',
      label: 'Место проведения работ',
      field: 'fldWorkPlace',
      sortable: true
    },
    { 
      name: 'fldWorkStatus',
      label: 'Статус наряда',
      field: 'fldWorkStatus',
      sortable: true
    },
    { 
      name: 'fldWorkCharacter',
      label: 'Характер работ',
      field: 'fldWorkCharacter',
      sortable: true
    },
  ],
}
