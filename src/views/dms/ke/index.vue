<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right;"
          type="primary"
          @click="handleSearchList()"
          size="small"
        >
          查询搜索
        </el-button>
        <el-button
          style="float: right; margin-right: 15px;"
          @click="handleResetSearch()"
          size="small"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px;">
        <el-form
          :inline="true"
          :model="listQuery"
          size="small"
          label-width="140px"
        >
          <el-form-item label="输入搜索：">
            <el-input
              v-model="listQuery.keyword"
              class="input-width"
              placeholder="科/科名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px;"></i>
      <span style="margin-top: 5px;">数据列表</span>
      <el-button class="btn-add" @click="add()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productAttrCateTable"
        style="width: 100%;"
        :data="list"
        v-loading="listLoading"
        border
      >
        <el-table-column
          label="编号"
          type="index"
          :index="indexFunc"
          width="100"
          align="center"
        >
        </el-table-column>
        <el-table-column label="科-名称" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.bacteriaName }}
          </template>
        </el-table-column>
        <el-table-column label="科-中文名称" width="300" align="center">
          <template slot-scope="scope">
            {{ scope.row.bacteriaNameZh }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5, 10, 15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-form
        ref="ke"
        :model="sel_bacteria"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="科-名称" prop="keName">
          <el-input
            v-model="sel_bacteria.bacteriaName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-form
        ref="ke"
        :model="sel_bacteria"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="科-中文名称" prop="bacteriaNameZh">
          <el-input
            v-model="sel_bacteria.bacteriaNameZh"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('ke')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  createBacteria,
  updateBacteria,
  deleteBacteria,
} from "@/api/dmsBacteria.js";
const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  bacteriaType: 1,
};
export default {
  name: "ke",
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        bacteriaType: 1,
      },
      dialogVisible: false,
      dialogTitle: "",
      sel_bacteria: {},
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.getList();
    },
    indexFunc(index) {
      return index + 1;
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    reset() {
      this.sel_bacteria = {};
    },
    add() {
      this.reset();
      this.dialogVisible = true;
      this.dialogTitle = "添加科";
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleDelete(index, row) {
      this.$confirm("是否要删除该科", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteBacteria(row.id).then((response) => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000,
          });
          this.reset();
          this.getList();
        });
      });
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.dialogTitle = "编辑科";
      this.sel_bacteria = row;
    },

    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === "添加科") {
            this.sel_bacteria.bacteriaType = this.listQuery.bacteriaType;
            createBacteria(this.sel_bacteria).then((response) => {
              this.$message({
                message: "添加成功",
                type: "success",
                duration: 1000,
              });
              this.reset();
              this.dialogVisible = false;
              this.getList();
            });
          } else {
            updateKe(this.sel_bacteria).then((response) => {
              this.$message({
                message: "修改成功",
                type: "success",
                duration: 1000,
              });
              this.reset();
              this.dialogVisible = false;
              this.getList();
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
