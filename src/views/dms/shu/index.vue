<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="addShu()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="productAttrCateTable"
        style="width: 100%"
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
        <el-table-column label="属-名称" width="200" align="center">
          <template slot-scope="scope">
            {{ scope.row.genusName }}
          </template>
        </el-table-column>
        <el-table-column label="属-中文名称" width="300" align="center">
          <template slot-scope="scope">
            {{ scope.row.genusNameZh }}
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
      <el-form ref="shu" :model="shu" :rules="rules" label-width="120px">
        <el-form-item label="属-名称" prop="genusName">
          <el-input v-model="shu.genusName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="属-中文名称" prop="genusNameZh">
          <el-input v-model="shu.genusNameZh" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="上级-科">
          <el-select :value="superior.keNameZh" placeholder="请选所属-科" @change="selectedSuperior">
            <el-option v-for="(item, index) in superiorList" :key="index" :label="item.keNameZh" :value="item"></el-option>
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
  fetchShuList,
  fetchList,
  createShu,
  updateShu,
  deleteShu
} from "@/api/dmsBacteria.js";
export default {
  name: "shu",
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5
      },
      dialogVisible: false,
      dialogTitle: "",
      shu: {
        id:'',
        genusName: "",
        genusNameZh: "",
        keId: 0
      },
      superiorList:null,
      superior:{
        keName: "",
        keNameZh: "",
        keId: 1
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    selectedSuperior(e){
      this.superior.id = e.id;
      this.superior.keName = e.keName;
      this.superior.keNameZh = e.keNameZh;
    },
    indexFunc(index) {
      return index + 1;
    },
    getList() {
      this.listLoading = true;
      fetchShuList().then(response => {
        this.listLoading = false;
        this.list = response.data;
        this.total = response.data.length;
      });
      fetchList().then(response => {
        this.listLoading = false;
        this.superiorList = response.data;
      });
    },
    resetShu() {
      this.shu = {
        id:0,
        genusName: "",
        genusNameZh: "",
        keId: 0
      };
    },
    addShu() {
      this.resetShu();
      this.dialogVisible = true;
      this.dialogTitle = "添加属";
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
        type: "warning"
      }).then(() => {
        deleteShu(row).then(response => {
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 1000
          });
          this.resetShu();
          this.getList();
        });
      });
    },
    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.dialogTitle = "编辑属";
      this.shu.genusName = row.genusName;
      this.shu.genusNameZh = row.genusNameZh;
      this.shu.id = this.list[index].id;
    },
    getAttrList(index, row) {
      this.$router.push({
        path: "/pms/productAttrList",
        query: {
          cid: row.id,
          cname: row.name,
          type: 0
        }
      });
    },
    getParamList(index, row) {
      this.$router.push({
        path: "/pms/productAttrList",
        query: {
          cid: row.id,
          cname: row.name,
          type: 1
        }
      });
    },
    handleConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // let data = new URLSearchParams();
          // data.append("name",this.productAttrCate.name);
          if (this.dialogTitle === "添加属") {
            console.log(this.superior.id);
            this.shu.keId = this.superior.id;
            console.log(this.shu);
            createShu(this.shu).then(response => {
              this.$message({
                message: "添加成功",
                type: "success",
                duration: 1000
              });
              this.resetShu();
              this.dialogVisible = false;
              this.getList();
            });
          } else {
            updateShu(this.shu).then(response => {
              this.$message({
                message: "修改成功",
                type: "success",
                duration: 1000
              });
              this.resetshu();
              this.dialogVisible = false;
              this.getList();
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped></style>
