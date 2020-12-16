<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form :model="spu" label-width="80px">
        <el-form-item label="SPU名称">
          <el-input
            placeholder="请输入SPU名称"
            v-model="spu.spuName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select placeholder="请输入品牌名称" v-model="spu.tmId">
            <el-option
              v-for="tm in trademarkList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-input
            type="textarea"
            placeholder="请输入SPU描述"
            v-model="spu.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            :file-list="formatImg"
            :on-success="submitImg"
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePictureCardPreview"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            v-model="spu.sale"
          >
            <el-option
              v-for="sale in filterSaleAttrList"
              :label="sale.name"
              :value="`${sale.id}-${sale.name}`"
              :key="sale.id"
            ></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus" @click="addSaleAttr"
            >添加销售属性</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :data="spuSaleAttrList"
        border
        style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column
          label="属性名"
          width="180"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="属性值名称列表">
          <template v-slot="{ row }">
            <el-tag
              @close="delTag(i, row)"
              closable
              style="margin-right: 5px"
              v-for="(attrVal, i) in row.spuSaleAttrValueList"
              :key="attrVal.id"
              >{{ attrVal.saleAttrValueName }}</el-tag
            >
            <el-input
              v-if="row.edit"
              size="mini"
              style="width: 100px"
              @blur="editCompleted(row)"
              @keyup.enter.native="editCompleted(row)"
              ref="input"
              v-model="saleAttrValueText"
            ></el-input>
            <el-button v-else icon="el-icon-plus" size="mini" @click="edit(row)"
              >添加</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot='{$index}'>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRow($index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary">保存</el-button>
      <el-button>取消</el-button>
      <el-dialog :visible.sync="visible">
        <img width="100%" :src="previewImgUrl" alt="img" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuAttrList",
  props: ["item"],
  data() {
    return {
      spu: this.item,
      trademarkList: [],
      spuImageList: [],
      saleAttrList: [],
      spuSaleAttrList: [], // 当前SPU销售属性列表
      saleAttrValueText: "",
      previewImgUrl: "", // 图片地址
      visible: false, // 图片对话框显示&隐藏
    };
  },
  computed: {
    //   过滤后剩余属性列表
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        // this.spuSaleAttrList.indexOf() // 只适用于数组中是基本类型
        // 找到了返回{}  没有找到返回undefined
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        ); // 适用于数组中是引用类型
      });
    },
    //   格式化图片
    formatImg() {
      return this.spuImageList.map((item) => {
        return {
          uid: item.id || item.uid,
          name: item.imgName,
          url: item.imgUrl,
        };
      });
    },
  },
  methods: {
    // 删除整行数量
    delRow(index){
        this.spuSaleAttrList.splice(index,1)
    },
    //   删除Tag方法
    delTag(i, row) {
      row.spuSaleAttrValueList.splice(i, 1);
    },
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    // 选择属性
    addSaleAttr() {
      // 选中的销售属性
      const { sale, id } = this.spu;

      const [baseSaleAttrId, saleAttrName] = sale.split("-");
      // 将销售属性添加到商品中
      this.spuSaleAttrList.push({
        baseSaleAttrId: +baseSaleAttrId, // 所有销售属性id
        saleAttrName, // 所有销售属性名称
        spuId: id, // SPU id
        spuSaleAttrValueList: [], // 销售属性值列表
      });
      // 清空选中的销售属性id
      this.spu.sale = "";
    },
    //   添加属性值
    editCompleted(row) {
      console.log(row);
      if (this.saleAttrValueText) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.saleAttrValueText,
          spuId: row.spuId,
        });
        // 添加完成数据清空
        this.saleAttrValueText = "";
      }

      row.edit = false;
    },
    //   图片预览
    handlePictureCardPreview(file) {
      this.previewImgUrl = file.url;
      this.visible = true;
    },
    //   上传之前图片验证
    beforeAvatarUpload(file) {
      // console.log(file);
      const imgTypes = ["image/jpg", "image/png", "image/jpeg"];
      // 检测文件类型
      const isValidType = imgTypes.indexOf(file.type) > -1;
      // 检测文件大小
      const isLt = file.size / 1024 < 50;

      if (!isValidType) {
        this.$message.error("上传品牌LOGO只能是 JPG 或 PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO大小不能超过 50 kb!");
      }
      // 返回值为true，代表可以上传
      // 返回值为false，代表不可以上传
      return isValidType && isLt;
    },
    //   图片上传成功的回调
    submitImg(res, file) {
      this.spuImageList.push({
        imgUrl: res.data,
        imgName: file.name,
        uid: file.uid,
        spuId: this.spu.id,
      });
    },
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
      const { id } = this.spu;
      const res = await this.$API.spu.getSpuImageList(id);
      if (res.code === 200) {
        this.spuImageList = res.data;
      } else {
        this.$message.error(res.message);
      }
    },

    // 获取所有的销售属性
    async getSaleAttrList() {
      const res = await this.$API.spu.getSaleAttrList();
      if (res.code === 200) {
        this.saleAttrList = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
    /*
  获取SPU的销售属性列表
  */
    async getSpuSaleAttrList() {
      const { id } = this.spu;
      const res = await this.$API.spu.getSpuSaleAttrList(id);
      if (res.code === 200) {
        this.SpuSaleAttrList = res.data;
        console.log(res);
      } else {
        this.$message.error(res.message);
      }
    },
  },
  mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getSaleAttrList();
  },
};
</script>

<style lang="less" scoped>
</style>
