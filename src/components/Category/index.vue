<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="categoryId" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select
            v-model="categoryId.category1Id"
            placeholder="请选择"
            @change="get2List"
            :disabled='disabled'
          >
            <el-option
              :label="c1.name"
              :value="c1.id"
              v-for="c1 in category1List"
              :key="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="categoryId.category2Id"
            placeholder="请选择"
            @change="get3List"
            :disabled='disabled'
          >
            <el-option
              :label="c2.name"
              :value="c2.id"
              v-for="c2 in category2List"
              :key="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="categoryId.category3Id"
            placeholder="请选择"
            @change="getAttrs"
            :disabled='disabled'
          >
            <el-option
              :label="c3.name"
              :value="c3.id"
              v-for="c3 in category3List"
              :key="c3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Category",
  props:['disabled'],
  data() {
    return {
      categoryId: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  methods: {
    //   获取二级数据
    async get2List(category1Id) {
        this.category2List=[]
        this.category3List=[]
        this.categoryId.category2Id = ''
        this.categoryId.category3Id = ''
      const res = await this.$API.attrs.getCategory2List(category1Id);
      if (res.code === 200) {
        this.category2List = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.$bus.$emit('selfClear')
    },
    // 获取三级数据
    async get3List(category2Id) {
        this.category3List=[]
        this.categoryId.category3Id = ''
      const res = await this.$API.attrs.getCategory3List(category2Id);
      if (res.code === 200) {
        this.category3List = res.data;
      } else {
        this.$message.error(res.message);
      }
      this.$bus.$emit('selfClear')
    },
    getAttrs(category3Id) { 
      const categoryId = {
        ...this.categoryId,
        category3Id,
      };
      this.$bus.$emit("selfChange", categoryId);
    },
  },

  async mounted() {
    //   获取一级数据
    const res = await this.$API.attrs.getCategory1List();
    if (res.code === 200) {
      this.category1List = res.data;
    } else {
      this.$message.error(res.message);
    }
  },
 
};
</script>

<style lang="less" scoped>
</style>
