import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { Stock } from '../../../models/Stock';
import { AllocationDetail } from '../../../models/AllocationDetail';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import {Subject} from 'rxjs';
import { Router } from '../../../../../node_modules/@angular/router';
import { DatasharingService } from '../../../service/datasharing-service';
import { Constant } from '../../../constants/Constants';
import { Item } from '../../../models/Item';
import { City } from '../../../models/City';

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
    public loading:boolean=true;

    public defectiveChallanNumber: string;
    public stockList:Stock[]=[];
    public role: string;
    public total: number[]=[];
    public itemList: Item[]=[];
    public cityList: City[]=[];
    public challanList: string[]=[];
    public stock: Stock;

    constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService, private constant: Constant, private chRef: ChangeDetectorRef, private router: Router){}

    ngOnInit()
    {
        this.datasharingService.showLoader();
        if(this.datasharingService.getUserDetail() == null)
        {
            this.router.navigate(['/auth/login']);
        }
        else
        {
            this.role = this.datasharingService.getUserDetail().Role;
            this.defectiveChallanNumber = this.constant.Defective_ChallanNumber;
            this.initializeForm();
            this.getItems();
            this.getCities(); 
            this.getStock();         
        }
    }

    initializeForm()
    {
        this.stock = new Stock();
        this.stock.Item = new Item();
        this.stock.City = new City();
    }

    getStock()
    {
        let challanNumber = "";
        if(this.stock.ChallanNumber != "0")
            challanNumber = this.stock.ChallanNumber;
        let url = "api/Stock/GetAllStocks?itemname=" + this.stock.Item.ItemName + "&cityname=" + this.stock.City.CityName + "&challannumber=" + challanNumber;
        console.log(url);
        this.stockList=[];
        this.datasharingService.showLoader();
        this.loading = true;
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
                
                this.stockList.forEach(stock => {
                    this.total[stock.Item.ItemID] = 0;
                    // populate challanList
                    if(!this.challanList.includes(stock.ChallanNumber))
                        this.challanList.push(stock.ChallanNumber);
                })

                this.stockList.forEach(stock => {
                    this.total[stock.Item.ItemID] = this.total[stock.Item.ItemID] + stock.Quantity;
                })

                this.dtOptions={
                    pagingType: 'full_numbers',
                    pageLength: 10,
                    paging: true,
                    stateSave: false,
                    destroy: true,
                    scrollX: true,
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
                        title: 'Total'
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
                this.loading = false;
            },
            err=>
            {
                console.log(err);
                // this.datasharingService.hideLoader();
                // this.loading = false;
            });
        }
        catch(ex)
        {
            console.log(ex);
            // this.datasharingService.hideLoader();
            // this.loading = false;
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
            this.loading = true;
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
                    this.loading = false;
                },
                err=>
                {
                    console.log(err);
                    // this.datasharingService.hideLoader();
                    // this.loading = false;
                });
            }
            catch(ex)
            {
                console.log(ex);
                // this.datasharingService.hideLoader();
                // this.loading = false;
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
        this.loading = true;
        try
        {
            this.apiCall.PostData(url,JSON.stringify(allocation)).subscribe(data=>
            {
                data=JSON.parse(data);
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
                this.loading = false;
            },
            err=>
            {
                console.log(err);
                // this.datasharingService.hideLoader();
                // this.loading = false;
            });
        }
        catch(ex)
        {
            console.log(ex);
            // this.datasharingService.hideLoader();
            // this.loading = false;
        }
    }

    getItems()
    {
        let url = "api/Item/GetAllItems";
        this.datasharingService.showLoader();
        this.loading = true;
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
                    this.itemList=appData;
                    // this.stock.Item = this.itemList[0];
                }
                this.datasharingService.hideLoader();
                this.loading = false;
            },
            err=>
            {
                console.log(err);
                // this.datasharingService.hideLoader();
                // this.loading = false;
            });
        }
        catch(ex)
        {
            console.log(ex);
            // this.datasharingService.hideLoader();
            // this.loading = false;
        }
    }

    getCities()
    {
        let url = "api/City/GetAllCities";
        this.datasharingService.showLoader();
        this.loading = true;
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
                    this.cityList=appData;
                    //this.stock.City=this.cityList[0];
                }
                this.datasharingService.hideLoader();
                this.loading = false;
            },
            err=>
            {
                console.log(err);
                // this.datasharingService.hideLoader();
                // this.loading = false;
            });
        }
        catch(ex)
        {
            console.log(ex);
            // this.datasharingService.hideLoader();
            // this.loading = false;
        }
    }

    onItemChange(newValue) {
        if(newValue > 0)
            this.stock.Item=this.itemList.find(x=>x.ItemID==newValue);
        else
            this.stock.Item = new Item();
        this.getStock();
    }

    onCityChange(newValue){
        if(newValue > 0)
            this.stock.City=this.cityList.find(x=>x.CityID==newValue);
        else
            this.stock.City = new City();
        this.getStock();
    }

    onChallanChange(newValue){
        this.stock.ChallanNumber = newValue;
        this.getStock();
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
