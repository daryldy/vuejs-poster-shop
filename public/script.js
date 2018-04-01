
var PRICE = 2.95
var LOAD_NUM = 10

new Vue({
  el: "#app",
  data: {
    total: 0,
    results: [],
    items: [],
    cart: [],
    newSearch: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE
  },
  computed: {
    noMoreItems: function() {
      return this.items.length === this.results.length && this.results.length > 0
    },
  },
  methods: {
    appendItems: function() {
      if (this.results.length > this.items.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM)
	this.items = this.items.concat(append)
      }
    },
    onSubmit: function() {
      this.items = []
      this.results= []
      this.loading = true
      this.lastSearch = ""
      if (this.newSearch.length > 0) {
        this.$http
        .get('/search/'.concat(this.newSearch))
        .then(function(res){
          this.results = res.data
          this.appendItems()
          this.lastSearch = this.newSearch
          this.loading = false
        })
      } else {
        this.loading = false
      }
    },
    addItem: function(index) {
      this.total += PRICE
      var item = this.items[index]
      var found = false
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          found = true
          this.cart[i].qty++
          break
        }
      }
      if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        })
      }
    },
    inc: function(item) {
      item.qty++
      this.total += PRICE
    },
    dec: function(item) {
      item.qty--
      this.total -= PRICE
      if (item.qty <= 0) {
        for (var i=0; i<this.cart.length; i++) {
          if (item.id === this.cart[i].id) {
            this.cart.splice(i,1)
            break
          }
        }
      }
    },
  },
  filters: {
    currency: function(p) {
      return '$'.concat(p.toFixed(2))
    }
  },
  mounted: function() {
    this.onSubmit()

    var vueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      vueInstance.appendItems()
    });
  },
});

