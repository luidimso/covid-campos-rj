import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @Input() dataset:any[];
  @Input() chartTitle:string;
  @Input() chartColor:string
  @Input() index:number;
  options: any;
  chart:any;

  constructor() { }

  ngOnInit(): void {
    document.getElementById("line-chart").setAttribute('id', 'line-chart'+this.index);
    this.buildLineChart();
  }

  buildLineChart(){
    let labels = [];
    let data = [];

    for(let d of this.dataset){
      labels.push(d.date);
      data.push({
        y: Number(d.total),
        date: d.date
      });
    }

    this.options = {
      chart: {
        zoomType: 'x'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: this.chartTitle
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: labels,
        labels:{
          rotation: 270,
          y: 10
        }
      },
      yAxis: {
        gridLineWidth: 0,
        title: {
          text: ''
        }
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, this.chartColor],
              [1, Highcharts.color(this.chartColor).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 1
          },
          lineWidth: 2,
          states: {
            hover: {
              lineWidth: 2
            }
          },
          threshold: null
        }
      },
      series: [{
        name: 'Total',
        data: data,
        type : "area"
      }],
      tooltip: {
        formatter: function() {
          return '<b>'+this.point.date+'</b><br>Total: '+this.point.y;
        }
      },
    }
    this.chart = Highcharts.chart('line-chart'+this.index, this.options);
  }
}
