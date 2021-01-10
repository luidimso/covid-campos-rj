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
  ready:boolean = false;

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
    this.ready = true;
  }



  buildCasesDataset(data:any[]) {
    let dataset = [];
    for(let d of data) {
      dataset.push({date: d["Data"], total: d["Casos Confirmados"]});
    }
    this.casesDataset = dataset;
  }

  buildDeathDataset(data:any[]) {
    let dataset = [];
    for(let d of data) {
      dataset.push({date: d["Data"], total: d["Obito"]});
    }
    this.deathDataset = dataset;
  }
}
