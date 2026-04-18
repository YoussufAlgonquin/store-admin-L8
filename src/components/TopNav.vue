<template>
  <nav>
    <div class="logo">
      <a href="/">
        <span class="logo-text">
          <span class="logo-best">Best</span><span class="logo-buy">Buy</span>
        </span>
        <span class="logo-admin">Admin</span>
      </a>
    </div>
    <ul class="nav-links" :class="{ 'nav-links--open': isNavOpen }">
      <li><router-link to="/orders" @click="closeNav">Orders</router-link></li>
      <li><router-link to="/products" @click="closeNav">Products</router-link></li>
    </ul>
    <button class="hamburger" @click="toggleNav">
      <span class="hamburger-icon"></span>
    </button>
  </nav>
</template>

<script>
export default {
  name: 'TopNav',
  data() {
    return {
      isNavOpen: false
    }
  },
  methods: {
    toggleNav() {
      this.isNavOpen = !this.isNavOpen
    },
    closeNav() {
      this.isNavOpen = false
    }
  }
}
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #003DA5;
  color: #fff;
  padding: 0.75rem 1.5rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.logo a {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-text {
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: -1px;
}

.logo-best {
  color: #fff;
}

.logo-buy {
  color: #FFE000;
}

.logo-admin {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.7);
  font-weight: normal;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-left: 1px solid rgba(255,255,255,0.4);
  padding-left: 0.5rem;
}

.nav-links {
  display: flex;
  list-style: none;
  font-size: 1rem;
  font-weight: bold;
  gap: 1.5rem;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  height: 24px;
}

.hamburger-icon {
  display: block;
  width: 24px;
  height: 2px;
  background-color: #fff;
  position: relative;
}

.hamburger-icon::before,
.hamburger-icon::after {
  content: '';
  display: block;
  width: 24px;
  height: 2px;
  background-color: #fff;
  position: absolute;
  left: 0;
}

.hamburger-icon::before { top: -7px; }
.hamburger-icon::after  { bottom: -7px; }

@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #003DA5;
    padding: 1rem;
    flex-direction: column;
    gap: 0;
  }

  .nav-links--open {
    display: flex;
  }

  .nav-links--open li {
    padding: 0.5rem 0;
  }

  .hamburger {
    display: block;
  }
}
</style>
