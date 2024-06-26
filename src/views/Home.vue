<template>
  <div class="home">
    <h1>Hauptseite</h1>
    <AccountOverview></AccountOverview>
    <hr>
  
  </div>
  <div class="kontoauszug">
    <About></About>
  </div>
</template>

<script>
// @ is an alias to /src
import AccountOverview from '@/components/AccountOverview.vue'
import About from './About.vue';


export default {
  name: 'Home',
  components: {
    AccountOverview,
    About,

  }
}
</script>
