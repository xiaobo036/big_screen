class BigScreenUtil {
  GradientList = [
    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: "#72E7FF",
      },
      {
        offset: 0.5,
        color: "#54F8BD",
      },
      {
        offset: 1,
        color: "#059A67",
      },
    ]),
    new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 1,
        color: "rgba(19,255,231,0.5)",
      },
      {
        offset: 0,
        color: "rgba(17,70,139,0)",
      },
    ]),

    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: "#FFD69C",
      },
      {
        offset: 0.5,
        color: "#FFB092",
      },
      {
        offset: 1,
        color: "#FA6D6D",
      },
    ]),

    new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 1,
        color: "rgba(19,255,231,0.5)",
      },
      {
        offset: 0,
        color: "rgba(17,70,139,0)",
      },
    ]),

    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      {
        offset: 0,
        color: "#43E6BA",
      },
      {
        offset: 0.5,
        color: "#70C8A7",
      },
      {
        offset: 1,
        color: "#F8CD40",
      },
    ]),
    new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 1,
        color: "rgba(19,255,231,0.5)",
      },
      {
        offset: 0,
        color: "rgba(17,70,139,0)",
      },
    ]),
  ];

  bsWhite = "#deecff";
  bsYellow = "#F8C207";
  bsRed = "#EE4C4E";
  bsBlue = "#1745d4";
  bsGreen = "#6ebf4a";
  bsPurple = "#a23aca";
  bsNav = "#1a3451";
  bsBrown = "#6b6036";
  barGrey = "#616770";

  colors = [
    this.bsYellow,
    this.bsRed,
    this.bsBlue,
    this.bsGreen,
    this.bsPurple,
    this.bsNav,
    this.bsBrown,
  ];

  chartGrid = {
    top: "10%",
    left: "6%",
    right: "6%",
    bottom: "8%",
    containLabel: true,
  };

  chartTooltip = {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  };

  getPieOption = (pieData) => {
    let series = [];
    let sumValue = 0;
    let startValue = 0;
    let endValue = 0;
    let k = 1;
    pieData.sort((a, b) => {
      return b.value - a.value;
    });

    // 为每一个饼图数据，生成一个series-surface
    for (let i = 0; i < pieData.length; i++) {
      sumValue += pieData[i].value;
      let seriesItem = {
        name:
          typeof pieData[i].name === undefined ? `series${i}` : pieData[i].name,
        type: "surface",
        parametric: true,
        wireframe: {
          show: false,
        },
        pieData: pieData[i],
      };
      if (typeof pieData[i].itemStyle === undefined) {
        let itemStyle = {};
        if (typeof pieData[i].itemStyle.color !== undefined) {
          itemStyle.color = pieData[i].itemStyle.color;
        } else {
          itemStyle.color = null;
        }

        if (typeof pieData[i].itemStyle.opacity !== undefined) {
          itemStyle.opacity = pieData[i].itemStyle.opacity;
        } else {
          itemStyle.opacity = null;
        }

        seriesItem.itemStyle = itemStyle;
      }
      series.push(seriesItem);
    }

    // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    for (let item of series) {
      endValue = startValue + item.pieData.value;
      item.pieData.startRatio = startValue / sumValue;
      item.pieData.endRatio = endValue / sumValue;
      item.parametricEquation = this.getParametricEquation(
        item.pieData.startRatio,
        item.pieData.endRatio,
        false,
        false,
        k,
        item.pieData.value
      );
      startValue = endValue;
    }

    // 准备好对应的配置项，将准备好的 series传入
    return {
      legend: {
        icon: "arrow",
        textStyle: {
          fontSize: 15,
          color: this.bsWhite,
        },
        formatter: (name) => {
          let total = 0;
          let tarValue;
          for (let item of pieData) {
            total += item.value;
            if (item.name === name) {
              tarValue = item.value;
            }
          }
          const v = tarValue;
          const p = Math.round((tarValue / total) * 100) + "%";
          return `${name} ${p} ${v}`;
        },
      },
      color: this.colors,
      xAxis3D: {
        min: -1,
        max: 1,
      },
      yAxis3D: {
        min: -1,
        max: 1,
      },
      zAxis3D: {
        min: -1,
        max: 1,
      },
      grid3D: {
        show: false,
        boxHeight: 2,
        left: 0,
        top: 0,
        viewControl: {
          alpha: 40, //角度
          distance: 300, //调整视角到主体的距离，类似调整zoom
          rotateSensitivity: 0, //设置为0无法旋转
          zoomSensitivity: 0, //设置为0无法缩放
          panSensitivity: 0, //设置为0无法平移
          autoRotate: true, //自动旋转
        },
      },
      series: series,
    };
  };

  getParametricEquation = (
    startRatio,
    endRatio,
    isSelected,
    isHovered,
    k,
    h
  ) => {
    // 计算
    let midRatio = (startRatio + endRatio) / 2;
    let startRadian = startRatio * Math.PI * 2;
    let endRadian = endRatio * Math.PI * 2;
    let midRadian = midRatio * Math.PI * 2;

    if (startRatio === 0 && endRatio === 1) {
      isSelected = true;
    }
    k = typeof k !== "undefined" ? k : 1 / 3;
    let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
    let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
    let hoverRate = isHovered ? 1.05 : 1;
    return {
      u: {
        min: -Math.PI,
        max: Math.PI * 3,
        step: Math.PI / 32,
      },
      v: {
        min: 0,
        max: Math.PI * 2,
        step: Math.PI / 20,
      },
      x: function (u, v) {
        if (u < startRadian) {
          return (
            offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
          );
        }
        if (u > endRadian) {
          return (
            offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
          );
        }
        return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
      },
      y: function (u, v) {
        if (u < startRadian) {
          return (
            offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
          );
        }
        if (u > endRadian) {
          return (
            offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
          );
        }
        return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
      },
      z: function (u, v) {
        if (u < -Math.PI * 0.5) {
          return Math.sin(u);
        }
        if (u > Math.PI * 2.5) {
          return Math.sin(u) * h * 0.1;
        }
        return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
      },
    };
  };

  // date format
  dateFormat = (dateTime) => {
    if (dateTime == null || dateTime == "0000-00-00 00:00:00") {
      return "";
    }
    return dayjs(dateTime).format("YYYY-MM-DD HH:mm");
  };

  badge = (status) => {
    let arr_status = [
      "0. 已创建",
      "1. 等待备件",
      "2. 等待外委",
      "3. 已安排",
      "4. 已搁置",
      "5. 进行中",
      "6. 已完成",
      "7. 已确认",
    ];

    let arr_class = [
      "badge-secondary",
      "badge-danger",
      "badge-danger",
      "badge-info",
      "badge-warning",
      "badge-primary",
      "badge-success",
      "badge-success",
    ];

    if (arr_status[status] === undefined) {
      // prettier-ignore
      return '<span class="badge badge-pill badge-danger">' + status + '</span>';
    }
    // prettier-ignore
    return '<span class="badge badge-pill '+arr_class[status]+'">'+arr_status[status]+'</span>';
  };
}

export default BigScreenUtil;
