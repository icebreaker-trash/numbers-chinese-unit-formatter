<template>
  <div id="app">
    <cctv />
  </div>

</template>

<script>
import cctv from "@/components/Control";
export default {
  name: "App",
  components: {
    cctv
  },
  data() {
    return {};
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
