<template>
  <div class="action-button">
    <button @click="saveProduct" :disabled="isSaving">
      {{ isSaving ? 'Saving...' : 'Save Product' }}
    </button>
  </div>
  <br/>
  <div v-if="showValidationErrors" class="error">
    <ul v-for="error in validationErrors" :key="error">
      <li>{{ error }}</li>
    </ul>
  </div>
  <div class="product-form">
    <table>
      <tr>
        <td><label for="product-name">Name</label></td>
        <td><input id="product-name" placeholder="Product Name" v-model="product.name" /></td>
        <td></td>
      </tr>

      <tr>
        <td><label for="product-brand">Brand</label></td>
        <td><input id="product-brand" placeholder="Brand (e.g. Samsung, Apple)" v-model="product.brand" /></td>
        <td></td>
      </tr>

      <tr>
        <td><label for="product-category">Category</label></td>
        <td>
          <select id="product-category" v-model="product.category">
            <option value="">-- Select category --</option>
            <option value="LAPTOP">Laptop</option>
            <option value="PHONE">Phone</option>
            <option value="TABLET">Tablet</option>
            <option value="ACCESSORY">Accessory</option>
            <option value="OTHER">Other</option>
          </select>
        </td>
        <td></td>
      </tr>

      <tr>
        <td><label for="product-price">Price ($)</label></td>
        <td><input id="product-price" placeholder="0.00" v-model="product.price" type="number" step="0.01" min="0.01" /></td>
        <td></td>
      </tr>

      <tr>
        <td><label for="product-stock">Stock</label></td>
        <td><input id="product-stock" placeholder="0" v-model="product.stock" type="number" min="0" /></td>
        <td></td>
      </tr>

      <tr>
        <td><label for="product-image">Image URL</label></td>
        <td><input id="product-image" placeholder="https://..." v-model="product.imageUrl" /></td>
        <td></td>
      </tr>

      <tr>
        <td><label for="product-specs">Specs</label></td>
        <td>
          <textarea
            rows="8"
            id="product-specs"
            placeholder="Technical specifications or product description..."
            v-model="product.specs"
          />
        </td>
        <td style="vertical-align: top; padding-top: 4px;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <button
              @click="generateSpecs"
              class="ai-button"
              :disabled="isGenerating"
              title="Generate technical specs using AI"
            >
              {{ isGenerating ? 'Thinking...' : 'AI Specs' }}
            </button>
            <button
              @click="generateDescription"
              class="ai-button"
              :disabled="isGenerating"
              title="Generate marketing description using AI"
            >
              {{ isGenerating ? 'Thinking...' : 'AI Desc' }}
            </button>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ProductForm',
  props: ['products'],
  emits: ['addProductsToList', 'updateProductInList'],
  data() {
    return {
      product: {
        id: null,
        name: '',
        brand: '',
        category: '',
        price: '',
        stock: 0,
        imageUrl: '',
        specs: ''
      },
      showValidationErrors: false,
      isGenerating: false,
      isSaving: false
    }
  },
  mounted() {
    if (this.$route.params.id && this.$route.params.id !== 'add') {
      const found = this.products.find(p => p.id == this.$route.params.id)
      if (found) {
        this.product = {
          id:       found.id,
          name:     found.name     || '',
          brand:    found.brand    || '',
          category: found.category || '',
          price:    found.price    || '',
          stock:    found.stock    ?? 0,
          imageUrl: found.imageUrl || '',
          specs:    found.specs    || ''
        }
      }
    }
  },
  computed: {
    validationErrors() {
      const errors = []
      if (!this.product.name || this.product.name.trim().length === 0)
        errors.push('Name is required')
      if (!this.product.brand || this.product.brand.trim().length === 0)
        errors.push('Brand is required')
      if (!this.product.category)
        errors.push('Category is required')
      if (!this.product.price || parseFloat(this.product.price) <= 0)
        errors.push('Price must be greater than 0')
      if (this.product.stock === '' || parseInt(this.product.stock) < 0)
        errors.push('Stock cannot be negative')
      return errors
    }
  },
  methods: {
    async generateDescription() {
      if (!this.product.name || !this.product.brand || !this.product.category) {
        alert('Please fill in Name, Brand and Category before generating a description')
        return
      }
      this.isGenerating = true
      this.product.specs = 'Generating description...'
      try {
        const response = await fetch('/ai/generate/description', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:     this.product.name,
            brand:    this.product.brand,
            category: this.product.category,
            price:    parseFloat(this.product.price) || 0
          })
        })
        const data = await response.json()
        this.product.specs = data.description || ''
      } catch (err) {
        console.error(err)
        alert('Failed to generate description. Check that the AI service is running.')
        this.product.specs = ''
      } finally {
        this.isGenerating = false
      }
    },
    async generateSpecs() {
      if (!this.product.name || !this.product.brand || !this.product.category) {
        alert('Please fill in Name, Brand and Category before generating specs')
        return
      }
      this.isGenerating = true
      this.product.specs = 'Generating specs...'
      try {
        const response = await fetch('/ai/generate/specs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:     this.product.name,
            brand:    this.product.brand,
            category: this.product.category
          })
        })
        const data = await response.json()
        this.product.specs = data.specs || ''
      } catch (err) {
        console.error(err)
        alert('Failed to generate specs. Check that the AI service is running.')
        this.product.specs = ''
      } finally {
        this.isGenerating = false
      }
    },
    async saveProduct() {
      if (this.validationErrors.length > 0) {
        this.showValidationErrors = true
        return
      }
      this.showValidationErrors = false
      this.isSaving = true

      const isEdit = this.$route.path.includes('edit')
      const method = isEdit ? 'PUT' : 'POST'
      const url = isEdit ? `/products/${this.product.id}` : '/products'

      const payload = {
        name:     this.product.name.trim(),
        brand:    this.product.brand.trim(),
        category: this.product.category,
        price:    parseFloat(this.product.price),
        stock:    parseInt(this.product.stock),
        imageUrl: this.product.imageUrl.trim(),
        specs:    this.product.specs.trim()
      }

      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const saved = await response.json()
        alert('Product saved successfully')
        if (method === 'PUT') {
          this.$emit('updateProductInList', saved)
        } else {
          this.$emit('addProductsToList', saved)
        }
        this.$router.push(`/product/${saved.id}`)
      } catch (err) {
        console.error(err)
        alert('Error occurred while saving product')
      } finally {
        this.isSaving = false
      }
    }
  }
}
</script>

<style scoped>
ul {
  justify-content: center;
  list-style: disc;
  margin: 0;
  padding: 0 0 0 1rem;
  color: #c62828;
}

table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: none;
  background: transparent;
}

td {
  vertical-align: middle;
  border: none;
  padding: 6px 4px;
}

select {
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-family: inherit;
}
</style>
