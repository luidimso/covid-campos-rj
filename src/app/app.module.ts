import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { ColumnChartComponent } from './components/column-chart/column-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LineChartComponent,
    ColumnChartComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    HomeComponent
  ],
  exports:[
    HomeComponent
  ]
})
export class AppModule { }
