<template>
  <lay-collapse>
    <lay-collapse-item :title="childProjectData.mark+' (项目)'" :id="'project'+childProjectData.id">
      <label class="layui-form-label">项目/模板名</label>
      <div class="layui-input-block">
        <input @input="changeProject" @change="changeProject" style="background: rgba(0, 0, 0, 0.01)" type="text" placeholder="请输入项目/模板名" :value="childProjectData.pid ? (this.$store.getters.baseParams.projectName + '-' + childProjectData.name) : childProjectData.name"
               :id="childProjectData.id"
               autocomplete="off" class="layui-input">
      </div>
      <project-collapse v-for="project in childProjectData.children"
                        :key="project.id"
                        :parent="childProjectData.children"
                        :childProjectData="project">
      </project-collapse>
      <lay-collapse-item v-for="ftl in childProjectData.ftls" :title="ftl.mark+' (模板)'" :id="'ftl'+ftl.id">
        <label class="layui-form-label">包名配置</label>
        <div class="layui-input-block">
          <input @input="changeFtl" @change="changeFtl" style="background: rgba(0, 0, 0, 0.01)" type="text" placeholder="请输入实体类包名" :value="ftl.outDir"
                 :id="ftl.id + '11'"
                 :projectId="childProjectData.id"
                 autocomplete="off" class="layui-input">
        </div>
        <br/>
        <label class="layui-form-label">文件名格式</label>
        <div class="layui-input-block">
          <input @input="changeFtl" @change="changeFtl" style="background: rgba(0, 0, 0, 0.03)" type="text" placeholder="请输入文件格式名" :value="ftl.fileName"
                 :id="ftl.id + '22'"
                 :projectId="childProjectData.id"
                 autocomplete="off" class="layui-input">
        </div>
      </lay-collapse-item>
    </lay-collapse-item>


  </lay-collapse>

</template>

<script>
import {store} from "../store/store";

export default {
  props: {
    parent: { // 父级数据
      type: Array,
      default () {
        return [];
      }
    },
    childProjectData: { // 本节点数据
      type: Object,
      default () {
        return {};
      }
    }
  },
  name: "ProjectCollapse",
  setup() {
    let suffixMap = {
      "11": "outDir",
      "22": "fileName"
    }

    const changeFtl = (e) => {
      let id = e.target.id;
      let projectId = parseInt(e.target.getAttribute("projectId"));
      let value = e.target.value;
      let ftl = {
        id: parseInt(id.substring(0, id.length-2))
      }
      ftl[suffixMap[id.substring(id.length-2)]] = value;
      store.commit("saveFtl", {
        projectId: projectId,
        ftl: ftl
      })
    }
    const changeProject = (e) => {

    }
    return {
      changeFtl,
      changeProject,
    }
  }
}
</script>

<style scoped>

</style>