<template>
  <div id="main" style="width: 700px; height: 400px;"></div>
</template>

<script>
import * as echarts from "echarts/lib/echarts";
import "echarts/lib/chart/tree";
import { fetchList } from "@/api/dmsBacteria.js";
export default {
  name: "home",
  data() {
    return {
      data_data: {
        name: "所有科",
        category: "tree2",
        label: {
          normal: {
            show: true,
          },
        },
        itemStyle: {
          normal: {
            show: false,
            color: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                {
                  offset: 0,
                  color: "green", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              globalCoord: false, // 缺省为 false
            },
            borderColor: "blue",
            borderWidth: 2,
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowBlur: 10,
          },
          emphasis: {
            color: {
              type: "radial",
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                {
                  offset: 0,
                  color: "green", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              globalCoord: false, // 缺省为 false
            },
          },
        },
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        label: "1312",
                        value: 15,
                      },
                    ],
                    label: "你是谁啊",
                    value: 6,
                  },
                ],
                label: "1楼儿子2",
                value: 4,
              },
            ],
            label: "11111111楼",
            value: 1,
          },
          {
            children: [
              {
                label: "566666",
                value: 12,
              },
            ],
            label: "2楼",
            value: 2,
          },
          {
            children: [
              {
                label: "7567566765",
                value: 14,
              },
            ],
            label: "33333楼",
            value: 13,
          },
        ],
      },
    };
  },
  mounted() {
    this.listLoading = true;
    fetchList({
      pageNum: 1,
      pageSize: 5000,
    }).then((response) => {
      this.listLoading = false;
      this.data_data.children = this.generateOptions(response.data.list);
      var myChart = echarts.init(document.getElementById("main"));
      var option = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
        },
        series: [
          {
            type: "tree",
            initialTreeDepth: -1,
            data: [this.data_data],

            top: "1%",
            left: "7%",
            bottom: "1%",
            right: "20%",

            symbolSize: 10,

            label: {
              normal: {
                position: "left",
                verticalAlign: "middle",
                align: "right",
                color: "black",
              },
            },

            leaves: {
              label: {
                normal: {
                  position: "right",
                  verticalAlign: "middle",
                  align: "left",
                },
              },
              itemStyle: {
                normal: {
                  color: {
                    type: "radial",
                    x: 0.5,
                    y: 0.5,
                    r: 0.5,
                    colorStops: [
                      {
                        offset: 0,
                        color: "red", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "blue", // 100% 处的颜色
                      },
                    ],
                    globalCoord: false, // 缺省为 false
                  },
                },
              },
            },
          },
        ],
      };
      myChart.setOption(option);
    });
  },
  created() {
    console.log("created");
  },
  methods: {
    generateOptions(params) {
      var result = [];
      for (let param of params) {
        if (param.parentId == 0 || param.parentId == null) {
          var parent = {
            name: param.bacteriaName,
            value: param.id,
          };
          parent.children = this.getchilds(param.id, params); //获取子节点
          result.push(parent);
        }
      }
      return result;
    },

    getchilds(id, array) {
      let childs = new Array();
      for (let arr of array) {
        //循环获取子节点
        if (arr.parentId == id) {
          childs.push({
            name: arr.bacteriaName,
            value: arr.id,
          });
        }
      }
      for (let child of childs) {
        //获取子节点的子节点
        let childscopy = this.getchilds(child.value, array); //递归获取子节点
        if (childscopy.length > 0) {
          child.children = childscopy;
        }
      }
      return childs;
    },
  },
};
</script>

<style scoped>
.app-container {
  margin-top: 40px;
  margin-left: 120px;
  margin-right: 120px;
}
</style>
