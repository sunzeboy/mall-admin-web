<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button class="btn-add" @click="addKe()" size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productAttrCateTable" style="width: 100%" :data="list"  v-loading="listLoading" border>
        <el-table-column label="编号" type="index" :index='indexFunc' width="100" align="center">
          <!-- <template slot-scope="scope">{{index}}
</template> -->
        </el-table-column>
        <el-table-column label="科-名称" width="200" align="center">
<template slot-scope="scope">
   {{scope.row.keName}}
</template>
        </el-table-column>
        <el-table-column label="科-中文名称" width="300" align="center">
<template slot-scope="scope">
   {{scope.row.keNameZh}}
</template>
        </el-table-column>
        <!-- <el-table-column label="参数数量" width="200" align="center">
<template slot-scope="scope">
   {{scope.row.paramCount==null?0:scope.row.paramCount}}
</template>
        </el-table-column>
        <el-table-column label="设置" width="200" align="center">
<template slot-scope="scope">
  <el-button size="mini" @click="getAttrList(scope.$index, scope.row)">
    属性列表
  </el-button>
  <el-button size="mini" @click="getParamList(scope.$index, scope.row)">参数列表
  </el-button>
</template>
        </el-table-column> -->
        <el-table-column label="操作" width="200" align="center">
<template slot-scope="scope">
  <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">
    编辑
  </el-button>
  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
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
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form ref="ke"  :model="ke" :rules="rules" label-width="120px">
        <el-form-item label="科-名称" prop="keName">
          <el-input v-model="ke.keName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="ke" :model="ke" :rules="rules" label-width="120px">
        <el-form-item label="科-中文名称" prop="keNameZh">
          <el-input v-model="ke.keNameZh" auto-complete="off"></el-input>
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
    createKe,
    updateKe,
    deleteKe
  } from '@/api/dmsBacteria.js'
  export default {
    name: 'ke',
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
        dialogTitle: '',
        ke: {
          keName: '',
          keNameZh: '',
          muId: 1,
        },
        rules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      indexFunc(index){
        return index+1;
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data;
          this.total = response.data.length;
        });
      },
      resetKe(){
        this.ke = {
          keName: '',
          keNameZh: '',
          muId: 1,
        }
      },
      addKe() {
        this.resetKe();
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
        this.$confirm('是否要删除该科', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteKe(row).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.resetKe();
            this.getList();
          });
        });
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.dialogTitle = "编辑科";
        this.ke.keName = row.keName;
        this.ke.keNameZh = row.keNameZh;
        this.ke.id = this.list[index].id
      },
      getAttrList(index, row) {
        this.$router.push({
          path: '/pms/productAttrList',
          query: {
            cid: row.id,
            cname: row.name,
            type: 0
          }
        })
      },
      getParamList(index, row) {
        this.$router.push({
          path: '/pms/productAttrList',
          query: {
            cid: row.id,
            cname: row.name,
            type: 1
          }
        })
      },
      handleConfirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // let data = new URLSearchParams();
            // data.append("name",this.productAttrCate.name);
            debugger;
            if (this.dialogTitle === "添加科") {
              this.ke.muId = 1;
              createKe(this.ke).then(response => {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 1000
                });
                this.resetKe();
                this.dialogVisible = false;
                this.getList();
              });
            } else {
              updateKe(this.ke).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                this.resetKe();
                this.dialogVisible = false;
                this.getList();
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>


