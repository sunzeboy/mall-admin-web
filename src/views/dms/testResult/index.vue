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
              placeholder="属/属名称"
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
        <el-table-column label="测试源编号" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.resourceNo }}
          </template>
        </el-table-column>
        <el-table-column label="菌类-中文名称" width="300" align="center">
          <template slot-scope="scope">
            {{ scope.row.bacteriaNameZh }}
          </template>
        </el-table-column>
        <el-table-column label="丰度(%)" width="100" align="center">
          <template slot-scope="scope">
            {{ scope.row.contentWeight }}
          </template>
        </el-table-column>
        <el-table-column label="疾病名称" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.diseaseNameZh }}
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
      <el-form ref="shu" :model="sel_result" :rules="rules" label-width="120px">
        <el-form-item label="测试源编号">
          <el-select
            :value="sel_resource.resourceNo"
            placeholder="请选择测试源编号"
            @change="selectedResource"
          >
            <el-option
              v-for="(item, index) in resourceList"
              :key="index"
              :label="item.resourceNo"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菌类-中文名称">
          <el-select
            :value="sel_bacteria.bacteriaNameZh"
            placeholder="请选择菌类-中文名称"
            @change="selectedBacteria"
          >
            <el-option
              v-for="(item, index) in bacteriaList"
              :key="index"
              :label="item.bacteriaNameZh"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="丰度（%）" prop="contentWeight">
          <el-input
            v-model="sel_result.contentWeight"
            auto-complete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="疾病名称">
          <el-select
            :value="sel_disease.diseaseNameZh"
            placeholder="请选择疾病名称"
            @change="selectedDisease"
          >
            <el-option
              v-for="(item, index) in diseaseList"
              :key="index"
              :label="item.diseaseNameZh"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('shu')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  createExperimentalResult,
  listAllExperimentalResults,
  updateExperimentalResult,
  deleteExperimentalResult,
  listAllExperimentalResources,
  fetchList,
  fetchDiseaseList,
} from "@/api/dmsBacteria.js";
const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
};
export default {
  name: "shu",
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
      },
      dialogVisible: false,
      dialogTitle: "",
      sel_result: {},
      resourceList: null,
      sel_resource: {},
      sel_disease: {},
      diseaseList: null,
      sel_bacteria: {},
      bacteriaList: null,
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
    selectedResource(e) {
      this.sel_resource = e;
      this.sel_result.resourceId = e.id;
    },
    selectedBacteria(e){
      this.sel_bacteria = e;
      this.sel_result.bacteriaId = e.id;
    },
    selectedDisease(e){
      this.sel_disease = e;
      this.sel_result.diseaseId = e.id;
    },
    indexFunc(index) {
      return index + 1;
    },
    getList() {
      this.listLoading = true;
      listAllExperimentalResults(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });

      fetchList({
        pageNum: 1,
        pageSize: 500,
      }).then((response) => {
        this.listLoading = false;
        this.bacteriaList = response.data.list;
      });

      listAllExperimentalResources({
        pageNum: 1,
        pageSize: 500,
      }).then((response) => {
        this.listLoading = false;
        this.resourceList = response.data.list;
      });

      fetchDiseaseList({
        pageNum: 1,
        pageSize: 500,
      }).then((response) => {
        this.listLoading = false;
        this.diseaseList = response.data.list;
      });

    },
    reset() {
      this.sel_result = {};
      this.sel_bacteria = {};
      this.sel_resource = {};
      this.sel_disease = {};
    },
    add() {
      this.reset();
      this.dialogVisible = true;
      this.dialogTitle = "添加测试数据";
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
      this.$confirm("是否要删除该属", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteExperimentalResult(row.id).then((response) => {
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
      this.dialogTitle = "编辑测试数据";
      this.sel_result = row;
      this.sel_resource.id = row.resourceId;
      this.sel_resource.resourceNo = row.resourceNo;
      this.sel_disease.id = row.diseaseId;
      this.sel_disease.diseaseNameZh = row.diseaseNameZh;
      this.sel_bacteria.id = row.bacteriaId;
      this.sel_bacteria.bacteriaNameZh = row.bacteriaNameZh;
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === "添加测试数据") {
            console.log(this.sel_result);
            
              createExperimentalResult(this.sel_result).then((response) => {
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
            updateExperimentalResult(this.sel_result).then((response) => {
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
