import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  casesDataset:any[] = [];
  deathDataset:any[] = [];

  casesByDayDataset:any[] = [];
  deathByDayDataset:any[] = [];

  casesAverageDataset:any[] = [];
  deathAverageDataset:any[] = [];

  aux = {
    cases: [],
    death: [],
    casesByDay: [],
    deathByDay: [],
    casesAverage: [],
    deathAverage: []
  };

  ready:boolean = false;
  filterWeeks:number = 0;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get('https://raw.githubusercontent.com/Lucas12j/Casos_Covid_Campos_dos_Goytacazes/master/Casos_Campos.csv', {responseType: 'text'})
    .subscribe(
        data => {
          this.csvToJson(data);
        },
        error => {
            console.log(error);
        }
    );
  }



  csvToJson(dataset:string) {
    var lines = dataset.split("\n");
    var result = [];
    var headers = lines[0].split(",");

    for(var i = 1; i < lines.length; i++){
      var obj = {};
      var currentline = lines[i].split(",");

      for(var j=0; j<headers.length;j++){
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    console.log(result);
    this.buildCasesDataset(result);
    this.buildDeathDataset(result);
    this.buildCasesByDayDataset(result);
    this.buildDeathByDayDataset(result);
    this.ready = true;
  }



  buildCasesDataset(data:any[]) {
    let dataset = [];
    for(let d of data) {
      dataset.push({date: d["Data"], total: d["Casos Confirmados"]});
    }
    this.casesDataset = dataset;
    this.aux.cases = this.casesDataset;
  }




  buildDeathDataset(data:any[]) {
    let dataset = [];
    for(let d of data) {
      dataset.push({date: d["Data"], total: d["Obito"]});
    }
    this.deathDataset = dataset;
    this.aux.death = this.deathDataset;
  }




  buildCasesByDayDataset(data:any[]) {
    let dataset = [];
    for(let i=1; i<data.length; i++) {
      if(data[i]["Data"]) {
        dataset.push(
          {
            date: data[i]["Data"],
            total: Number(data[i]["Casos Confirmados"]) - Number(data[i-1]["Casos Confirmados"])
          }
        );
      }
    }
    this.casesByDayDataset = dataset;
    this.aux.casesByDay = this.casesByDayDataset;

    dataset = [];
    for(let i=0; i<this.casesByDayDataset.length; i++) {
      dataset.push(
        {
          date: this.casesByDayDataset[i].date,
          total: this.calcAverage(this.casesByDayDataset, i)
        }
      );
    }
    this.casesAverageDataset = dataset;
    this.aux.casesAverage = this.casesAverageDataset;
  }




  buildDeathByDayDataset(data:any[]) {
    let dataset = [];
    for(let i=1; i<data.length; i++) {
      dataset.push(
        {
          date: data[i]["Data"],
          total: Number(data[i]["Obito"]) - Number(data[i-1]["Obito"])
        }
      );
    }
    this.deathByDayDataset = dataset;
    this.aux.deathByDay = this.deathByDayDataset;

    dataset = [];
    for(let i=0; i<this.deathByDayDataset.length; i++) {
      dataset.push(
        {
          date: this.deathByDayDataset[i].date,
          total: this.calcAverage(this.deathByDayDataset, i)
        }
      );
    }
    this.deathAverageDataset = dataset;
    this.aux.deathAverage = this.deathAverageDataset;
  }




  calcAverage(dataset:any[], index:number) {
    let average = 0;
    let sum = dataset[index].total;
    let totalSum = 1;

    for(let j=1; j<7; j++) {
      if(index-j < 0) {
        j = 7;
      } else {
        sum += dataset[index-j].total;
        totalSum++;
      }
    }

    return average = sum/totalSum;
  }


  updateFilter(weeks:number) {
    this.filterWeeks = weeks;
    this.ready = false;

    if(this.filterWeeks == 0) {
      this.casesDataset = this.aux.cases;
      this.deathDataset = this.aux.death;
      this.casesByDayDataset = this.aux.casesByDay;
      this.deathByDayDataset = this.aux.deathByDay;
      this.casesAverageDataset = this.aux.casesAverage;
      this.deathAverageDataset = this.aux.deathAverage;
    } else {
      let daysToFilter = this.filterWeeks * 7;
      let datasetLength = this.aux.cases.length-1;
      let datasetByDayLength = this.aux.casesByDay.length-1;

      this.casesDataset = [];
      this.deathDataset = [];
      this.casesByDayDataset = [];
      this.deathByDayDataset = [];
      this.casesAverageDataset = [];
      this.deathAverageDataset = [];

      for(let i=daysToFilter; i>=0; i--) {
        this.casesDataset.push(this.aux.cases[datasetLength - i]);
        this.deathDataset.push(this.aux.death[datasetLength - i]);
        this.casesByDayDataset.push(this.aux.casesByDay[datasetByDayLength - i]);
        this.deathByDayDataset.push(this.aux.deathByDay[datasetByDayLength - i]);
        this.casesAverageDataset.push(this.aux.casesAverage[datasetByDayLength - i]);
        this.deathAverageDataset.push(this.aux.deathAverage[datasetByDayLength - i]);
      }
    }

    setTimeout(() => {
      this.ready = true;
    })
  }
}
