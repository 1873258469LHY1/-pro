
<template>
  <div>
    <Category @selfChange="getAttrsList" :disabled="!isShow" />

    <!-- 初始页面 -->
    <el-card v-show="!isShow">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table :data="attrsList" border style="width: 100%">
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="180">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              v-for="val in row.attrValueList"
              :key="val.id"
              style="margin-right: 5px"
              >{{ val.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="update(row)"
              >修改</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 页面切换 -->
    <el-card v-show="isShow">
      <el-form :model="attr" inline>
        <el-form-item label="属性名" prop="attrName">
          <el-input
            v-model="attr.attrName"
            style="margin-bottom: 20px"
          ></el-input>
          <el-button type="primary" icon="el-icon-plus" @click="addAttrValue"
            >添加属性值</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 表格数据 -->
      <el-table
        :data="attr.attrValueList"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column align="center" type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row, $index }">
            <el-input
              v-if="row.edit"
              v-model="row.valueName"
              @blur="editCompleted(row, $index)"
              @keyup.enter.native="editCompleted(row, $index)"
              autofocus
              ref="input"
              size="mini"
            ></el-input>
            <!-- 直接给对象添加新属性不是响应式数据, 通过this.$set添加的属性才是响应式 -->
            <span
              v-else
              @click="edit(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
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
import Category from "./category";
export default {
  name: "AttrList",
  data() {
    return {
      attrsList: [],
      attr: {
        attrName: "",
        attrValueList: [],
      },
      isShow: false,
      flag: 0,
    };
  },
  components: {
    Category,
  },
  methods: {
    addAttrValue() {
      this.attr.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    editCompleted(row, index) {
      if (!row.valueName) {
        this.attr.attrValueList.splice(index, 1);
        return;
      }
      row.edit = false;
    },
    //   更新数据
    update(attr) {
      this.isShow = true;
      this.attr = JSON.parse(JSON.stringify(attr));
    },
    // 获取属性数据
    async getAttrsList(categoryId) {
      const res = await this.$API.attrs.getAttrsList(categoryId);
      if (res.code === 200) {
        this.attrsList = res.data;
      } else {
        this.$message.error(res.message);
      }
    },
  },
  mounted() {},
};
</script>
