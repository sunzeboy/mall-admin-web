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
              placeholder="菌群对象/代谢产物"
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
        <el-table-column label="菌群对象" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.bacteriaNameZh }}
          </template>
        </el-table-column>
        <el-table-column label="代谢产物" width="300" align="center">
          <template slot-scope="scope">
            {{ scope.row.productsNameZh }}
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
        ref="productsRelations"
        :model="sel_jun"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="菌群">
          <el-autocomplete
            v-model="sel_jun.bacteriaNameZh"
            :fetch-suggestions="querySearchJunAsync"
            placeholder="菌群"
            @select="handleSelectJun"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="代谢产物-中文名称">
          <el-autocomplete
            v-model="sel_product.productsNameZh"
            :fetch-suggestions="querySearchProductAsync"
            placeholder="代谢产物-中文名称"
            @select="handleSelectProduct"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm('productsRelations')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  fetchProductsList,
  fetchProductsRelationsList,
  createProductsRelations,
  updateProductsRelations,
  deleteProductsRelations,
} from "@/api/dmsBacteria.js";
const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
};
export default {
  name: "productsRelations",
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
      superiorList: null,
      superior: {},
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
      },
      sel_jun: {},
      sel_product: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    querySearchJunAsync(queryString, cb) {
      fetchList({
        keyword: queryString,
        pageNum: 1,
        pageSize: 50,
      }).then((response) => {
        for (let i = 0; i < response.data.list.length; i++) {
          const element = response.data.list[i];
          element.value = element.bacteriaNameZh;
        }
        cb(response.data.list);
      });
    },
    querySearchProductAsync(queryString, cb) {
      fetchProductsList({
        keyword: queryString,
        pageNum: 1,
        pageSize: 50,
      }).then((response) => {
        for (let i = 0; i < response.data.list.length; i++) {
          const element = response.data.list[i];
          element.value = element.productsNameZh;
        }
        cb(response.data.list);
      });
    },
    handleSelectJun(item) {
      this.sel_jun = item;
    },
    handleSelectProduct(item) {
      this.sel_product = JSON.parse(JSON.stringify(item));
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.getList();
    },
    selectedSuperior(e) {
      this.superior.id = e.id;
      this.superior.speciesName = e.speciesName;
      this.superior.speciesNameZh = e.speciesNameZh;
    },
    indexFunc(index) {
      return index + 1;
    },
    getList() {
      this.listLoading = true;

      fetchProductsRelationsList(this.listQuery).then((response) => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });

    },
    reset() {
      this.sel_jun = {};
      this.sel_product = {};
    },
    add() {
      this.reset();
      this.dialogVisible = true;
      this.dialogTitle = "添加关系";
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
      this.$confirm("是否要删除该关系", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteProductsRelations({
          strainId: row.strain_id,
          productsId: row.products_id,
        }).then((response) => {
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
      this.dialogTitle = "编辑菌株";
      this.sel_product.id = row.productsId;
      this.sel_product.productsNameZh = row.productsNameZh;
      this.sel_jun.id = row.bacteriaId;
      this.sel_jun.bacteriaNameZh = row.bacteriaNameZh;
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.dialogTitle === "添加关系") {
            createProductsRelations({
              bacteriaId: this.sel_jun.id,
              productsId: this.sel_product.id,
            }).then((response) => {
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
            updateStrain({
              message: "添加成功",
              type: "success",
              duration: 1000,
            }).then((response) => {
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
