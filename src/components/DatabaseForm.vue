<template>
  <lay-layer resize="true"  title="数据库配置" v-model="visible">
    <lay-form :model="databaseModel" ref="layFormRef">
      <br/>
      <lay-form-item label="连接名" class="form-item" prop="connectName" required>
        <lay-input v-model="databaseModel.connectName" placeholder="添加新的配置"></lay-input>
      </lay-form-item>
      <lay-form-item label="地址" prop="dbUrl" class="form-item" required>
        <lay-input v-model="databaseModel.dbUrl" placeholder="主机名或ip地址"></lay-input>
      </lay-form-item>
      <lay-form-item label="用户名" prop="username" class="form-item" required>
        <lay-input v-model="databaseModel.username" placeholder="请输入数据库用户名"></lay-input>
      </lay-form-item>
      <lay-form-item label="密码" prop="password" class="form-item" required>
        <lay-input v-model="databaseModel.password" placeholder="请输入数据库密码"></lay-input>
      </lay-form-item>
      <lay-form-item prop="databases" class="form-item">
        <lay-row space="10" style="display: inline-block;width: 106%">
          <lay-col md="8" lg="8" sm="8">
            <lay-select create placeholder="添加新的配置" @change="changeDatabase">
              <lay-select-option v-for="database in this.$store.getters.databases" :value="database.id" :label="database.connectName"
                                 :keyword="database.connectName"></lay-select-option>
            </lay-select>
          </lay-col>
          <lay-col md="16" lg="16" sm="16">
            <lay-button-container>
              <lay-button class="layui-bg-cyan" @click="addDatabase">新增</lay-button>
              <lay-button type="primary" @click="saveDatabase">保存</lay-button>
              <lay-button type="danger" prefix-icon="layui-icon-delete" @click="deleteDatabase"></lay-button>
            </lay-button-container>
          </lay-col>
        </lay-row>
      </lay-form-item>
    </lay-form>
  </lay-layer>
</template>

<script>
import {ref, reactive} from 'vue'
import {deepClone, uuid} from "../util/commonUtil";
import {store} from "../store/store";
import {layer} from "@layui/layer-vue";

export default {
  name: "DatabaseForm",
  components: {},
  props: {
    visible: {
      default: false
    }
  },
  setup(props) {
    const buildDatabase = () => {
      return {
        id: uuid(),
        connectName: "staging",
        dbName: "",
        dbUrl: "10.38.160.178",
        username: "testuser",
        password: "cfctest123"
      }
    }

    const clearDatabaseModel = () => {
      for (var key in databaseModel) {
        databaseModel[key] = "";
      }
    }

    const getDatabaseById = (id) => {
      return store.getters.getDatabaseById(id);
    }
    const addDatabase = function () {
      layFormRef.value.validate((isValidate, model, errors) => {
        if (isValidate) {
          databaseModel.id = uuid();
          if (!getDatabaseById(databaseModel.id)) {
            let cloneDatabase = deepClone(databaseModel);
            store.commit('addDatabase', cloneDatabase);
            clearDatabaseModel();
            layer.msg("添加数据库配置成功", { icon : 1, time: 1000})
          }
        }
      });
    }
    const saveDatabase = function () {
      layFormRef.value.validate((isValidate, model, errors) => {
        if (isValidate) {
          let cloneDatabase = deepClone(databaseModel);
          store.commit('saveDatabase', cloneDatabase);
        }
      });
    }
    const deleteDatabase = function () {
      layFormRef.value.validate((isValidate, model, errors) => {
        if (isValidate) {
          let cloneDatabase = deepClone(databaseModel);
          store.commit('deleteDatabase', cloneDatabase);
          clearDatabaseModel();
          layer.msg("删除数据库配置成功", { icon : 1, time: 1000})
        }
      });
    }
    const changeDatabase = (val) => {
      let newDatabaseNow = getDatabaseById(val);
      if (!newDatabaseNow) {
        newDatabaseNow = buildDatabase();
      }

      for (var key in newDatabaseNow) {
        databaseModel[key] = newDatabaseNow[key];
      }
    }
    let databaseModel = reactive(buildDatabase());
    const layFormRef = ref(null);

    return {
      layFormRef,
      databaseModel,
      changeDatabase,
      addDatabase,
      saveDatabase,
      deleteDatabase,
    };
  }
}
</script>

<style scoped>
  .form-item {
    width: 90%;
  }
</style>