<template>
  <lay-container>
    <div class="card-container">
      <lay-card style="width: 1400px;margin: auto" title="模板代码生成器">
        <lay-row space="10">
          <lay-col sm="8" md="8" lg="8">
            <basic-config></basic-config>
          </lay-col>
          <lay-col sm="8" md="8" lg="8">
            <i><strong>(项目)</strong>  代表一个项目模块；<strong>(模板)</strong>  代表一个文件</i>
            <br/>
            <br/>
            <project-collapse v-if="this.$store.getters.project != null"
                              :key="this.$store.getters.project.id"
                              :childProjectData="this.$store.getters.project">
            </project-collapse>
          </lay-col>
          <lay-col lg="8" md="8" sm="8">

            <lay-panel>预览</lay-panel>
            <tree-preview></tree-preview>
          </lay-col>
        </lay-row>

      </lay-card>
    </div>
  </lay-container>

</template>

<script>
import {ref} from 'vue';
import TreePreview from "./TreePreview.vue";
export default {
  name: "index",
  components: {TreePreview},
  setup() {
    const loading = ref(true);

    return {
      loading,

    }
  },
  methods() {

  }
}
</script>

<style scoped>
.lay-card {
  width: 1000px;
}
.card-container {
  background: whitesmoke;
  padding: 20px;
}

.lay-step .lay-step-item-content .lay-step-item-content-title {
  float: left;
}
</style>