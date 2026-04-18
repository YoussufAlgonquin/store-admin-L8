<template>
  <div class="action-button">
    <router-link :to="`/product/${$route.params.id}/edit`">
      <button>Edit Product</button>
    </router-link>
  </div>
  <br/>
  <div class="product-detail" v-if="productExists">
    <div class="product-image">
      <img :src="product.imageUrl" :alt="product.name" @error="onImgError" />
    </div>
    <div class="product-info">
      <span class="category-badge">{{ product.category }}</span>
      <h2>{{ product.name }}</h2>
      <p><strong>Brand:</strong> {{ product.brand }}</p>
      <p><strong>Price:</strong> ${{ Number(product.price).toFixed(2) }}</p>
      <p><strong>Stock:</strong> {{ product.stock }}</p>
      <small style="color:#999">Product ID: {{ product.id }}</small>

      <div v-if="product.specs" class="specs-section">
        <h3>Specifications / Description</h3>
        <p class="specs-text">{{ product.specs }}</p>
      </div>
    </div>
  </div>
  <div class="product-detail" v-else>
    <h3>Product not found</h3>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  props: ['products'],
  computed: {
    product() {
      return this.products.find(p => p.id == this.$route.params.id)
    },
    productExists() {
      return !!this.product
    }
  },
  methods: {
    onImgError(e) {
      e.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
.product-image {
  flex: 1;
  max-width: 320px;
}

.product-image img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.product-info {
  flex: 1;
  text-align: left;
}

.product-info h2 {
  font-size: 1.6rem;
  margin: 0.5rem 0;
}

.product-info p {
  margin: 0.3rem 0;
}

.specs-section {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f8f8;
  border-left: 4px solid #003DA5;
  border-radius: 0 4px 4px 0;
}

.specs-section h3 {
  margin: 0 0 0.5rem;
  color: #003DA5;
  font-size: 1rem;
}

.specs-text {
  white-space: pre-line;
  font-size: 0.9rem;
  color: #333;
  margin: 0;
}

@media (max-width: 768px) {
  .product-detail {
    flex-direction: column;
  }
}
</style>
