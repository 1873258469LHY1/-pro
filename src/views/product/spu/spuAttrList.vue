<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="trademarkList" label-width="80px">
        <el-form-item label="SPU名称">
          <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select placeholder="请输入品牌名称" v-model="spu.tmid">
            <el-option
              v-for="tm in trademarkList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-input type="textarea" placeholder="请输入SPU描述" v-model="spu.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-select placeholder="还有2项未选择" v-model="spu.tmid"></el-select>
          <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload> -->
      <el-table :data="{}" border style="width: 100%; margin-bottom: 20px">
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column label="属性名" width="180"> </el-table-column>
        <el-table-column label="属性值名称列表"> </el-table-column>
        <el-table-column label="操作" width="180">
          <template>
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuAttrList",
  props:['item'],
  data() {
    return {
      spu: this.item,
      trademarkList: [],
      spuImageList:[],
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
    };
  },
  methods: {

    //   获取所有品牌列表
    async getTrademarkList() {
      const res = await this.$API.spu.getTrademarkList();
      if (res.code === 200) {
        this.trademarkList = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    /*
  获取SPU的图片列表
  */
    async getSpuImageList() {
        // console.log(111);
      const res = await this.$API.spu.getSpuImageList(this.spu.id);
    //   console.log(222);
      if (res.code === 200) {
        this.spuImageList = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    /*
  获取SPU的销售属性列表
  */
    getSpuSaleAttrList(spuId) {},

    /*
  获取所有销售属性列表
  */
    getSaleAttrList() {},
  },
  mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
  },
};
</script>

<style lang="less" scoped>
</style>
