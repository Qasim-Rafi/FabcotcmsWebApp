import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions ,ChartType} from 'chart.js';
import {Color,  Label } from 'ng2-charts';
//import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEditTrendFormComponent } from './add-edit-trend-form/add-edit-trend-form.component';
import { AddEditForecastComponent } from './add-edit-forecast/add-edit-forecast.component';
//import { IPointRenderEventArgs } from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-fabcot-trends',
  templateUrl: './fabcot-trends.component.html',
  styleUrls: ['./fabcot-trends.component.css']
})
export class FabcotTrendsComponent implements OnInit {


  public primaryXAxis: Object;
  public chartData: Object[];
  public primaryYAxis: Object;
  public legendSettings: Object;
  public tooltip: Object;
  public title: string;
  public marker: Object;



token='eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJOYW1lSWRlbnRpZmllciI6IjM4IiwiTmFtZSI6Inlhcm5leHBvcnQgc2FtYW4iLCJEZXB0SWRlbnRpZmllciI6IjEiLCJyb2xlIjoiU3VwZXJBZG1pbiIsIm5iZiI6MTY0NzIzNTg0OSwiZXhwIjoxNjQ3NjY3ODQ5LCJpYXQiOjE2NDcyMzU4NDl9.gokRtzhx8p5fb_qJFDphCsjYYh7rcthrbiPnR2E7gEPkQxyOIh5TKgRS-LJnp0sl-QI82Zr-7ScJjK9UiKSuQA'

 // title = 'fabcot-trends';
  response1: any;
  rows: any = [];
  temp: any = [];
  columns: any = [];
  @ViewChild('myCanvas') canvas: ElementRef;
  response: any;
  colors:any=[];
  selectedCar: number;
  actualdata:any;
year:any;
  cars = [
      // { id: 1, name: 'NYCF' },
      // { id: 2, name: 'Index A' },
      // { id: 3, name: 'CZCE' },
      // { id: 4, name: 'Viscose' },
      // { id: 5, name: 'Crude Oil' },
  ];
  yearMatch:boolean=false;
data:any =[];
forecast:any=[];
data1:any =[];
data2:any =[65, 59, 80, 59, 80, 78, 80, 59, 80, 81, 56, 58];
data3:any =[65, 59, 80, 31, 56, 78, 80, 59, 80, 81, 56, 58];
data4:any =[65, 59, 80, 59, 80, 78, 80, 59, 80, 59, 80, 58];
data5:any =[65, 59, 80, 31, 56, 78, 80, 59, 80, 81, 56, 58];
data11:any =[];
data21:any =[65, 59, 80, 59, 80, 78, 80, 59, 80, 81, 56];
data31:any =[65, 59, 80, 31, 56, 78, 80, 59, 80, 81, 56];
data41:any =[65, 59, 80, 59, 80, 78, 80, 59, 80, 59, 80];
data51:any =[65, 59, 80, 31, 56, 78, 80, 59, 80, 81, 56];
LineChartData: ChartDataSets[]=[];
LineChartData1: ChartDataSets[]=[];

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) { 
    
  }

  ngOnInit() {
    //localStorage.setItem('token',this.token)
    this.tooltip = {
      enable: true
  }
  this.chartData = [
      { month: 'Jan', sales: 35 }, { month: 'Feb', sales: 28 },
      { month: 'Mar', sales: 34 }, { month: 'Apr', sales: 32 },
      { month: 'May', sales: 40 }, { month: 'Jun', sales: 32 },
      { month: 'Jul', sales: 35 }, { month: 'Aug', sales: 55 },
      { month: 'Sep', sales: 38 }, { month: 'Oct', sales: 30 },
      { month: 'Nov', sales: 25 }, { month: 'Dec', sales: 32 }
  ];
  //this.pointRender()
  this.primaryXAxis = {
      valueType: 'Category'
  };
  this.primaryYAxis = {
    minimum: 0, maximum: 100, interval: 10,
      // labelFormat: '{value}'
  };

//   this.primaryYAxis = {
//     minimum: 0, maximum: 80, interval: 10,
//     title: 'People(in millions)'
//  };
  this.marker = { visible: true, width: 15, height: 15,
      dataLabel:{
          visible: true
      }
  };
  this.legendSettings = {
      visible: true
  };
  this.title = 'Sales Analysis';

    this.getLookUpCompany();
    this.fetch((data) => {
      this.temp = [...data]; 
      this.rows = data;
    });
    this.getdata();
    
    this.changedata(1)
    var currentTime = new Date();
     this.year = currentTime.getFullYear()
    // const gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 600);
    // gradient.addColorStop(0, 'red');
    // gradient.addColorStop(1, 'green');
    // this.lineChartColors = [
    //     {
    //         backgroundColor: gradient
    //     }
    // ];
    //  var ctx = document.getElementById('myCanvas');
    //  var gradient = ctx.createLinearGradient(0, 0, 0, 400)
    // gradient.addColorStop(0, 'rgba(229, 239, 255, 1)')
    // gradient.addColorStop(1, '#FFFFFF')
  }
