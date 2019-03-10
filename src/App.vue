<template>
  <div id="app">
    <!-- <hello></hello>
    <myfilter /> -->
    <router-view/>
    <!-- <myaxios></myaxios> -->
  </div>
</template>

<script>
import hello from './demos/userDefineddirective/hello'
import myfilter from './demos/filter'
import myaxios from './demos/axios'
export default {
  name: 'App',
  components: {
    hello,
    myfilter,
    myaxios
  }
}
</script>

<style>
@import 'styles/index.scss';
#app {
  overflow-x: hidden;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
