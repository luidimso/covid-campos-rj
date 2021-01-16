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
  selector: 'app-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss']
})
export class ColumnChartComponent implements OnInit {

  @Input() dataset:any[];
  @Input() datasetAverage:any[];
  @Input() chartTitle:string;
  @Input() chartColor:string
  @Input() index:number;
  options: any;
  chart:any;

  constructor() { }

  ngOnInit(): void {
    document.getElementById("column-chart").setAttribute('id', 'column-chart'+this.index);
    this.buildLineChart();
  }

  buildLineChart(){
    let data = [];
    let average = [];

    for(let d of this.dataset){
      data.push({
        y: Number(d.total),
        name: d.date
      });
    }

    for(let d of this.datasetAverage){
      average.push({
        y: d.total,
        name: d.date
      });
    }

    this.options = {
      chart: {
          type: 'column'
      },
      title: {
          text: ''
      },
      subtitle: {
        text: this.chartTitle
      },
      accessibility: {
          announceNewData: {
              enabled: true
          }
      },
      xAxis: {
          type: 'category',
          labels:{
            rotation: 270,
            y: 10
         }
      },
      yAxis: {
          title: {
              text: ''
          },
          visible: true,
          min: 0
      },
      legend: {
          enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: false,
                  format: '{point.y}'
              },
              pointPadding: 0,
              groupPadding: 0,
          }
      },
      series: [
        {
            name: "Total",
            colorByPoint: true,
            data: data
        },
        {
            name: 'Media móvel',
            type: 'spline',
            data: average,
            color: '#0d0d0d'
        }
    ],
    tooltip: {
      enabled: true
    },
    colors: [this.chartColor]
    }
    this.chart = Highcharts.chart('column-chart'+this.index, this.options);
  }
}
