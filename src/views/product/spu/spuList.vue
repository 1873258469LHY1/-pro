<template>
  <el-card style="margin-top: 20px" v-loading="loading">
    <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
    <el-table
      :data="spuList"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column align="center" type="index" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
      <el-table-column label="SPU描述" prop="description"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" icon="el-icon-plus" size="mini"></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$bus.$emit('sendSpuId', row)"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="trademark-pagination"
      @size-change="getSpuList(page, $event)"
      @current-change="getSpuList($event, limit)"
      :current-page.sync="page"
      :page-size.sync="limit"
      :page-sizes="[3, 6, 9]"
      layout="prev, pager, next , jumper , sizes , total"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: "SpuList",
  data() {
    return {
      spuList: [],
      page: 1,
      limit: 3,
      total: 0,
      loading: false,
      categoryId: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    //   获取数据列表
    async getSpuList(page, limit) {
      this.loading = true;
      const { category3Id } = this.categoryId;
      const res = await this.$API.spu.getPageList({
        category3Id,
        page,
        limit,
      });
      if (res.code === 200) {
        this.spuList = res.data.records;
        this.total = res.data.total;
      } else {
        this.$message.error(res.message);
      }
      this.loading = false;
    },
    // 三级改变时触发
    handleChange(categoryId) {
      this.categoryId = categoryId;
      this.getSpuList(this.page, this.limit);
    },
    // 清空数据列表
    clearAttrList() {
      this.spuList = [];
      this.total = 0;
      this.limit = 3;
      this.page = 1;
      this.categoryId.category3Id = "";
    },
  },

  mounted() {
    this.$bus.$on("selfChange", this.handleChange);
    this.$bus.$on("selfClear", this.clearAttrList);
  },
  beforeDestroy() {
    this.$bus.$off("selfChange", this.handleChange);
    this.$bus.$off("slefClear", this.clearAttrList);
  },
};
</script>

<style lang="less" scoped>
</style>
