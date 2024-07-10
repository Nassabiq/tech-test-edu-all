<script>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';

export default {
  name: 'ProductList',
  setup() {
    const products = ref([]);
    const searchQuery = ref('');
    const page = ref(1);
    const totalPages = ref(1);
    const limit = ref(10);

    const fetchProducts = () => {
      axios
        .get(`http://localhost:3000/products/search?q=${searchQuery.value}`, {
          params: {
            page: page.value,
            limit: limit.value,
          }
        }
        )
        .then(response => {
          console.log(response)
          products.value = response.data.data;
          totalPages.value = response.data.totalPages;
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    };

    const nextPage = () => {
      if (page.value < totalPages.value) {
        page.value++;
      }
    };

    const prevPage = () => {
      if (page.value > 1) {
        page.value--;
      }
    };

    watch([searchQuery, page], fetchProducts);

    onMounted(fetchProducts);

    return {
      products,
      searchQuery,
      page,
      totalPages,
      nextPage,
      prevPage,
      fetchProducts,
    };
  },
};
</script>
<template>
  <div id="app" class="p-5 m-5 space-y-4">
    <p class="text-4xl font-bold">Product List</p>
    <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5" v-model="searchQuery" placeholder="Search products..." @input="fetchProducts" />
    <div class="grid grid-cols-4 col-span-1 gap-4">
      <div v-for="product in products" :key="product.id" class="p-4 border border-slate-800 rounded-lg">
        <p class="text-2xl font-bold">{{ product.brand }}</p>
        <div class="flex mb-2 justify-between text-sm font-light tracking-wider">
          <p v-text="product.model ? product.model : '-'"></p>
          <p>{{ product.price }}</p>
        </div>
        <p class="font-semibold">Spesifikasi</p>
        <p class="text-sm">{{ product.OS }}, {{ product.color }}, {{ product.cpu }}, {{ product.cpu_speed }}, {{ product.graphics }}, {{ product.graphics_coprocessor }}, {{ product.harddisk }}, {{ product.ram }}, {{ product.rating }}, {{ product.screen_size }}, {{ product.special_features }} </p>
      </div>
    </div>
    <div class="flex flex-col items-center gap-4">
      <span>Page {{ page }} of {{ totalPages }}</span>
      <div class="flex justify-center align-middle gap-4">
        <button @click="prevPage" :disabled="page === 1" class="px-4 py-2 bg-green-500 font-bold text-white hover:bg-green-600 hover:text-slate-200 rounded-lg">Previous</button>
        <button @click="nextPage" :disabled="page === totalPages" class="px-4 py-2 bg-green-500 font-bold text-white hover:bg-green-600 hover:text-slate-200 rounded-lg">Next</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* #app {
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 20px;
}

input {
  margin-bottom: 20px;
  padding: 10px;
  font-size: 16px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
}

h2 {
  margin: 0 0 10px 0;
}

button {
  padding: 10px 20px;
  margin: 5px;
  font-size: 16px;
  cursor: pointer;
}

span {
  margin: 0 10px;
  font-size: 16px;
} */
</style>