<template>
  <div>
    <lay-step :active="active" @onChange="onChange">
      <lay-step-item title="基本配置" icon="layui-icon-release">
      </lay-step-item>
      <lay-step-item title="模板配置" icon="layui-icon-tree">
      </lay-step-item>
      <lay-step-item title="其他配置" icon="layui-icon-share">
      </lay-step-item>
    </lay-step>
    <component :is="currentConfig()"></component>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import BasicConfig from "./BasicConfig.vue";

export default {
  name: "ConfigStep",
  components: {BasicConfig},
  setup() {
    const active = ref(0);
    const configArr = ["basic-config", "basic-config", "basic-config"]

    const next = () => {
      if (active.value++ >=2) active.value = 0
    };
    const previous = () => {
      if (active.value-- ===0) active.value = 0
    };
    const onChange = (index) => {
      active.value = index
    };
    const currentConfig = () => {
      return configArr[active.value];
    };
    onMounted(() => {
      var steps = document.getElementsByClassName("lay-step-item-content-title")
      for(var step of steps) {
        step.style.float = "left"
      }
    })
    return {
      active,
      next,
      previous,
      onChange,
      currentConfig
    }
  },

}
</script>

<style scoped>
  .lay-step .lay-step-item .lay-step-item-content .lay-step-item-content-title {
    float: left !important;
  }
</style>