<template>
  <div style="margin-left: 20px;">
    <TreeItem v-for="item in treeData"
              :key="item.id"
              :treeItemData="item"
              :parent="treeData"></TreeItem>
  </div>
</template>

<script>
import TreeItem from "./TreeItem.vue";
export default {
  name: "Tree",
  components: {
    TreeItem
  },
  props: {
    treeData: { // 树形控件数据
      type: Array,
      default () {
        return [];
      }
    }
  }
}
</script>