
const app = new Vue({
  el: '#app',
  data: {
    allHouse: [],
    locations: [],
    currentPage: 0,
    currentLocation: '',
    pages: 0,
    filtercity:[],
    filteredPrice:'',
    filterprice:[],
    openfilteredData: false,
  },

  methods: {
    getUniqueList() {
      const locations = new Set(); // ES6 的 set() 取出唯一值
      this.allHouse.forEach((item, i) => { 
        if(item.Region){
          locations.add(item.Region)
        }
      })
      this.locations = Array.from(locations); //https://guahsu.io/2017/06/JavaScript-Duplicates-Array/
    },

    submitFilterText(){
      const vm = this
      if(vm.filteredPrice){
        vm.openfilteredData = true;
        // 將字串轉陣列
        let arrayspit = vm.filteredPrice.split(" ")
        vm.filterprice = vm.filtercity.filter((item) => {
          return Object.keys(item).some((key)=> {
            // 將陣列的資料型態轉數值
            let moreThen = parseInt(arrayspit[0]);
            let lessThen = parseInt(arrayspit[1]);
            // 執行篩選
            if( moreThen && lessThen){
              return  Number(item['LowestPrice']) > moreThen && Number(item['LowestPrice']) < lessThen;
            }else{
              return  Number(item['LowestPrice']) > moreThen
            }                
          })
        })
      }
    },
    //清除篩選條件
    emptyList(){
      let vm = this;
      vm.openfilteredData = false;
      vm.filterprice = [];
      vm.filteredPrice ='';
      vm.getUniqueList();
    }
  },
  
  computed: {
    filterData() {
      const newData = []
      const vm = this
      vm.openfilteredData = false;
      let items = []
      // 過濾地點
        items = vm.allHouse.filter((item, i) => {
          return (item.Region === vm.currentLocation)&&(item.Picture1 !=='')
        })
      vm.filtercity = items 
      // 分頁製作
      items.forEach((item, i) => { //餘數等於0則新增一組陣列
        if (i % 10 === 0) {
          newData.push([])
        }
        const page = parseInt(i / 10) //parseInt整數公式
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
      vm.allHouse = response.data.XML_Head.Infos.Info// 取得遠端資料回傳至“全民宿”的變數裡
      vm.getUniqueList() // 當每次頁面重新渲染時先執行uni Region函式
    })
  }
})