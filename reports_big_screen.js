const { ref, onMounted, inject, onUnmounted } = Vue;

export default {
  setup() {
    let table1 = ref([]);
    let table2 = ref([]);
    let table3 = ref([]);
    let table_box1 = ref(null);
    let table_dom1 = ref(null);
    let table_box2 = ref(null);
    let table_dom2 = ref(null);
    let table_box3 = ref(null);
    let table_dom3 = ref(null);
    let chart_dom1 = ref(null);
    let chart_dom2 = ref(null);
    let chart_dom3 = ref(null);
    let chart_dom4 = ref(null);
    let chart_dom5 = ref(null);
    let chart_dom6 = ref(null);
    let interval_1 = null;
    let interval_2 = null;
    let interval_3 = null;
    let startIndex = 0;
    let endIndex = 4;
    let counter = 0;
    let timer = 1;
    let btn_word = ref("全屏");
    let utils = inject("utils");

    const refreshBigscreen = () => {
      axios.get("./big_screen_data.json").then((r) => {
        const json = r.data.data;
        table1.value = json.table1;
        table2.value = json.table2;
        table3.value = json.table3;

        const chart1 = echarts.init(chart_dom1.value);
        const chart2 = echarts.init(chart_dom2.value);
        const chart3 = echarts.init(chart_dom3.value);
        const chart4 = echarts.init(chart_dom4.value);
        const chart5 = echarts.init(chart_dom5.value);
        const chart6 = echarts.init(chart_dom6.value);

        window.addEventListener("resize", () => {
          chart1.resize();
          chart2.resize();
          chart3.resize();
          chart4.resize();
          chart5.resize();
          chart6.resize();
        });

        chart1.setOption(utils.getPieOption(json.chart1));
        chart2.setOption(utils.getPieOption(json.chart2));

        chart3.setOption({
          tooltip: utils.chartTooltip,
          grid: {
            top: "20%",
            left: "6%",
            right: "6%",
            bottom: "8%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: json.chart3.label,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: utils.bsWhite,
              },
            },
          },
          yAxis: {
            type: "value",
            splitLine: {
              lineStyle: {
                color: utils.barGrey,
              },
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: utils.bsWhite,
              },
              formatter: "{value} 个",
            },
          },
          series: [
            {
              type: "bar",
              barWidth: "50%",
              label: {
                show: true,
                position: "top",
                color: utils.bsWhite,
              },
              itemStyle: {
                normal: {
                  color: (item) => {
                    return utils.colors[item.dataIndex];
                  },
                },
              },
              data: json.chart3.value,
            },
          ],
        });

        const lineOption = {
          tooltip: utils.chartTooltip,
          grid: utils.chartGrid,
          xAxis: {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              textStyle: {
                color: utils.bsWhite,
              },
            },
          },
          dataZoom: [
            {
              startValue: 0,
              endValue: 0,
              type: "slider",
              show: false,
              xAxisIndex: [0],
            },
          ],
          yAxis: {
            type: "value",
            splitLine: {
              lineStyle: {
                color: utils.barGrey,
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: utils.bsWhite,
              },
              fontSize: 13,
              interval: 0,
              formatter: "",
            },
          },
          series: [
            {
              type: "line",
              showsymbol: false,
              lineStyle: {
                width: 2,
              },
              smooth: true,
              color: "",
              areaStyle: {},
              data: [],
            },
          ],
        };

        lineOption.dataZoom[0].startValue = startIndex;
        lineOption.dataZoom[0].endValue = endIndex;
        lineOption.xAxis.data = json.chart4.label;
        lineOption.series[0].data = json.chart4.value;
        lineOption.series[0].color = utils.GradientList[0];
        lineOption.series[0].areaStyle = utils.GradientList[1];
        lineOption.yAxis.axisLabel.formatter = "{value}个";
        chart4.setOption(lineOption);
        chartSwiper(chart4);

        lineOption.dataZoom[0].startValue = startIndex;
        lineOption.dataZoom[0].endValue = endIndex;
        lineOption.xAxis.data = json.chart5.label;
        lineOption.series[0].data = json.chart5.value;
        lineOption.series[0].color = utils.GradientList[2];
        lineOption.series[0].areaStyle = utils.GradientList[3];
        lineOption.yAxis.axisLabel.formatter = "{value}小时";
        lineOption.series[0].smooth = false;
        chart5.setOption(lineOption);
        chartSwiper(chart5);

        lineOption.dataZoom[0].startValue = startIndex;
        lineOption.dataZoom[0].endValue = endIndex;
        lineOption.xAxis.data = json.chart6.label;
        lineOption.series[0].data = json.chart6.value;
        lineOption.series[0].color = utils.GradientList[4];
        lineOption.series[0].areaStyle = utils.GradientList[5];
        chart6.setOption(lineOption);
        chartSwiper(chart6);
      });
    };

    //滚动函数
    const roll = (t) => {
      interval_2 = setInterval(rollStart, t);

      table_dom1.value.onmouseover = function () {
        clearInterval(interval_2);
      };

      table_dom1.value.onmouseout = function () {
        interval_2 = setInterval(rollStart, t);
      };

      table_dom2.value.onmouseover = function () {
        clearInterval(interval_2);
      };

      table_dom2.value.onmouseout = function () {
        interval_2 = setInterval(rollStart, t);
      };

      table_dom3.value.onmouseover = function () {
        clearInterval(interval_2);
      };

      table_dom3.value.onmouseout = function () {
        interval_2 = setInterval(rollStart, t);
      };
    };

    // 开始滚动函数
    const rollStart = () => {
      // 正常滚动不断给scrollTop的值+1,当滚动高度大于列表内容高度时恢复为0
      if (table_box1.value.scrollTop >= table_box1.value.scrollHeight / 2) {
        //注此处高度相当于为俩个tbody高度 需除2
        table_box1.value.scrollTop = 0;
      } else {
        table_box1.value.scrollTop++;
      }

      if (table_box2.value.scrollTop >= table_box2.value.scrollHeight / 2) {
        //注此处高度相当于为俩个tbody高度 需除2
        table_box2.value.scrollTop = 0;
      } else {
        table_box2.value.scrollTop++;
      }

      if (table_box3.value.scrollTop >= table_box3.value.scrollHeight / 2) {
        //注此处高度相当于为俩个tbody高度 需除2
        table_box3.value.scrollTop = 0;
      } else {
        table_box3.value.scrollTop++;
      }
    };

    const chartSwiper = (chart) => {
      if (interval_3) {
        clearInterval(interval_3);
      }
      // 设置定时器轮博图表数据
      interval_3 = setInterval(() => {
        if (endIndex == counter) {
          startIndex = 0;
          endIndex = 5;
        } else {
          startIndex++;
          endIndex++;
        }
        chart.setOption({
          dataZoom: [
            {
              startValue: startIndex,
              endValue: endIndex,
            },
          ],
        });
      }, 5000);
    };

    // toggle full screen
    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        btn_word.value = "退出全屏";
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          btn_word.value = "全屏";
        }
      }
    };

    onMounted(() => {
      // Set a interval refresh big screen every 60 seconds
      interval_1 = setInterval(() => {
        timer = timer - 1;
        if (timer === 0) {
          refreshBigscreen();
          timer = 60;
        }
      }, 1000);

      roll(70);
    });

    onUnmounted(() => {
      if (interval_1) {
        clearInterval(interval_1);
      }
      if (interval_2) {
        clearInterval(interval_2);
      }
      if (interval_3) {
        clearInterval(interval_3);
      }
    });

    return {
      table1,
      table2,
      table3,
      table_box1,
      table_dom1,
      table_box2,
      table_dom2,
      table_box3,
      table_dom3,
      chart_dom1,
      chart_dom2,
      chart_dom3,
      chart_dom4,
      chart_dom5,
      chart_dom6,
      btn_word,
      badge: utils.badge,
      dateFormat: utils.dateFormat,
      toggleFullScreen,
    };
  },
};
