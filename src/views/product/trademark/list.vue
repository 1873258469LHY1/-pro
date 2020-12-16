<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="add">添加</el-button>
    <!-- 点击添加品牌数据对话框 -->
    <el-dialog title="添加品牌" :visible.sync="visible" width="50%">
      <!-- form表单 -->
      <el-form
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
        :model="trademarkForm"
        ref="trademarkForm"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <!-- 照片上传 -->
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            :before-upload="beforeAvatarUpload"
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 列表数据 -->
    <el-table :data="trademarkList" border style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <!--
            scope代表所有数据
              scope.row 代表当前行所有数据
          -->
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="updateTrade('trademarkForm', scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delTrademark(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分液器 -->
    <el-pagination
      class="trademark-pagination"
      @size-change="getTrademarkList(page, $event)"
      @current-change="getTrademarkList($event, limit)"
      :current-page.sync="page"
      :page-size.sync="limit"
      :page-sizes="[3, 6, 9]"
      :pager-count="7"
      layout="prev, pager, next, jumper, sizes, total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      trademarkList: [],
      page: 1,
      limit: 3,
      total: 0,
      visible: false,
      trademarkForm: {
        tmName: "",
        logoUrl: "",
      },
      isUpdate: false,

      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请上传品牌logo" }],
      },
    };
  },
  methods: {
    //   上传图片成功后
    handleAvatarSuccess(res) {
      //   this.imageUrl = URL.createObjectURL(file.raw);
      this.trademarkForm.logoUrl = res.data;
    },
    //   上传图片前
    beforeAvatarUpload(file) {
      const isType = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isType.includes(file.type)) {
        this.$message.error("上传头像图片只能是 JPG 和 png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isType && isLt2M;
    },
    // 添加品牌数据
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { trademarkForm } = this;
          let res;
          if (trademarkForm.id) {
            res = await this.$API.trademark.updateTrademark(this.trademarkForm);
            const getrow = this.trademarkList.find(
              (trade) => trade.id === trademarkForm.id
            );
            if (
              getrow.tmName === trademarkForm.tmName &&
              getrow.logoUrl === trademarkForm.logoUrl
            ) {
              this.$message.warning("请修改数据后上传");
              return;
            }
          } else {
            res = await this.$API.trademark.addTrademark(this.trademarkForm);
          }
          if (res.code === 200) {
            this.visible = false;
            this.$message.success("加入成功~~~");
            this.getTrademarkList(this.page, this.limit);
          } else {
            this.$message.error("请重新上传~~");
          }
        }
      });
    },
    // 点击添加按钮事件
    add() {
      this.visible = true;
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      this.trademarkForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    //更新品牌数据
    updateTrade(formName, row) {
      this.visible = true;
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      this.trademarkForm = { ...row };
    },
    // 删除品牌数据
    async delTrademark(id) {
      if (confirm("是否确定删除此数据？")) {
        try {
          await this.$API.trademark.delTrademark(id);
          this.$message.success("删除成功");
          //判断当本页数据删除完时应该跳转到上一页请求数据
          this.page =
            this.trademarkList.length === 1 ? this.page - 1 : this.page;
          console.log(this.page, this.trademarkList.length);
          this.getTrademarkList(this.page, this.limit);
          return;
        } catch (err) {
          console.log(err);
        }
      }
      return;
    },
    //   封装请求数据的函数
    async getTrademarkList(page, limit) {
      const res = await this.$API.trademark.getPageList(page, limit);
      if (res.code === 200) {
        // this.$message.success("请求成功~");
        this.trademarkList = res.data.records;
        // this.limit = res.data.size;
        this.total = res.data.total;
        // this.page = res.data.current;
      } else {
        this.$message.error("请求数据失败~");
      }
    },
    // 改变一页中信息数量的事件
    // handleSizeChange(limit){
    //     this.getTrademarkList(this.page,limit)
    // },
    // 点击页码事件
    // handleCurrentChange(page){
    //     this.getTrademarkList(page,this.limit)
    // }
  },
  mounted() {
    //   获取全部数据
    this.getTrademarkList(this.page, this.limit);
    let that = this;
    // setInterval(() => {
    //     that.$API.trademark.addTrademark(
    //           {tmName:'金亮你真骚，骚的不要不要的',logoUrl:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3302711460,3578762839&fm=26&gp=0.jpg'}
    //         );
    // }, 5000);
  },
};
</script>
<style lang="sass" scoped>
.el-table
    margin-top: 20px
.trademark-img
    width: 120px
>>>.avatar-uploader .el-upload
    border: 1px dashed #d9d9d9
    border-radius: 6px
    cursor: pointer
    position: relative
    overflow: hidden
    &:hover
        border-color: #409EFF

>>>.avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center

>>>.avatar
    width: 178px
    height: 178px
    display: block
</style>
