<template>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
    <h2 style="margin: 0;">Orders</h2>
    <button @click="fetchOrders">Refresh</button>
  </div>
  <div class="order-list" v-if="hasOrders">
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer ID</th>
          <th>Status</th>
          <th>Total</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order._id">
          <td><router-link :to="`/order/${order._id}`">{{ order._id }}</router-link></td>
          <td>{{ order.customerId }}</td>
          <td>
            <span :class="`status-badge status-${order.status}`">{{ order.status }}</span>
          </td>
          <td>${{ orderTotal(order) }}</td>
          <td>{{ formatDate(order.createdAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="order-list" v-else>
    <p>No orders found. Click Refresh to load orders.</p>
  </div>
</template>

<script>
export default {
  name: 'OrderList',
  props: ['orders'],
  emits: ['fetchOrders'],
  computed: {
    hasOrders() {
      return this.orders.length > 0
    }
  },
  methods: {
    fetchOrders() {
      this.$emit('fetchOrders')
    },
    orderTotal(order) {
      if (order.totalPrice !== undefined) {
        return Number(order.totalPrice).toFixed(2)
      }
      if (!order.lineItems) return '0.00'
      const total = order.lineItems.reduce((sum, item) => {
        return sum + (item.unitPrice * item.quantity)
      }, 0)
      return total.toFixed(2)
    },
    formatDate(dateStr) {
      if (!dateStr) return '—'
      return new Date(dateStr).toLocaleString()
    }
  },
  beforeMount() {
    this.fetchOrders()
  }
}
</script>

<style scoped>
.order-list {
  text-align: left;
}
</style>