//   public pointRender(args: IPointRenderEventArgs): void {
//     let seriesColor: string[] = ['red'];
//     //  args.fill = seriesColor[args.point.index];
//     if(args.point.index === 6) {
//             args.fill = seriesColor[args.point.index]
//     }
// };
  getLookUpCompany() {
    this.http
      .get(`${environment.apiUrl}/api/Lookups/FabcotTrendsCompanyLookup`)
      .subscribe(res => {
        this.response = res;
        if (this.response.success == true) {
          this.cars = this.response.data;
        }
        else {
          this.toastr.error(this.response.message, 'Message.');
        }

      }, err => {
        if (err.status == 400) {
          this.toastr.error(err.error.message, 'Message.');
        }
      });
  }

  fetch(cb) {
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/FabcotTrendsDataAll`)
    .subscribe(res => {
      this.response = res;
     
    if(this.response.success==true)
    {
     this.data=this.response.data;
     this.rows = this.data;


     cb(this.data);
    //this.spinner.hide();

    }
    else{
      this.toastr.error(this.response.message, 'Message.');
      //this.spinner.hide();
    
    }

    }, err => {
      if ( err.status == 400) {
  this.toastr.error(err.error.message, 'Message.');


      }
    });
  }

  edit(data,check, name) {
    const modalRef = this.modalService.open(AddEditTrendFormComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.componentInstance.FormData = data;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
 
this.ngOnInit()

      }
    }, (reason) => {
      // on dismiss
    });
  }
  add(check, name) {
    const modalRef = this.modalService.open(AddEditTrendFormComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
        this.ngOnInit()


      }
    }, (reason) => {
      // on dismiss
    });
  }

  addfor(check, name) {
    const modalRef = this.modalService.open(AddEditForecastComponent, { centered: true });
    modalRef.componentInstance.statusCheck = check;
    modalRef.componentInstance.FormName = name;
    modalRef.result.then((data) => {
      // on close
      if (data == true) {
 
        this.ngOnInit()

      }
    }, (reason) => {
      // on dismiss
    });
  }




  changedata(event){
    
   if( event ==1){
     this.calculate();
    this.LineChartData =[
      { data: this.data, label: 'NYCF',fill: false , lineTension: 0 },
    ]
    this.LineChartData1 =[
      { data: this.forecast, label: 'NYCF',fill: false , lineTension: 0},
    ]
   }
   else if(this.actualdata !=undefined && this.actualdata !=null){
    let filterCompanyData =this.actualdata.filter(x=>x.companyId ==event)
    
    let companydata=filterCompanyData.length != 0? filterCompanyData[0].values.map(Number):[0]

    this.calculate();
    let companyNameifNoData=this.cars.filter(x=>x.id == event)
    this.LineChartData =[
      { data: companydata, label: filterCompanyData.length != 0?filterCompanyData[0].companyName:companyNameifNoData[0].name,fill: false , lineTension: 0},
    ]
    this.LineChartData1 =[
      { data: companydata, label: filterCompanyData.length != 0?filterCompanyData[0].companyName:companyNameifNoData[0].name,fill: false , lineTension: 0},
    ]
  }

// else if(event==2){
//   this.LineChartData =[
//     { data: this.data1, label: 'Index A',fill: false , lineTension: 0},
//   ]
//   this.LineChartData1 =[
//     { data: this.data11, label: 'Index A',fill: false , lineTension: 0},
//   ]
// }
// else if(event==3){
//   this.LineChartData =[
//     { data: this.data2, label: 'CZCE',fill: false , lineTension: 0},
//   ]
//   this.LineChartData1 =[
//     { data: this.data21, label: 'CZCE',fill: false , lineTension: 0},
//   ]
// }
// else if(event==4){
//   this.LineChartData =[
//     { data: this.data3, label: 'Viscose',fill: false , lineTension: 0},
//   ]
//   this.LineChartData1 =[
//     { data: this.data31, label: 'Viscose',fill: false , lineTension: 0},
//   ]
// }
// else if(event==5){
//   this.LineChartData =[
//     { data: this.data4, label: 'Crude Oil',fill: false , lineTension: 0},
//   ]
//   this.LineChartData1 =[
//     { data: this.data41, label: 'Crude Oil',fill: false , lineTension: 0},
//   ]
// }
  

  }
  getdata(){
    this.http
    .get(`${environment.apiUrl}/api/BillingPayments/GetFabcotForcastData`)
    .subscribe(res => {
      this.response = res;

      if (this.response.success == true) {
   this.actualdata =this.response.data
        let values =this.response.data[0].values.map(Number)
        let values1 =this.response.data[0] != undefined? this.response.data[0].values.map(Number):0
        this.data = values;
        this.data1 = values1;
        this.forecast =values.slice(0,values.length-1)
        this.data11 =values1.slice(0,values.length-1)
        this.selectedCar =1;
        this.changedata(1)
        // setTimeout(() => {
        //   this.LineChartData =[
        //     { data: this.data, label: 'NYCF',fill: false , lineTension: 0},
        //   ]
        // }, 100);
    
// this.LineChartData =[
//   { data: this.data, label: 'Series A',fill: false , lineTension: 0},
// ]
        //cb(this.data);
        //this.spinner.hide();
      }
      else {
        //this.toastr.error(this.response.message, 'Message.');
        //this.spinner.hide();
      }
    }, err => {
      if (err.status == 400) {
        //this.toastr.error(err.error.message, 'Message.');
        //this.spinner.hide();
      }
      //this.spinner.hide();
    });
  }
//....................................................................................1.........................................


  lineChartData = this.LineChartData;
  // public lineChartData: ChartDataSets[] = [
  //   { data: this.data, label: 'Series 1',fill: false , lineTension: 0},
  //   // { data: this.data1, label: 'Series 2',fill: false , lineTension: 0},
  //   // { data: this.data, label: 'Series 3',fill: false , lineTension: 0},
  //   // { data: this.data, label: 'Series 4',fill: false , lineTension: 0},
  //   // { data: this.data, label: 'Series 5',fill: false , lineTension: 0},
  // ];
  // , 'Aug', 'Sep', 'Oct', 'Nov','Dec'
  public lineChartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: 'easeInOutElastic',
      
      onComplete: function () {
          var chartInstance = this.chart,
          ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#676A6C';
          ctx.textBaseline = 'bottom';
          // this.data.datasets[0].backgroundColor=['','','','red'];
          // this.data.datasets[0].borderColor=['','','','red'];
          
          this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  var data = dataset.data[index];
                  if (data > 0) {
                    ctx.fillText(data, bar._model.x, bar._model.y - 5);
                    
                 }
              });
          });
      }
  },
    elements: 
    { 
        point: 
        {
            radius: 5,
            hitRadius: 5,
            hoverRadius: 10,
            hoverBorderWidth: 2,
            backgroundColor:'black'
        }
    },
    legend: {
      display: true,
      
    },
    scales : {
      yAxes: [{
         ticks: {
            max : 200,
            min: 0
          }
      }]
    },
    plugins: {
      color: "black",
      datalabels: {
        anchor: 'end',
        align: 'start',
        offset: 5,
        // clamp: true,
        color:"black",
        font: {
          size: 14,
          weight: 'bold',
          
        },
  
        // annotation: {
        //   annotations: [
        //     {
        //       type: "line",
        //       mode: "vertical",
        //       scaleID: "x-axis-0",
        //       value: "Mar",
        //       borderColor: "red",
        //       label: {
        //         content: "TODAY",
        //         enabled: true,
        //         position: "top"
        //       }
        //     }
        //   ]
        // },
        formatter: (value, context) => {
          const xLabel = context.chart.config.data.labels[context.dataIndex];
          const datasetLabel = context.dataset.label;
          return xLabel +'\n'+ ' (' + value + "%" + ')';
        }
      }
    }
  };

  public lineChartColors: Color[] = [
     {
       borderColor: this.colors,
      backgroundColor: this.colors,
    pointBackgroundColor: this.colors,
   pointBorderColor: this.colors,
   pointHoverBackgroundColor: this.colors,
   pointHoverBorderColor: this.colors
     },
  ];
  public lineChartLegend = true;
  public lineChartType:ChartType  = 'line';
   public lineChartPlugins = [{
     
    beforeRender: (x, options) => {
      //this.yearMatch =false;
      const c = x.chart;
      const dataset = x.data.datasets[0];
      const yScale = x.scales['y-axis-0'];
      const xScale = x.scales['x-axis-0'];
      const yPos = yScale.getPixelForValue(0);
      const xPos = xScale.getPixelForValue(0);
  
      const gradientFill = c.ctx.createLinearGradient(0, 0, 0, c.height);
      gradientFill.addColorStop(0, 'red');
      gradientFill.addColorStop(yPos / c.height, 'red');
      //gradientFill.addColorStop(xPos / c.height, 'green');
      // gradientFill.addColorStop(yPos / c.height, 'blue');
      // gradientFill.addColorStop(yPos / c.height, 'blue');
      //gradientFill.addColorStop(yPos / c.height, 'blue');
      gradientFill.addColorStop(1, 'red');
  
      const model = x.data.datasets[0]._meta[Object.keys(dataset._meta)[0]].dataset._model;
      model.borderColor = gradientFill;
    },
   
    //{
    
     afterLayout: (x, options) => {
      //this.yearMatch =false;
      //  const Chart = x.chart;

      // Chart.defaults.multicolorLine = Chart.defaults.line;
      // Chart.controllers.multicolorLine = Chart.controllers.line.extend({
      //   draw: function(ease) {
      //     var
      //       startIndex = 0,
      //       meta = this.getMeta(),
      //       points = meta.data || [],
      //       colors = this.getDataset().colors,
      //       area = this.chart.chartArea,
      //       originalDatasets = meta.dataset._children
      //         .filter(function(data) {
      //           return !isNaN(data._view.y);
      //         });
    
      //     function _setColor(newColor, meta) {
      //       meta.dataset._view.borderColor = newColor;
      //     }
    
      //     if (!colors) {
      //       Chart.controllers.line.prototype.draw.call(this, ease);
      //       return;
      //     }
    
      //     for (var i = 2; i <= colors.length; i++) {
      //       if (colors[i-1] !== colors[i]) {
      //         _setColor(colors[i-1], meta);
      //         meta.dataset._children = originalDatasets.slice(startIndex, i);
      //         meta.dataset.draw();
      //         startIndex = i - 1;
      //       }
      //     }
    
      //     meta.dataset._children = originalDatasets.slice(startIndex);
      //     meta.dataset.draw();
      //     meta.dataset._children = originalDatasets;
    
      //     points.forEach(function(point) {
      //       point.draw(area);
      //     });
      //   }
      // });
      // const dataset = x.data.datasets[0];
      // const yScale = x.scales['y-axis-0'];
      // const yPos = yScale.getPixelForValue(0);
  
      // const gradientFill = c.ctx.createLinearGradient(0, 0, 0, c.height);
      // gradientFill.addColorStop(0, 'red');
      // gradientFill.addColorStop(yPos / c.height, 'red');
      // gradientFill.addColorStop(yPos / c.height, 'red');
      // gradientFill.addColorStop(1, 'red');
  
      // const model = x.data.datasets[0]._meta[Object.keys(dataset._meta)[0]].dataset._model;
      // model.borderColor = gradientFill;
     }
  }
  //     this.colors =[];
       //this.yearMatch =false;
  //     this.calculate();
  //     // const gradient = this.canvas.nativeElement.getContext('2d').createLinearGradient(0, 0, 0, 600);
  //     // gradient.addColorStop(0, 'red');
  //     // gradient.addColorStop(1, 'green');
  //     // this.lineChartColors = [
  //     //     {
  //     //         backgroundColor: gradient
  //     //     }
  //     // ];
  //     //this.data.datasets[0].borderColor= ['red','#676A6C','#676A6C','red'];
  //     // chart.data.datasets[0].borderColor =  ['red','#676A6C','#676A6C','red'];
  //     // chart.data.datasets[0].backgroundColor =  ['red','#676A6C','#676A6C','red'];
  //     // var yearcount =[ 1,2,3,4,5,6,7,8,9,10,11,12]
  //     // for(let i=0;i<yearcount.length;i++){
  //     //   var date  = new Date();
  //     //      var month = date.getMonth();
  //     //      if(month == yearcount[i]){
  //     //        colors.push('red')
  //     //      }
  //     //      else{
  //     //       colors.push('blue')
  //     //      }
  //     // }
      
  //      var colors= [];
  //      colors =this.colors;
  //      var ctx = chart.chart.ctx;
  //      ctx.strokeStyle =this.colors;
  //      var xAxis = chart.scales['x-axis-0'];
  //      var gradientStroke = ctx.createLinearGradient(xAxis.left, 0, xAxis.right, 0);
  //     var dataset = chart.data.datasets[0];

  //     // const gradient =ctx.createLinearGradient(xAxis.left, 0, xAxis.right, 0);
  //     // gradientStroke.addColorStop(0, 'red');
  //     // gradientStroke.addColorStop(1, 'green');
  //     // this.lineChartColors = [
  //     //     {
  //     //         backgroundColor: gradient
  //     //     }
  //     // ];
  //     // colors.forEach((c, i) => {
  //     //   var stop = 1 / (colors.length - 1) * i;
  //     //   gradientStroke.addColorStop(stop, colors[i]);
  //     // });
  //      dataset.backgroundColor = this.colors;
  //      dataset.borderColor = this.colors;
  //      dataset.pointBorderColor = this.colors;
  //      dataset.pointBackgroundColor = this.colors;
  //      dataset.pointHoverBorderColor = this.colors;
  //      dataset.pointHoverBackgroundColor = this.colors;
  //   }
  // }
];


  calculate(){
    const startDate = new Date()
    var yearcount =[ 1,2,3,4,5,6,7,8,9,10,11,12]
    var date  = new Date();
    var month  = startDate.getMonth() +1
    //date.getMonth();
      for(let i=0;i<month;i++){
     
           var monthindex =yearcount[i]
           if(month == monthindex || this.yearMatch ==true){
             
             this.colors.push( 
             "blue",
          
            );
             this.yearMatch =true;
           }
           else{
            this.colors.push(
             "red"
            );
            if(month == monthindex){
              this.yearMatch =true;
            }
            
           }
      }
      
      console.log(this.colors)
  }
//....................................................................................1.........................................

//....................................................................................2.........................................
lineChartData1 = this.LineChartData1;
// public lineChartData1: ChartDataSets[] = [
//   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A',fill: false , lineTension: 0, },
// ];
public lineChartLabels1: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec'];
public lineChartOptions1: ChartOptions = {
  responsive: true,
  // legend: {
  //   display: false,
  // },
  //enabled: true, easing: 'easeinout', speed: 800, animateGradually: { enabled: true, delay: 150 }, dynamicAnimation: { enabled: true, speed: 350
  animation: {
    animateScale: true,
      animateRotate: true,
      duration: 0,
      easing: 'easeInOutElastic',
      
    //speed: 800
    //easing: 'easeInOutElastic',
    onComplete: function () {
        var chartInstance = this.chart,
        ctx = chartInstance.ctx;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#676A6C';
        ctx.textBaseline = 'bottom';
        this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
                var data = dataset.data[index];
                if (data > 0) {
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
               }
            });
        });
    }
},
  elements: 
  { 
      point: 
      {
          radius: 5,
          hitRadius: 5,
          hoverRadius: 10,
          hoverBorderWidth: 2,
          backgroundColor:'black'
      }
  },
  scales : {
    yAxes: [{
       ticks: {
          max : 200,
          min: 0
        }
    }]
  },
};
public lineChartColors1: Color[] = [
  {
    borderColor: '#4b94bf',
    backgroundColor: 'rgba(255,0,0,0.3)',
  },
];
public lineChartLegend1 = true;
public lineChartType1:ChartType  = 'line';
public lineChartPlugins1 = [];

//....................................................................................2.........................................
public chartClicked(e:any):void  {
  if(e.active.length > 0){
    var points = [];
    var pointSelected = e.active[0]._chart.tooltip._model.caretY;
    var legends = e.active[0]._chart.legend.legendItems; 
    for (var i = 0; i < e.active.length; ++i) {
      points.push(e.active[i]._model.y);
    }
    let position = points.indexOf(pointSelected);
    let label = legends[position].text;
    let dataIndex = e.active[0]._index
    const chart = e.active[0]._chart;
  const activePoints = chart.getElementAtEvent(e.event);
      const clickedElementIndex = activePoints[0]._index;
      const labelX = chart.data.labels[clickedElementIndex];
   Swal.fire(
    label,
    labelX +' ' +this.data[dataIndex]
    
  )
 }
}
public chartClicked1(e:any):void  {
  if(e.active.length > 0){
    var points = [];
    var pointSelected = e.active[0]._chart.tooltip._model.caretY;
    var legends = e.active[0]._chart.legend.legendItems; 
    for (var i = 0; i < e.active.length; ++i) {
      points.push(e.active[i]._model.y);
    }
    let position = points.indexOf(pointSelected);
    let label = legends[position].text;
    let dataIndex = e.active[0]._index
    const chart = e.active[0]._chart;
  const activePoints = chart.getElementAtEvent(e.event);
      const clickedElementIndex = activePoints[0]._index;
      const labelX = chart.data.labels[clickedElementIndex];
   Swal.fire(
    label,
    labelX +' ' +this.data[dataIndex]
    
  )
 }
}

}
