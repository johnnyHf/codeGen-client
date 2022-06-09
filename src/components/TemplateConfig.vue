<template>
  <lay-collapse v-model="ftls">
    <lay-collapse-item v-for="ftl in this.$store.getters.ftls" :title="ftl.mark" :id="ftl.name">
      <label class="layui-form-label">包名配置</label>
      <div class="layui-input-block">
        <input @input="changeFtl" @change="changeFtl" style="background: rgba(0, 0, 0, 0.01)" type="text" placeholder="请输入实体类包名" :value="ftl.outDir"
               :id="ftl.name + '11'"
               autocomplete="off" class="layui-input">
      </div>
      <br/>
      <label class="layui-form-label">文件名格式</label>
      <div class="layui-input-block">
        <input @input="changeFtl" @change="changeFtl" style="background: rgba(0, 0, 0, 0.03)" type="text" placeholder="请输入文件格式名" :value="ftl.fileName"
               :id="ftl.name + '22'"
               autocomplete="off" class="layui-input">
      </div>
    </lay-collapse-item>
  </lay-collapse>
</template>

<script>
import {reactive, ref} from "vue";
import {getTemplate} from "../api/api";
import {store} from "../store/store";
import {layer} from "@layui/layer-vue";

export default {
  setup() {
    let suffixMap = {
      "11": "outDir",
      "22": "fileName"
    }
    let ftls = null
    getTemplate().then(function (res) {
      if (res.code === 0) {
        ftls = reactive(res.data);
        store.commit("refreshFtls", res.data);
      } else {
        ftls = reactive([]);
        layer.msg(res.msg, { icon : 2, time: 1000})
      }
    })

    const changeFtl = (e) => {
      let id = e.target.id;
      let value = e.target.value;
      let ftl = {
        name: id.substring(0, id.length-2)
      }
      ftl[suffixMap[id.substring(id.length-2)]] = value;
      store.commit("saveFtl", ftl)
    }
    return {
      changeFtl,
      ftls,
    }
  }
}
</script>

<style scoped>

</style>