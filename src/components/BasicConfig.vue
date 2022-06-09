<template>
  <lay-form :model="baseModel" ref="layFormRef" @change="refreshBaseConfig" @input="refreshBaseConfig" required>
    <lay-quote><span class="red-star">*</span>项目</lay-quote>
    <lay-form-item label="项目模板" prop="projectName" class="fitwidth">
      <lay-select v-model="baseModel.projectId" placeholder="请选择项目模板" @change="changeProject">
        <lay-select-option v-for="project in this.$store.getters.projects" :value="project.id" :label="project.mark" :keyword="project.mark"></lay-select-option>
      </lay-select>
    </lay-form-item>
    <lay-form-item label="项目名" prop="projectName" class="fitwidth">
      <lay-input v-model="baseModel.projectName" placeholder="请输入项目名"></lay-input>
    </lay-form-item>
    <lay-form-item label="包路径" prop="packageName" class="fitwidth">
      <lay-input v-model="baseModel.packageName" placeholder="请输入包路径"></lay-input>
    </lay-form-item>
    <lay-form-item label="作者" prop="author" class="fitwidth">
      <lay-input v-model="baseModel.author" placeholder="请输入作者"></lay-input>
    </lay-form-item>
    <lay-form-item label="输出目录" prop="outDir" class="fitwidth">
      <lay-input v-model="baseModel.outDir" placeholder="输出目录"></lay-input>
    </lay-form-item>
    <lay-form-item label="数据库配置" prop="dbId" class="fitwidth2">
      <lay-row space="10" style="display: inline-block;width: 106%">
        <lay-col md="20" lg="20" sm="20">
          <lay-select v-model="baseModel.dbId" placeholder="请选择数据库配置">
            <lay-select-option v-for="database in this.$store.getters.databases" :value="database.id" :label="database.connectName" :keyword="database.connectName"></lay-select-option>
          </lay-select>
        </lay-col>
        <lay-col md="4" lg="4" sm="4">
          <lay-button  prefix-icon="layui-icon-edit" @click="changeDatabaseFormVisible"></lay-button>
        </lay-col>
      </lay-row>
    </lay-form-item>
    <lay-form-item label="数据库名称" prop="dbName" class="fitwidth">
      <lay-input v-model="baseModel.dbName" placeholder="请输入数据库名称"></lay-input>
    </lay-form-item>
    <lay-form-item label="数据表" prop="selectTables"  class="fitwidth">
      <lay-row space="10" style="display: inline-block;width: 106%">
        <lay-col  id="tables" md="20" lg="20" sm="20" style="width: 77%">
          <lay-select v-model="selectTables" create multiple placeholder="请选择数据表" @change="chooseTables">
            <lay-select-option v-for="table in this.$store.getters.tables" :value="table" :label="table"></lay-select-option>
          </lay-select>
        </lay-col>
        <lay-col md="4" lg="4" sm="4">
          <lay-button type="primary" prefix-icon="layui-icon-table" @click="showtables"></lay-button>
        </lay-col>
      </lay-row>
    </lay-form-item>
    <lay-form-item>
      <lay-button @click="reset">重置</lay-button>
      <lay-button class="layui-bg-orange" @click="generateTemplateCode">生成代码</lay-button>
      <lay-button class="layui-bg-blue" @click="preview">生成预览</lay-button>
    </lay-form-item>
  </lay-form>
  <database-form :visible="databaseVisible"></database-form>
</template>

<script>
import {ref, reactive, onMounted} from 'vue'
import {layer} from '@layui/layer-vue'
import DatabaseForm from "./DatabaseForm.vue";
import {store} from "../store/store";
import {generateCode, getDatabaseTables, getProject} from "../api/api";

export default {
  components: {DatabaseForm},
  setup() {
    onMounted(() => {
      var layquotes = document.getElementsByClassName("layui-quote");
      for(var quote of layquotes) {
        quote.style.textAlign = 'left'
      }
      getProject().then(function (res) {
        if (res.code === 0) {
          store.commit("refreshProjects", res.data);
        } else {
          layer.msg(res.msg, { icon : 2, time: 1000})
        }
      })
      validate()
    })
    // 校验
    const validate = function() {
      layFormRef.value.validate((isValidate, model, errors) => {
        if (isValidate) {
          store.commit('nextStep');
        }
      });
    }
    // 重置表单
    const reset = function() {
      layFormRef.value.reset();
      baseModel.specialty = "1"
    }
    const changeDatabaseFormVisible = () => {
      databaseVisible.value = !databaseVisible.value;
    }
    const refreshBaseConfig = () => {
      store.commit("refreshBaseParams", baseModel);
      store.commit("previewProjectTree", true);
    }
    const chooseTables = () => {
      store.commit("refreshChooseTables", selectTables.value);
    }
    const showtables = () => {
      layFormRef.value.validate((isValidate, model, errors) => {
        if (isValidate) {
          if (baseModel.dbId) {
            let id = layer.load(2);
            let database = store.getters.getDatabaseById(baseModel.dbId);
            database.dbName = baseModel.dbName;
            getDatabaseTables(database).then(function (res) {
              if (res.code == 0) {
                store.commit("refreshTables", res.data);
                layer.close(id);
                layer.msg("加载数据表成功", { time: 500})
              } else {
                layer.close(id);
                layer.msg(res.msg, { time: 2000})
              }

            }).catch(function (res) {
              layer.close(id)
            })
          } else {
            layer.msg("请检查必填项！", { time: 2000})
          }
        } else {
          layer.msg("请检查必填项！", { time: 2000})
        }
      });
    }

    const generateTemplateCode = () => {
      layFormRef.value.validate((isValidate, model, errors) => {
        if (isValidate) {
          generateCode({
            baseParam: store.getters.baseParams,
            database: store.getters.getDatabaseById(baseModel.dbId),
            tables: store.getters.chooseTables,
            ftls: store.getters.ftls,
            outDir: baseModel.outDir
          }).then(function (res) {
            if(res.code === 0) {
              layer.msg("代码生成中，请稍后！", { time: 1000})
            } else {
              layer.msg(res.msg, { time: 2000})
            }
          })
        } else {
          layer.msg("请检查必填项！", { time: 2000})
        }
      });

    }
    const changeProject = (e) => {
      store.commit("refreshProject", baseModel.projectId);
    }
    const preview = () => {
      store.commit("previewProjectTree", true);
    }
    const databaseVisible = ref(false);
    const selectTables = ref([]);
    const baseModel = reactive({
      projectName: "demo",
      packageName: "com.example.demo",
      author: "黄锋",
      outDir: "D:\\\\codegen\\",
      dbId: "",
      projectId: -1,
      dbName: ""
    })
    const layFormRef = ref(null);
    refreshBaseConfig();
    return {
      baseModel,
      layFormRef,
      selectTables,
      generateTemplateCode,
      reset,
      changeDatabaseFormVisible,
      showtables,
      databaseVisible,
      refreshBaseConfig,
      chooseTables,
      changeProject,
      preview,
    }
  }
}
</script>

<style scoped>
  .lay-quote{
    text-align: left;
  }
  .red-star {
    color: #FF5722;
    margin-right: 5px;
  }
  .fitwidth {
    width: 91%
  }
  .fitwidth2 {
    width: 85%;
  }
</style>