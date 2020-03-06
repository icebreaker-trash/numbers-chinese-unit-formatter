<template>
  <div class="shshsh">
    <compare v-model="filterNum" :digits="digits" :sbs="startbounds" :units="units" />
    <div>
      <label>value:</label>
      <input v-model="filterNum" />
    </div>
    <div>
      <label>startbounds:</label>
      <input type="number" v-model.number="startbounds" />
    </div>
    <div>
      <label>units:</label>
      <input v-model="unitText" />
    </div>
    <div>
      <label>digits:</label>
      <input type="number" v-model.number="digits" />
    </div>
  </div>
</template>

<script>
import Compare from "./Compare";
export default {
  name: "Control",
  components: {
    Compare
  },
  data() {
    return {
      filterNum: 4545765.8745000067, // 2243189398.87450000670000,
      startbounds: 7,
      unitText: "[8, 4]",
      digits: 2
    };
  },
  computed: {
    units() {
      try {
        return JSON.parse(this.unitText);
      } catch (error) {
        //console.error(error);
        return 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.shshsh {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
