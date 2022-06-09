<template>
  <div>
    <Tree :tree-data="preview()"></Tree>
  </div>
</template>

<script>
import Tree from "./Tree.vue";
import {uuid} from "../util/commonUtil";
import {store} from "../store/store";
import {ref, reactive, onMounted} from 'vue'

export default {
  name: "TreePreview",
  components: {
    Tree
  },
  setup() {
    var lastKeyDownTime = 0;
    var keydown = true;
    onMounted(() => {
      // document.addEventListener('keyup', function(e){
      //   keydown = true;
      //   lastKeyDownTime = new Date().getTime();
      // });
      //
      // setInterval(function () {
      //   var cur = new Date().getTime();
      //   if (cur - lastKeyDownTime > 1000 && keydown) {
      //     keydown = false;
      //     store.commit("previewProjectTree", true);
      //   }
      // }, 500)
    })
    const buildTreeItem = (options) => {
      var item = {
        id: 1,
        text: '',
        icon: '',
        expand: false
      };
      for (var key in options) {
        item[key] = options[key]
      }
      return item;
    }

    const getProjectName = (project) => {
      return project.pid ? (store.getters.baseParams.projectName + '-' + project.name + '.src.main.java.' + store.getters.baseParams.packageName) : project.name;
    }
    const generateProjectDir = (project, treeData, pTreeItem, projectDir) => {
      if (!project) {
        return null;
      }
      // 生成项目目录
      if (projectDir) {
        projectDir = projectDir + '.' + getProjectName(project);
      } else {
        projectDir = getProjectName(project);
      }
      var treeItem = generateDir(getProjectName(project), pTreeItem);
      if (pTreeItem == null) {
        treeData.push(treeItem);
        pTreeItem = treeItem;
      }

      // 生成项目子模块目录
      for(var childProject of project.children) {
        var pTreeItem2 = pTreeItem;
        generateProjectDir(childProject, treeData, pTreeItem2, projectDir);
      }

      // 生成项目模板文件
      for (var ftl of project.ftls) {
        var pTreeItem3 = pTreeItem;
        if (ftl.generator && ['useTable', 'mybatis'].includes(ftl.generator)) {
          for (var table of store.getters.chooseTables) {
            generateTableTagFtl(projectDir, project, ftl, table.nameUpperCase, pTreeItem3);
          }
        } else {
          ftl.fileNameCopy = ftl.fileName
          generateNormalTagFtl(projectDir, project, ftl, pTreeItem3);
        }
        if (refreshFlag) {
          store.commit("flashFtls");
          refreshFlag = false;
        }
        store.commit('addFtl', {
          "name": ftl.name,
          "outDir": ftl.outDir,
          "projectDir": projectDir ? projectDir : '',
          "fileName": ftl.fileName,
          "params": {},
          "underRootPath": ftl.underRootPath,
          "generator": ftl.generator
        })
      }
      return pTreeItem;
    }
    const hasChild = (treeItem, dir) => {
      if (!treeItem) {
        return null;
      }
      if (treeItem.text == dir) {
        return treeItem;
      }
      var children = treeItem.children;
      if (children) {
        for (var child of children) {
          if (child.text === dir) {
            return child;
          }
        }
      }
      return null;
    }
    const generateDir = (outDir, pTreeItem) => {
      if (outDir) {
        outDir = outDir.split(".")
      } else {
        outDir = [];
      }
      for (var dir of outDir) {
        var child = hasChild(pTreeItem, dir);
        if (!child) {
          var treeItem = buildTreeItem({
            icon: "dir",
            text: dir,
            id: uuid()
          })
          treeItem.children = [];
          if (pTreeItem) {
            pTreeItem.children.push(treeItem);
          }
          pTreeItem = treeItem;
        } else {
          pTreeItem = child;
        }
      }
      return pTreeItem;
    }
    const generateTableTagFtl = (projectDir, project, ftl, tableName, pTreeItem) => {
      ftl.fileNameCopy = ftl.fileName.replace("%s", tableName)
      generateNormalTagFtl(projectDir, project, ftl, pTreeItem);
    }
    const generateNormalTagFtl = (projectDir, project, ftl, pTreeItem) => {
      var dir = projectDir + '.' + ftl.outDir;
      if (!ftl.underRootPath) {
        pTreeItem = generateDir(dir, pTreeItem);
      } else {
        var pdir = getProjectName(project);
        pTreeItem = generateDir(pdir.substring(0, pdir.indexOf(".")), pTreeItem);
      }
      var dotPos = ftl.fileNameCopy.lastIndexOf(".");
      var treeItem = buildTreeItem({
        icon: (dotPos < 0 || (dotPos === ftl.fileName.length-1)) ?'txt':ftl.fileNameCopy.substring(dotPos+1),
        text: ftl.fileNameCopy,
        id: uuid(),
        pDir: dir
      })
      pTreeItem.children.push(treeItem);
    }

    const generatePreview = (baseParam, tables, project) => {

      if (store.state.preview) {
        store.commit("previewProjectTree", false);
        var pTreeItem = null;
        var treeData = [];
        // pTreeItem = generatePackageDir(packageName, treeData, pTreeItem);
        pTreeItem = generateProjectDir(project, treeData, pTreeItem, "");

        store.commit('refreshTreeData', treeData);
      }

      return store.state.treeData;
    }

    var refreshFlag = false;
    const preview = () => {
      refreshFlag = true;
      return generatePreview(store.getters.baseParams, store.getters.chooseTables, store.getters.project)
    }
    return {
      preview
    }
  },
  methods: {
    addNode () {
      this.treeData.push()
    }
  }
}
</script>

<style scoped>

</style>