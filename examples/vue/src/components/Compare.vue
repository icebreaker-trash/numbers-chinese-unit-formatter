<template>
  <div class="compare">
    <div class="shit">
      <div>before:</div>
      <div>{{value}}</div>
    </div>
    <div class="shit">
      <div>default:</div>
      <div>{{value | a}}</div>
    </div>
    <div class="shit">
      <div>custom:</div>
      <div>{{value | b(sbs,units,digits)}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Compare",
  props: {
    value: {
      type: [Number, String],
      default: ""
    },
    digits: {
      type: Number,
      default: 0
    },
    sbs: {
      type: Number,
      default: 0
    },
    units: {
      type: [Array, Number],
      default: () => [0]
    }
  },
  data() {
    return {
      //digits:1
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.compare {
  width: 50%;
  border: 1px solid black;
  .shit {
    > div {
      display: inline-block;
    }
    > :first-child {
      font-size: 18px;
    }
  }
}
</style>
