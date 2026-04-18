<template>
  <TopNav />
  <router-view
    :orders="orders"
    :products="products"
    @fetchOrders="fetchOrders"
    @addProductsToList="addProductsToList"
    @updateProductInList="updateProductInList"
    @getProducts="getProducts"
  ></router-view>
</template>

<script>
import TopNav from './components/TopNav.vue';

export default {
  name: 'App',
  components: {
    TopNav
  },
  data() {
    return {
      orders: [],
      products: [],
    }
  },
  mounted() {
    this.getProducts();
  },
  methods: {
    async addProductsToList(newProduct) {
      this.products.push(newProduct);
    },
    async updateProductInList(updatedProduct) {
      const index = this.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) this.products[index] = updatedProduct;
    },
    async getProducts() {
      fetch('/products')
        .then(response => response.json())
        .then(products => {
          this.products = products;
        })
        .catch(error => {
          console.log(error);
          alert('Error occurred while fetching products');
        });
    },
    async fetchOrders() {
      fetch('/orders')
        .then(response => response.json())
        .then(data => {
          this.orders = data;
        })
        .catch(error => console.error(error));
    },
  },
}
</script>

<style>
body {
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #1a1a1a;
  margin-top: 80px;
  padding: 1rem;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  margin: 0 1rem;
}

a {
  color: #003DA5;
  text-decoration: none;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  background-color: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

th {
  padding: 10px 12px;
  text-align: left;
  background-color: #003DA5;
  color: #fff;
  font-weight: bold;
}

td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background-color: #f5f8ff;
}

.order-detail {
  text-align: left;
}

button {
  padding: 10px 16px;
  background-color: #003DA5;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 42px;
  font-size: 0.9rem;
}

button:hover {
  background-color: #002a73;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.action-button {
  float: right;
  margin-bottom: 1rem;
}

.product-detail {
  text-align: left;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 2rem;
  margin: 1rem auto;
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.product-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem auto;
  width: 60%;
  background-color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.form-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.ai-button {
  margin-left: 10px;
  padding: 8px 12px;
  height: auto;
  background-color: #FFE000;
  color: #1a1a1a;
  font-weight: bold;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.ai-button:hover {
  background-color: #e6ca00;
}

.ai-button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}

textarea {
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-family: inherit;
}

label {
  text-align: right;
  margin-right: 10px;
  width: 100px;
  font-weight: bold;
  flex-shrink: 0;
}

input, select {
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-family: inherit;
}

.category-badge {
  display: inline-block;
  background-color: #FFE000;
  color: #1a1a1a;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.error {
  color: #c62828;
  background-color: #ffebee;
  border: 1px solid #ef9a9a;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  text-align: left;
}

.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-pending    { background-color: #fff3e0; color: #e65100; }
.status-processing { background-color: #e3f2fd; color: #1565c0; }
.status-complete   { background-color: #e8f5e9; color: #2e7d32; }
</style>
