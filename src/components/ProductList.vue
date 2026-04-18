<template>
  <div class="action-button">
    <router-link to="/product/add">
      <button>Add Product</button>
    </router-link>
  </div>
  <div class="product-list">
    <table>
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Name</th>
          <th>Brand</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td><router-link :to="`/product/${product.id}`">{{ product.id }}</router-link></td>
          <td>{{ product.name }}</td>
          <td>{{ product.brand }}</td>
          <td><span class="category-badge">{{ product.category }}</span></td>
          <td>${{ Number(product.price).toFixed(2) }}</td>
          <td>{{ product.stock }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  props: ['products'],
  mounted() {
    this.$emit('getProducts')
  }
}
</script>

<style scoped>
.product-list {
  text-align: left;
  margin-top: 3rem;
}
</style>
