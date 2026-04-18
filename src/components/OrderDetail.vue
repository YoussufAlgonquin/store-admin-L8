<template>
  <div class="order-detail" v-if="orderExists">
    <div class="order-header">
      <h2>Order Detail</h2>
      <p><b>Order ID:</b> {{ order._id }}</p>
      <p><b>Customer ID:</b> {{ order.customerId }}</p>
      <p>
        <b>Status:</b>
        <span :class="`status-badge status-${order.status}`" style="margin-left: 0.5rem;">
          {{ order.status }}
        </span>
      </p>
      <p v-if="order.createdAt"><b>Placed:</b> {{ formatDate(order.createdAt) }}</p>
      <p v-if="order.totalPrice !== undefined">
        <b>Total:</b> ${{ Number(order.totalPrice).toFixed(2) }}
      </p>
    </div>

    <div class="order-items" v-if="order.lineItems && order.lineItems.length > 0">
      <h3>Line Items</h3>
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.lineItems" :key="item.productId">
            <td><router-link :to="`/product/${item.productId}`">{{ item.productId }}</router-link></td>
            <td>{{ productName(item.productId) }}</td>
            <td>{{ item.quantity }}</td>
            <td>${{ Number(item.unitPrice).toFixed(2) }}</td>
            <td>${{ (item.quantity * item.unitPrice).toFixed(2) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="text-align: right;"><b>Order Total:</b></td>
            <td><b>${{ computedTotal }}</b></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <p v-else>No line items found.</p>

    <p class="info-note">
      Orders are fulfilled automatically by the makeline service. Status updates happen in the background.
    </p>
  </div>
  <div class="order-detail" v-else>
    <h3>Order not found</h3>
    <router-link to="/orders">← Back to Orders</router-link>
  </div>
</template>

<script>
export default {
  name: 'OrderDetail',
  props: ['orders', 'products'],
  data() {
    return {
      order: null
    }
  },
  computed: {
    orderExists() {
      return !!this.order
    },
    computedTotal() {
      if (!this.order || !this.order.lineItems) return '0.00'
      if (this.order.totalPrice !== undefined) return Number(this.order.totalPrice).toFixed(2)
      return this.order.lineItems.reduce((sum, item) => {
        return sum + (item.unitPrice * item.quantity)
      }, 0).toFixed(2)
    }
  },
  mounted() {
    this.getOrder()
  },
  methods: {
    getOrder() {
      const id = this.$route.params.id
      this.order = this.orders.find(o => o._id === id) || null

      if (!this.order) {
        fetch(`/orders/${id}`)
          .then(response => {
            if (!response.ok) throw new Error('Order not found')
            return response.json()
          })
          .then(data => {
            this.order = data
          })
          .catch(error => console.error(error))
      }
    },
    productName(id) {
      const found = this.products.find(p => p.id === id)
      return found ? found.name : id
    },
    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleString()
    }
  }
}
</script>

<style scoped>
.order-detail {
  text-align: left;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.order-header {
  margin-bottom: 1.5rem;
}

.order-header h2 {
  color: #003DA5;
  margin-top: 0;
}

.order-header p {
  margin: 0.3rem 0;
}

.order-items h3 {
  color: #003DA5;
  margin-bottom: 0.5rem;
}

.info-note {
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  background-color: #e3f2fd;
  border-left: 4px solid #1565c0;
  border-radius: 0 4px 4px 0;
  font-size: 0.85rem;
  color: #1565c0;
}
</style>
