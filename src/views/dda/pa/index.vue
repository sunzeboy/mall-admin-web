<template>
  <div class="app-container">
    <el-card class="pb0">
      <el-form ref="canForm" :inline="true" class="tpl-form-inline pb0">
        <el-row type="flex" justify="start">
          <el-form-item label="研究对象编号">
            <el-select
              :value="sel_resource.resourceNo"
              placeholder="请选择"
              @change="handlePaNoChange"
            >
              <el-option
                v-for="(item, index) in paList"
                :key="index"
                :label="item.resourceNo"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间：">
            <el-date-picker
              style="float: right; z-index: 1; width: 370px;"
              v-model="orderCountDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateChange"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item class="">
            <el-button type="primary" @click="queryAct" plain>查询</el-button>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="start">
          <div v-for="(item, index) in jun_list" :key="index">
            <el-form-item class="">
              <el-autocomplete
                style="width: 100px;"
                v-model="item.bacteriaNameZh"
                :fetch-suggestions="querySearchJunAsync"
                placeholder="请选择菌类"
                @select="handleSelectJun($event, index)"
              ></el-autocomplete>
            </el-form-item>
          </div>

          <el-form-item class="">
            <el-button type="primary" @click="addJun" plain>新增菌类</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>

    <div class="statistics-layout">
      <div class="layout-title">占比分析</div>
      <el-row>
        <div id="echarts" :style="{ width: '900px', height: '300px' }"></div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { str2Date } from "@/utils/date";
import echarts from "echarts";
import {
  listAllExperimentalResources,
  fetchList,
  listPa,
} from "@/api/dmsBacteria.js";

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  bacteriaType: 1,
};

export default {
  name: "pa",
  data() {
    return {
      startEndDateTime: [],
      jun_list: [],
      listQuery: {
        pageNum: 1,
        pageSize: 5,
      },
      paList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一月",
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      sel_resource: {},
      loading: false,
      option: {
        title: {
          text: "占比分析",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: [],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "time",
        },
        yAxis: {
          type: "value",
        },
        series: [],
      },
      myChart: null,
    };
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("echarts"));
    this.myChart.setOption(this.option);
  },
  created() {
    this.fetchAllExperimentalResources();
    this.initOrderCountDate();
  },
  methods: {
    addJun() {
      this.jun_list.push({
        id: -1,
        bacteriaNameZh: "",
        bacteriaName: "",
        bacteriaType: 0,
        parentId: 0,
        value: 0,
      });
    },
    handleSelectJun($event, index) {
      this.jun_list[index] = $event;
    },
    querySearchJunAsync(queryString, cb) {
      this.loading = true;
      fetchList({
        keyword: queryString,
        pageNum: 1,
        pageSize: 500,
      }).then((response) => {
        this.loading = false;
        for (let i = 0; i < response.data.list.length; i++) {
          const element = response.data.list[i];
          element.value = element.bacteriaNameZh;
        }
        cb(response.data.list);
      });
    },
    queryAct() {
      this.option.series = [];
      this.option.legend.data = [];
      let delt = 0;
      
      this.jun_list.forEach((element) => {
        if (element.id === -1) {
        } else {
          listPa({
            resourceId: this.sel_resource.id,
            bacteriaId: element.id,
            startDate: this.orderCountDate[0],
            endDate: this.orderCountDate[1],
          }).then((response) => {
            delt++;
            if (response.data.length > 0) {
              let arr = [];
              response.data.forEach((element) => {
                arr.push([element.testTime, element.contentWeight]);
              });
              this.option.legend.data.push(element.bacteriaNameZh);
              this.option.series.push({
                name: element.bacteriaNameZh,
                type: "line",
                stack: "总量",
                data: arr,
              });
            }
            if (delt === this.jun_list.length) {
              this.myChart.setOption(this.option);
            }
          });
        }
      });
    },
    fetchAllExperimentalResources() {
      this.loading = true;
      listAllExperimentalResources(this.listQuery).then((response) => {
        this.loading = false;
        this.paList = response.data.list;
      });
    },
    handlePaNoChange(e) {
      this.sel_resource = e;
    },
    handleDateChange(e) {
      // console.log(this.orderCountDate);
      // this.orderCountDate = e;
    },
    initOrderCountDate() {
      let start = new Date();
      const end = new Date();
      end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
      this.orderCountDate = [start, end];
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pb0 {
  padding-bottom: 0;
}
.tpl-form-inline {
}

.statistics-layout {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}
.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #f2f6fc;
  font-weight: bold;
}
</style>
