import { formatNumber } from '@angular/common';
import { BilingualText } from '../models';

export const customTooltip = {
  custom: function (tooltip) {
    const tooltipEl = document.getElementById('chartjs-tooltip');

    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0';
      return;
    }

    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltip.yAlign) {
      tooltipEl.classList.add(tooltip.yAlign);
    } else {
      tooltipEl.classList.add('no-transform');
    }
    function getBody(bodyItem) {
      return bodyItem.lines;
    }
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map(getBody);
      let innerHtml = '<thead>';
      titleLines.forEach(function (title) {
        innerHtml += '<tr><th>' + title + '</th></tr>';
      });
      innerHtml += '</thead><tbody>';
      bodyLines.forEach(function (body, i) {
        const colors = tooltip.labelColors[i];
        let style = 'background:' + colors.backgroundColor;
        style += '; border-color:' + colors.borderColor;
        style += '; border-width: 2px';
        const span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
        innerHtml += '<tr><td>' + span + body + '</td></tr>';
      });
      innerHtml += '</tbody>';
      const tableRoot = tooltipEl.querySelector('table');
      tableRoot.innerHTML = innerHtml;
    }
    const positionY = this._chart.canvas.offsetTop;
    const positionX = this._chart.canvas.offsetLeft;
    tooltipEl.style.opacity = '1';
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
    tooltipEl.style.fontSize = tooltip.bodyFontSize;
    tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
    tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
  },
  enabled: false
};

export function getChartPlugin(centerText: string, font: string, isDecimalPoint = true) {
  return {
    beforeInit: getBeforeInitPlugin(),
    resize: getResizePlugin(),
    afterDraw: function (chart) {
      const dataSets = [];
      dataSets.push(chart.data.datasets[0].data);
      const totalAmount = dataSets[0].reduce((a, b) => a + b, 0);
      const width = chart.width,
        height = chart.height,
        ctx = chart.ctx;
      ctx.restore();
      const fontSize = (height / 160).toFixed(2);
      ctx.font = fontSize + 'em ' + font;
      ctx.textBaseline = 'middle';
      let text = isDecimalPoint ? formatNumber(totalAmount, 'en-US', '1.2-2') : totalAmount,
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = centerText ? height / 2.1 : height / 1.9;

      ctx.fillText(text, textX, textY);
      if (centerText) {
        (text = centerText), (textX = Math.round((width - ctx.measureText(text).width) / 2)), (textY = height / 1.7);
        ctx.fillText(text, textX, textY);
      }
      ctx.save();
    }
  };
}

export function getChartOptions(chartLegend, currency: BilingualText, lang, isToolTip = true) {
  return {
    legend: {
      display: false,
      labels: {
        filter: function (item) {
          return chartLegend.indexOf(item.text) > -1;
        }
      },
      position: 'bottom',
      onClick: null
    },
    tooltips: !isToolTip
      ? { enabled: false }
      : {
          enabled: true,
          displayColors: true,
          backgroundColor: 'rgba(0, 0, 0)',
          callbacks: {
            label: function (tooltipItem, data) {
              let label = data.labels[tooltipItem.index] || '';
              if (label) {
                label += ': ';
              }
              if (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]) {
                label += formatNumber(
                  data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index],
                  'en-US',
                  '1.2-2'
                );
                label += ' ' + (lang === 'en' ? currency?.english : currency?.arabic);
              }
              return label;
            }
          }
        },
    maintainAspectRatio: false,
    responsive: true,
    cutoutPercentage: 60,
    series: [{ center: ['60%', '50%'] }]
  };
}

export function getBeforeInitPlugin() {
  return function (chart) {
    const dpr = window.devicePixelRatio || 1;
    if (dpr > 0.75 && dpr < 2) {
      const properHeight = dpr * 100 + 100;
      chart.canvas.setAttribute('style', 'display:block; width:auto; height:' + Math.floor(properHeight) / 14 + 'rem;');
    }
  };
}

export function getResizePlugin() {
  return function (chart) {
    const dpr = window.devicePixelRatio || 1;
    if (dpr > 0.75 && dpr < 2) {
      const properHeight = dpr * 100 + 100;
      chart.canvas.setAttribute('style', 'display:block; width:auto; height:' + Math.floor(properHeight) / 14 + 'rem;');
    }
  };
}

export function getOtherChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 15,
        fontSize: 10
      }
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            display: true,
            borderDash: [5, 5],
            zeroLineBorderDash: [5, 5],
            drawBorder: false
          }
        }
      ],
      xAxes: [
        {
          gridLines: {
            display: false
          },
          maxBarThickness: 56,
          categoryPercentage: 0.6,
          barPercentage: 0.8
        }
      ]
    }
  };
}
