import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { Stock } from '../../../models/Stock';
import { AllocationDetail } from '../../../models/AllocationDetail';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import {Subject} from 'rxjs';
import { Router } from '../../../../../node_modules/@angular/router';
import { DatasharingService } from '../../../service/datasharing-service';

@Component({
    selector: 'view-stock',
    templateUrl: './view-stock.component.html',
    styleUrls: ['./view-stock.component.scss']
})

export class ViewStockComponent implements OnInit {

    public columnDefs:DataTables.Settings={};
    public dtOptions:any={};
    public dtTrigger:Subject<any>=new Subject();

    public errorAlert:boolean=false;
    public successAlert:boolean=false;
    public message:string="";

    public stockList:Stock[]=[];

    constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService, private chRef: ChangeDetectorRef, private router: Router){}

    ngOnInit()
    {
        this.getStock();
    }

    getStock()
    {
        let url = "api/Stock/GetAllStocks";
        this.stockList=[];
        this.datasharingService.showLoader();
        try
        {
            this.apiCall.GetData(url).subscribe(data=>
            {
                data=JSON.parse(data);
                let appData=JSON.parse(data.AppData);
                
                if(data.ErrorMessage!=null && data.ErrorMessage!="")
                {
                    this.displayMessage("Error",data.ErrorMessage);
                }
                else
                {
                    this.stockList=appData;
                }

                this.dtOptions={
                    pagingType: 'full_numbers',
                    pageLength: 10,
                    paging: true,
                    stateSave: false,
                    destroy: true,
                    columns: [{
                        title: 'Item name',
                        data: 'ItemName'
                    },
                    {
                        title: 'Group',
                        data: 'ItemGroup'
                    },
                    {
                        title: 'Quantity',
                        data: 'Quantity'
                    },
                    {
                        title: 'Defective',
                        data: 'Defective'
                    },
                    {
                        title: 'Dead',
                        data: 'Dead'
                    },
                    {
                        title: 'Challan number',
                        data: 'ChallanNumber'
                    },
                    {
                        title: 'Date',
                        data: 'Date'
                    },
                    {
                        title: 'City name',
                        data: 'CityName'
                    },
                    {
                        title: 'Actions'
                    }
                    ],
                    dom:'Bfrtip',
                    buttons:[
                        {
                            extend:'excel',
                            filename:'stock'
                        },
                        {
                            extend:'pdf',
                            filename:'stock'
                        },
                        'print'
                    ]
                };
                                
                this.chRef.detectChanges();
                this.dtTrigger.next();
                this.datasharingService.hideLoader();
            },
            err=>
            {
                console.log(err);
                this.datasharingService.hideLoader();
            });
        }
        catch(ex)
        {
            console.log(ex);
            this.datasharingService.hideLoader();
        }
    }
    
    editStock(stock: Stock)
    {
        this.router.navigate(['/pages/editstock',JSON.stringify(stock)]);
    }

    deleteStock(stockId: number, itemName: string)
    {
        //this.stockList=[];
        
        let url = "api/Stock/DeleteStock?stockId=" + stockId;
        if(window.confirm("Are you sure you want to delete this stock of " + itemName + "s ?" ))
        {
            this.datasharingService.showLoader();
            try
            {
                this.apiCall.GetData(url).subscribe(data=>
                {
                    data=JSON.parse(data);
                    
                    if(data.ErrorMessage!=null && data.ErrorMessage!="")
                    {
                        this.displayMessage("Error",data.ErrorMessage);
                    }
                    else
                    {
                        this.displayMessage("Success","Stock deleted successfully");
                        this.getStock();
                    }
                    this.datasharingService.hideLoader();
                },
                err=>
                {
                    console.log(err);
                    this.datasharingService.hideLoader();
                });
            }
            catch(ex)
            {
                console.log(ex);
                this.datasharingService.hideLoader();
            }
        }

    }

    sendForRepair(stock: Stock)
    {
        let allocation = new AllocationDetail();
        allocation.AllocationDate = new Date(Date.now());
        allocation.Engineer = null;
        allocation.Item = stock.Item;
        allocation.QuantityAllocated = stock.Defective;
        allocation.City = stock.City;

        let url = "api/Engineer/AllocateItem";
        this.datasharingService.showLoader();
        try
        {
            this.apiCall.PostData(url,JSON.stringify(allocation)).subscribe(data=>
            {
                data=JSON.parse(data);
                console.log(data);
                if(data.ErrorMessage!=null && data.ErrorMessage!="")
                {
                    this.displayMessage("Error",data.ErrorMessage);
                }
                else
                {
                    this.displayMessage("Success","Successfully sent stock for repair");
                    this.getStock();
                }
                this.datasharingService.hideLoader();
            },
            err=>
            {
                console.log(err);
                this.datasharingService.hideLoader();
            });
        }
        catch(ex)
        {
            console.log(ex);
            this.datasharingService.hideLoader();
        }
    }

    displayMessage(alert: string, message:string)
    {
        this.errorAlert=false;
        this.successAlert=false;
        if(alert=="Error")
            this.errorAlert=true;
        else if(alert=="Success")
            this.successAlert=true;
        
        this.message=message;    
    }

    closeMessage()
    {
        this.errorAlert=false;
        this.successAlert=false;
        this.message="";
    }
}
