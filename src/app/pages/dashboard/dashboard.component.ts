import {Component, OnInit, OnDestroy} from '@angular/core';
import { ApiServiceCall } from '../../service/api-call.service'; 
import { Stock } from '../../models/Stock';
import {NgbModalContent} from '../../service/modal/modal.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AllocationDetail } from '../../models/AllocationDetail';
import { Usage } from '../../models/Usage';
import { DatasharingService } from '../../service/datasharing-service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit,OnDestroy {

  public loading:boolean = true;
  public stockSummaryLoader:boolean = true;
  public allocationSummaryLoader:boolean = true;
  public usageSummaryLoader:boolean = true;
  public stockList: Stock[] = [];
  public allocationList: AllocationDetail[] = []; 
  public usageList: Usage[]=[];
  public stockchartLabels: string[] = [];
  public stockchartData: any[] = [];
  public allocationchartLabels: string[] = [];
  public allocationchartData: number[] = [];
  public usagechartLabels: string[] = [];
  public usagechartData: number[] = [];
  public totalAmount: number = 0;
  public totalServiceCharge:number = 0;
  public totalItemsinStock:number = 0;
  public totalItemsAllocated:number = 0;
  public totalItemsUsed:number = 0;
  public startDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');

  public stockchartOptions={
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 0
      }
    },
    title: {
      display: true,
      text: 'Stock Summary'
    },
    legend:{
      display:false,
    },
    responsive:true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        stacked: true,
        gridLines: {
          display:false
        }       
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          beginAtZero:true,
          callback: function(value) {if (value % 1 === 0) {return value;}}
        },
        gridLines: {
          display:false
        }       
      }]
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var type = data.datasets[tooltipItem.datasetIndex].label;
          var count = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return type + ": " + count;
        },
        footer: function(tooltipItem, data) {
          // Loop through all datasets to get the actual total of the index
          var total=0;
          for (var i = 0; i < data.datasets.length; i++)
              total = total + data.datasets[i].data[tooltipItem[0].index];
          return 'Total: ' + total;
        }
      }
    }
  }
  
  public allocationchartOptions={
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 0
      }
    },
    title: {
      display: true,
      text: 'Allocation Summary'
    },
    legend:{
      display:false,
    },
    responsive:true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          display:false
        }       
      }],
      yAxes: [{
        ticks: {
          beginAtZero:true,
          callback: function(value) {if (value % 1 === 0) {return value;}}
        },
        gridLines: {
          display:false
        }       
      }]
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var count = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return "Items: " + count;
        }
      }
    }
  }

  public usagechartOptions={
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 0
      }
    },
    title: {
      display: true,
      text: 'Usage Summary'
    },
    legend:{
      display:false,
    },
    responsive:true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          display:false
        }       
      }],
      yAxes: [{
        ticks: {
          beginAtZero:true,
          callback: function(value) {if (value % 1 === 0) {return value;}}
        },
        gridLines: {
          display:false
        }       
      }]
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          var arr = [];
          var count = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          arr.push("Used items: " + count);
          return arr;
        }
      }
    }
  }

  constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService, private modalService: NgbModal, private router: Router, private datePipe: DatePipe) {
    
  }

  ngOnInit(){

    if(this.datasharingService.getUserDetail() == null)
    {
      this.router.navigate(['/auth/login']);
    }
    
    this.datasharingService.hideLoader();
    this.getStock();
    this.showAllocations();
    this.viewUsage()   
  }

  
  getStock()
  {
    let url = "api/Stock/GetAllStocks?itemname=&cityname=&challannumber=";
    this.stockList=[];
    this.loading = true;
    try
    {
      this.apiCall.GetData(url).subscribe(data=>
      {
        data=JSON.parse(data);
        let appData=JSON.parse(data.AppData);
        
        if(data.ErrorMessage!=null && data.ErrorMessage!="")
        {
          //this.displayMessage("Error",data.ErrorMessage);
          //this.stockSummaryLoader=false;
        }
        else
        {
          this.stockList=appData;
          let assignableData = [];
          let defectiveData = [];
          let deadData = [];
          let obj = {};
          let defectiveObj = { ...obj };
          let deadObj = { ...obj };

          this.stockList.forEach(stock=>{
            if(!this.stockchartLabels.includes(stock.Item.ItemName))
            {
              this.stockchartLabels.push(stock.Item.ItemName);
              //this.stockchartData.push(stock.Quantity);
              assignableData.push(stock.Quantity - stock.Defective - stock.Dead);
              defectiveData.push(stock.Defective);
              deadData.push(stock.Dead);
            }
            else
            {
              let index = this.stockchartLabels.indexOf(stock.Item.ItemName);
              //this.stockchartData[index] = this.stockchartData[index] + stock.Quantity;
              assignableData[index] = assignableData[index] + stock.Quantity - stock.Defective - stock.Dead;
              defectiveData[index] = defectiveData[index] + stock.Defective;
              deadData[index] = deadData[index] + stock.Dead;
            }
            this.totalItemsinStock = this.totalItemsinStock + stock.Quantity;
          })
          obj["data"] = assignableData;
          obj["label"] = "Good condition";
          obj["stack"] = "1";
          this.stockchartData.push(obj);

          defectiveObj["data"] = defectiveData;
          defectiveObj["label"] = "Defective";
          defectiveObj["stack"] = "1";
          this.stockchartData.push(defectiveObj);

          deadObj["data"] = deadData;
          deadObj["label"] = "Dead";
          deadObj["stack"] = "1";
          this.stockchartData.push(deadObj);

        }
        this.stockSummaryLoader = false;
        this.loading = false;        
      },
      err=>
      {
        console.log(err);
      });
    }
    catch(ex)
    {
      console.log(ex);
    }
  }

  showAllocations()
  {
    let url = "api/Engineer/GetAllocations";
    this.loading = true; 
    try
    {
      this.apiCall.GetData(url).subscribe(data=>
      {
          data=JSON.parse(data);
          let appData=JSON.parse(data.AppData);
          
          if(data.ErrorMessage!=null && data.ErrorMessage!="")
          {
            //this.displayMessage("Error",data.ErrorMessage);
          }
          else
          {
            this.allocationList=appData;
            this.allocationList.forEach(allocation=>{
              if(!this.allocationchartLabels.includes(allocation.Engineer.EngineerName))
              {
                this.allocationchartLabels.push(allocation.Engineer.EngineerName);
                this.allocationchartData.push(allocation.QuantityAllocated);
              }
              else
              {
                let index = this.allocationchartLabels.indexOf(allocation.Engineer.EngineerName);
                this.allocationchartData[index] = this.allocationchartData[index] + allocation.QuantityAllocated;
              }
              this.totalItemsAllocated = this.totalItemsAllocated + allocation.QuantityAllocated;
            })
            
          }
          this.allocationSummaryLoader = false;
          this.loading = false; 
      },
      err=>
      {
        console.log(err);
      });
    }
    catch(ex)
    {
      console.log(ex);
    }
  }

  viewUsage()
  {
    let url = "api/Usage/GetHistory";
    this.loading = true;
    try
    {
      this.apiCall.GetData(url).subscribe(data=>
      {
        data=JSON.parse(data);
        let appData=JSON.parse(data.AppData);
        
        if(data.ErrorMessage!=null && data.ErrorMessage!="")
        {
          //this.displayMessage("Error",data.ErrorMessage);
        }
        else
        {
          this.usageList=appData;
          this.usageList.forEach(usage=>{
            if(!this.usagechartLabels.includes(usage.Engineer.EngineerName))
            {
              this.usagechartLabels.push(usage.Engineer.EngineerName);
              this.usagechartData.push(usage.QuantityUsed);
            }
            else
            {
              let index = this.usagechartLabels.indexOf(usage.Engineer.EngineerName);
              this.usagechartData[index] = this.usagechartData[index] + usage.QuantityUsed;
            }
            this.totalItemsUsed = this.totalItemsUsed + usage.QuantityUsed;
            this.totalAmount = this.totalAmount + usage.Amount;
            this.totalServiceCharge = this.totalServiceCharge + usage.ServiceCharge;
          })
          
        }
        this.usageSummaryLoader = false;
        this.loading = false;  
      },
      err=>
      {
        console.log(err);
      });
    }
    catch(ex)
    {
      console.log(ex);
    }
  }

  stockchartClicked(evt: any){
    let index = 0;
    if(evt.active[0] != undefined)
    {
      index = evt.active[0]._index;
      let itemId = this.stockList.filter(x=>x.Item.ItemName == this.stockchartLabels[index])[0].Item.ItemID;
      //this.openModal(itemId, this.stockList, "StockSummary");
    }
  }

  stockchartHovered(){

  }

  allocationchartClicked(evt: any){
    let index = 0;
    if(evt.active[0] != undefined)
    {
      index = evt.active[0]._index;
      let engineerId = this.allocationList.filter(x=>x.Engineer.EngineerName == this.allocationchartLabels[index])[0].Engineer.EngineerID;
      this.openModal(engineerId, this.allocationList, "AllocationSummary");
    }
  }

  allocationchartHovered(){

  }

  usagechartClicked(evt: any){
    let index = 0;
    if(evt.active[0] != undefined)
    {
      index = evt.active[0]._index;
      let engineerId = this.usageList.filter(x=>x.Engineer.EngineerName == this.usagechartLabels[index])[0].Engineer.EngineerID;
      this.openModal(engineerId, this.usageList, "UsageSummary");
    }
  }

  usagechartHovered(){

  }

  openModal(itemId: number, list: any, chart: string){
    
    const modalRef = this.modalService.open(NgbModalContent, { size: 'lg' });
    if(chart == "StockSummary")
    {
      modalRef.componentInstance.itemId = itemId;
      modalRef.componentInstance.stockList = list;
    }
    else if(chart == "AllocationSummary")
    {
      modalRef.componentInstance.engineerId = itemId;
      modalRef.componentInstance.allocationList = list;
    }
    else if(chart == "UsageSummary")
    {
      modalRef.componentInstance.engineerId = itemId;
      modalRef.componentInstance.usageList = list;
    }
  }

  redirectToViewStock()
  {
    this.router.navigate(['/pages/viewstock']);
  }

  redirectToViewAllocation()
  {
    this.router.navigate(['/pages/viewallocation']);
  }

  redirectToViewUsage()
  {
    this.router.navigate(['/pages/viewhistory']);
  }

  ngOnDestroy() {
    
  }
}
