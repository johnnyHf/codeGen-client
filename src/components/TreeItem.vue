  <template>
  <div>
    <div class="tree" @click="expand()">
      <!-- 展开、收缩 -->
      <img :src="'../src/assets/'+((!treeItemData.children || treeItemData.children.length  === 0)?'blank':(treeItemData.expand?'right':'down'))+'.png'"
           alt=""/>
      <img :class="{'down': false,'expand_right': treeItemData.expand,'no-child': (!treeItemData.children || treeItemData.children.length  === 0)}"
           :src="'../src/assets/'+treeItemData.icon+'.png'"
           :alt="treeItemData.expand"/>
      <!-- 文本 -->
      <span v-if="!updateFlag"
            class="text">{{treeItemData.text}}</span>
      <input v-else
             type="text"
             ref="inputText"
             v-model="treeItemData.text"
             @blur="updateFlag = false" />
<!--      &lt;!&ndash; 修改 &ndash;&gt;-->
<!--      <img class="operation_img"-->
<!--           src="../assets/update.png"-->
<!--           alt=""-->
<!--           @click="updateFlag = !updateFlag">-->
<!--      &lt;!&ndash; 增加 &ndash;&gt;-->
<!--      <img class="operation_img"-->
<!--           src="../assets/add.png"-->
<!--           alt=""-->
<!--           @click="append">-->
<!--      &lt;!&ndash; 删除 &ndash;&gt;-->
<!--      <img class="operation_img"-->
<!--           src="../assets/delete.png"-->
<!--           alt=""-->
<!--           @click="del">-->
    </div>
    <div style="margin-left: 30px;"
         v-if="!treeItemData.expand">
      <!-- 递归 -->
      <TreeItem v-for="item in treeItemData.children"
                :key="item.id"
                :treeItemData="item"
                :parent="treeItemData.children"></TreeItem>
    </div>
  </div>
</template>

<script>
let id = 1000;
export default {
  name: "TreeItem",
  props: {
    parent: { // 父级数据
      type: Array,
      default () {
        return [];
      }
    },
    treeItemData: { // 本节点数据
      type: Object,
      default () {
        return {};
      }
    }
  },
  watch: {
    // 使文本框聚焦
    updateFlag (val) {
      this.$nextTick(() => {
        val && this.$refs.inputText.focus();
      })
    }
  },
  data () {
    return {
      updateFlag: false, // input显示控制
    }
  },
  methods: {
    // 添加
    append () {
      const newChild = { id: id++, text: '新增节点', children: [] };
      if (!this.treeItemData.children) {
        this.$set(this.treeItemData, 'children', []);
      }
      this.treeItemData.children.push(newChild);
    },
    // 删除
    del () {
      const index = this.parent.findIndex(item => item.id === this.treeItemData.id);
      this.parent.splice(index, 1);
    },
    expand() {
      this.treeItemData.expand = !this.treeItemData.expand;
    }
  }
}
</script>

<style lang="less" scoped>
img {
  width: 25px;height:25px;
}
.displayNone {
  display: none;
}
.tree {
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 40px;
  .down {
    width: 10px;
    height: 10px;
    margin-left: -10px;
    transition: all 0.2s linear;
    &.expand_right {
      transform: rotate(-0deg);
    }
    &.no-child {
      display: none;
    }
  }
  .text {
    margin: 0 10px;
  }
  .operation_img {
    width: 18px;
    height: 18px;
    margin-left: 10px;
  }
  input {
    padding: 5px 10px;
    width: 100px;
  }
}
</style>>