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
  firstVacineDataset:any[] = [];
  secondVacineDataset:any[] = [];

  casesByDayDataset:any[] = [];
  deathByDayDataset:any[] = [];
  firstVacineByDayDataset:any[] = [];
  secondVacineByDayDataset:any[] = [];

  casesAverageDataset:any[] = [];
  deathAverageDataset:any[] = [];
  firstVacineAverageDataset:any[] = [];
  secondVacineAverageDataset:any[] = [];

  aux = {
    cases: [],
    death: [],
    firstVacine: [],
    secondVacine: [],
    casesByDay: [],
    deathByDay: [],
    firstVacineByDay: [],
    secondVacineByDay: [],
    casesAverage: [],
    deathAverage: [],
    firstVacineAverage: [],
    secondVacineAverage: []
  };

  ready:boolean = false;
  filterWeeks:number = 0;
  error:boolean = false;

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
          this.error = true;
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
    this.buildFirstVacineDataset(result);
    this.buildSecondVacineDataset(result);
    this.buildCasesByDayDataset(result);
    this.buildDeathByDayDataset(result);
    this.buildFisrtVacineByDayDataset(result);
    this.buildSecondVacineByDayDataset(result);
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



  buildFirstVacineDataset(data:any[]) {
    let dataset = [];
    for(let d of data) {
      dataset.push({date: d["Data"], total: d["Total 1 Dose"]});
    }
    this.firstVacineDataset = dataset;
    this.aux.firstVacine = this.firstVacineDataset;
  }



  buildSecondVacineDataset(data:any[]) {
    let dataset = [];
    for(let d of data) {
      dataset.push({date: d["Data"], total: d["Total 2 Dose"]});
    }
    this.secondVacineDataset = dataset;
    this.aux.secondVacine = this.secondVacineDataset;
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



  buildFisrtVacineByDayDataset(data:any[]) {
    let dataset = [];
    for(let i=1; i<data.length; i++) {
      if(data[i]["Data"] == "09/06/2021") {
        dataset.push(
          {
            date: data[i]["Data"],
            total: 2065
          }
        );
      } else {
        dataset.push(
          {
            date: data[i]["Data"],
            total: Number(data[i]["Total 1 Dose"]) - Number(data[i-1]["Total 1 Dose"])
          }
        );
      }
    }
    this.firstVacineByDayDataset = dataset;
    this.aux.firstVacineByDay = this.firstVacineByDayDataset;

    dataset = [];
    for(let i=0; i<this.firstVacineByDayDataset.length; i++) {
      dataset.push(
        {
          date: this.firstVacineByDayDataset[i].date,
          total: this.calcAverage(this.firstVacineByDayDataset, i)
        }
      );
    }
    this.firstVacineAverageDataset = dataset;
    this.aux.firstVacineAverage = this.firstVacineAverageDataset;
  }



  buildSecondVacineByDayDataset(data:any[]) {
    let dataset = [];
    for(let i=1; i<data.length; i++) {
      if(data[i]["Data"] == "09/06/2021") {
        dataset.push(
          {
            date: data[i]["Data"],
            total: 312
          }
        );
      } else {
        dataset.push(
          {
            date: data[i]["Data"],
            total: Number(data[i]["Total 2 Dose"]) - Number(data[i-1]["Total 2 Dose"])
          }
        );
      }
    }
    this.secondVacineByDayDataset = dataset;
    this.aux.secondVacineByDay = this.secondVacineByDayDataset;

    dataset = [];
    for(let i=0; i<this.secondVacineByDayDataset.length; i++) {
      dataset.push(
        {
          date: this.secondVacineByDayDataset[i].date,
          total: this.calcAverage(this.secondVacineByDayDataset, i)
        }
      );
    }
    this.secondVacineAverageDataset = dataset;
    this.aux.secondVacineAverage = this.secondVacineAverageDataset;
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
      this.firstVacineDataset = this.aux.firstVacine;
      this.secondVacineDataset = this.aux.secondVacine;
      this.casesByDayDataset = this.aux.casesByDay;
      this.deathByDayDataset = this.aux.deathByDay;
      this.firstVacineByDayDataset = this.aux.firstVacineByDay;
      this.secondVacineByDayDataset = this.aux.secondVacineByDay;
      this.casesAverageDataset = this.aux.casesAverage;
      this.deathAverageDataset = this.aux.deathAverage;
      this.firstVacineAverageDataset = this.aux.firstVacineAverage;
      this.secondVacineByDayDataset =  this.aux.secondVacineAverage;
    } else {
      let daysToFilter = this.filterWeeks * 7;
      let datasetLength = this.aux.cases.length-1;
      let datasetByDayLength = this.aux.casesByDay.length-1;

      this.casesDataset = [];
      this.deathDataset = [];
      this.firstVacineDataset = [];
      this.secondVacineDataset = [];
      this.casesByDayDataset = [];
      this.deathByDayDataset = [];
      this.firstVacineByDayDataset = [];
      this.secondVacineByDayDataset = [];
      this.casesAverageDataset = [];
      this.deathAverageDataset = [];
      this.firstVacineAverageDataset = [];
      this.secondVacineAverageDataset =  [];

      for(let i=daysToFilter; i>=0; i--) {
        this.casesDataset.push(this.aux.cases[datasetLength - i]);
        this.deathDataset.push(this.aux.death[datasetLength - i]);
        this.firstVacineDataset.push(this.aux.firstVacine[datasetLength - i]);
        this.secondVacineDataset.push(this.aux.secondVacine[datasetLength - i]);
        this.casesByDayDataset.push(this.aux.casesByDay[datasetByDayLength - i]);
        this.deathByDayDataset.push(this.aux.deathByDay[datasetByDayLength - i]);
        this.firstVacineByDayDataset.push(this.aux.firstVacineByDay[datasetByDayLength - i]);
        this.secondVacineByDayDataset.push(this.aux.secondVacineByDay[datasetByDayLength - i]);
        this.casesAverageDataset.push(this.aux.casesAverage[datasetByDayLength - i]);
        this.deathAverageDataset.push(this.aux.deathAverage[datasetByDayLength - i]);
        this.firstVacineAverageDataset.push(this.aux.firstVacineAverage[datasetByDayLength - i]);
        this.secondVacineAverageDataset.push(this.aux.secondVacineAverage[datasetByDayLength - i]);
      }
    }

    setTimeout(() => {
      this.ready = true;
    })
  }
}
