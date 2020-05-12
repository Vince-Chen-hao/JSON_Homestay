
const app = new Vue({
  el: '#app',
  data: {
    data: [],
    locations: [],
    currentPage: 0,
    currentLocation: '',
    pages: 0,

  },
  methods: {
    getUniqueList() {
      const locations = new Set(); // 使用 ES6 中的 set() 取出唯一值
      this.data.forEach((item, i) => { // 核對跟他相同地區的值，並回傳至locations
        locations.add(item.Region)
      })
      this.locations = Array.from(locations); //https://guahsu.io/2017/06/JavaScript-Duplicates-Array/
    } //讓set重複物件建立新陣列
  },
  computed: {
    filterData() {
      const newData = []
      const vm = this
      let items = []
      // 過濾地點
        items = vm.data.filter((item, i) => {
          return (item.Region === vm.currentLocation)&&(item.Picture1 !=='')
         }) //filter當條件為true則顯示
      
      // 分頁製作
      items.forEach((item, i) => { //餘數等於0則新增一組陣列
        if (i % 10 === 0) {
          newData.push([])
        }
        const page = parseInt(i / 10) //parseInt為整數公式
        newData[page].push(item)
      })
      vm.pages = newData.length // 分頁數量
      vm.currentPage = 0
      return newData
    },
  },
  created () {
    const vm = this
    axios.get('https://cors-anywhere.herokuapp.com/https://gis.taiwan.net.tw/XMLReleaseALL_public/hotel_C_f.json')
    .then((response) => {
      console.log(response)
      vm.data = response.data.XML_Head.Infos.Info//1. 取得kpi資料回傳給變數data
      vm.getUniqueList() // 取得資料後，將地區的值取出來 //2. 每次動作都會呼叫getuni
    })
  }
})