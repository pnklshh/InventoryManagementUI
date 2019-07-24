import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Stock } from '../../models/Stock';
import { AllocationDetail } from '../../models/AllocationDetail';
import { Usage } from '../../models/Usage';

@Component({
  selector: 'ngb-modal',
  styleUrls: ['./modal.component.scss'],
  templateUrl: './modal.component.html',
})
export class NgbModalContent implements OnInit {
  
    public name:string="";
    public itemId: number;
    public engineerId: number;
    public chartLabels: string[] = [];
    public chartData: number[] = [];
    public stockList: Stock[]=[];
    public allocationList: AllocationDetail[]=[];
    public usageList: Usage[]=[];
    public chartType: string = "bar"; 
    public chartOptions: any;

    constructor(public activeModal: NgbActiveModal,private chRef: ChangeDetectorRef) {}

    ngOnInit(){
      if(this.stockList.length > 0)
      {
        this.chartType = "pie";
        this.chartLabels = ["Assignable", "Defective", "Dead"];
        this.chartOptions = {
          legend:{
            display:true,
          },
          responsive:true,
          maintainAspectRatio:false
        }

        this.processStockData();
      }
      else if(this.allocationList.length > 0)
      {
        let clickedEngineer = this.allocationList.filter(x=>x.Engineer.EngineerID == this.engineerId)[0].Engineer.EngineerName;
        
        this.chartOptions = {
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
            text: 'Allocation Summary of ' + clickedEngineer
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
                return "Count: " + count;
              }
            }
          }
        }
        this.processAllocationData();  
      }
      else if(this.usageList.length > 0)
      {
        let clickedEngineer = this.usageList.filter(x=>x.Engineer.EngineerID == this.engineerId)[0].Engineer.EngineerName;
        
        this.chartOptions = {
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
            text: 'Usage Summary of ' + clickedEngineer
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
                return "Count: " + count;
              }
            }
          }
        }
        this.processUsageData();  
      }
    }

    processStockData()
    {
      let assignable=0;
      let defective=0;
      let dead=0;
      this.stockList=this.stockList.filter(x=>x.Item.ItemID == this.itemId);
      this.stockList.forEach(stock => {
        assignable = assignable + stock.Quantity - stock.Defective - stock.Dead;
        defective = defective + stock.Defective;
        dead = dead + stock.Dead;
      });
      this.chartData.push(assignable);
      this.chartData.push(defective);
      this.chartData.push(dead);
      
    }

    processAllocationData()
    {
      this.allocationList=this.allocationList.filter(x=>x.Engineer.EngineerID == this.engineerId);
      this.allocationList.forEach(allocation => {
        if(!this.chartLabels.includes(allocation.Item.ItemName))
        {
          this.chartLabels.push(allocation.Item.ItemName);
          this.chartData.push(allocation.QuantityAllocated);
        }
        else
        {
          let index = this.chartLabels.indexOf(allocation.Item.ItemName);
          this.chartData[index] = this.chartData[index] + allocation.QuantityAllocated;
        }  
        
      });
      
    }

    processUsageData()
    {
      this.usageList=this.usageList.filter(x=>x.Engineer.EngineerID == this.engineerId);
      this.usageList.forEach(usage => {
        if(!this.chartLabels.includes(usage.Item.ItemName))
        {
          this.chartLabels.push(usage.Item.ItemName);
          this.chartData.push(usage.QuantityUsed);
        }
        else
        {
          let index = this.chartLabels.indexOf(usage.Item.ItemName);
          this.chartData[index] = this.chartData[index] + usage.QuantityUsed;
        }  
        
      });
      
    }

    chartClicked(evt: any){
      
    }
  
    chartHovered(){
  
    }

}