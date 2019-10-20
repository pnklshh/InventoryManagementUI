import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'; 
import { NgForm } from '@angular/forms';
import { Stock } from '../../../models/Stock';
import { ApiServiceCall } from '../../../service/api-call.service';
import { DatasharingService } from '../../../service/datasharing-service'; 
import {Item} from '../../../models/Item';
import { DatePipe, formatDate } from '../../../../../node_modules/@angular/common';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { City } from '../../../models/City';
import { AllocationDetail } from '../../../models/AllocationDetail';

@Component({
    selector: 'add-stock',
    templateUrl: './add-stock.component.html',
    styleUrls: ['./add-stock.component.scss']
})

export class AddStockComponent implements OnInit {

    @ViewChild('addstockform', {static: true}) form: NgForm;

    public errorAlert:boolean=false;
    public successAlert:boolean=false;
    public message:string="";
    public loading:boolean=true;

    public stock: Stock;
    public allocation: AllocationDetail = new AllocationDetail();
    public stockList: Stock[]=[];
    public itemList: Item[]=[];
    public cityList: City[]=[];
    public isAddPage: boolean = true;
    public isEditPage: boolean = false;
    public isReportDefectPage: boolean = false;
    public isFixDefectPage: boolean = false;
    public maxFixedQuantity:number;

    public todayDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        //new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd');
    public stockDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');

    constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService, private router: Router, private activatedRoute: ActivatedRoute){}
    
    ngOnInit()
    {
        this.datasharingService.showLoader();
        this.initializeForm();
        if(this.datasharingService.getUserDetail() == null)
        {
            this.router.navigate(['/auth/login']);
        }
        else
        {
            this.getItems();
            this.getCities();    
            if(this.activatedRoute.routeConfig.path != "addstock")
            {
                this.isAddPage = false;
                if(this.activatedRoute.routeConfig.path.includes("editstock"))
                    this.isEditPage = true;
                else if(this.activatedRoute.routeConfig.path.includes("reportdefect"))    
                    this.isReportDefectPage = true;
                else if(this.activatedRoute.routeConfig.path.includes("fixdefect"))   
                    this.isFixDefectPage = true;

                if(this.isFixDefectPage)
                {
                    this.activatedRoute.params.subscribe(param => {
                        this.allocation = JSON.parse(param["allocation"]);
                        this.maxFixedQuantity = this.allocation.QuantityAllocated;
                        this.stock.Quantity = this.maxFixedQuantity;    
                    });
                }    
                else
                {
                    this.activatedRoute.params.subscribe(param => {
                        this.stock = JSON.parse(param["stock"]);
                        this.maxFixedQuantity = JSON.parse(param["stock"]).Quantity;    
                    });
                }
            }
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
                    if(this.isAddPage)
                        this.stock.Item=this.itemList[0];
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
                    if(this.isAddPage || this.isReportDefectPage || this.isFixDefectPage)
                        this.stock.City=this.cityList[0];
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
        this.stock.Item=this.itemList.find(x=>x.ItemID==newValue);
    }

    onCityChange(newValue){
        this.stock.City=this.cityList.find(x=>x.CityID==newValue);
    }

    addStock()
    {
        let url = "";
        this.errorAlert = false;
        this.successAlert = false;
        let defective = this.stock.Defective;
        let dead = this.stock.Dead;
        this.stockDate = formatDate(this.stock.Date,'yyyy-MM-dd','en-US');
        
        if((this.stock.Quantity == 0) || (defective == 0 && this.isReportDefectPage) || (defective > this.stock.Quantity) || (dead > this.stock.Quantity) || (defective + dead > this.stock.Quantity) || (this.stockDate > this.todayDate))
        {
            this.displayMessage("Error","Please enter valid values in all fields");
        }
        else
        {
            let postData = null;
            if(this.isAddPage)
                url = "api/Stock/AddStock";
            else if(this.isEditPage)
                url = "api/Stock/UpdateStock";    
            else if(this.isReportDefectPage)
            {
                url = "api/Stock/AddStock";
                this.stock.Quantity = this.stock.Defective;
            }
            else if(this.isFixDefectPage)
            {
                url = "api/Engineer/FixDefect";
                this.allocation.QuantityAllocated = this.stock.Quantity;
                this.allocation.City = this.stock.City;
            }

            if(this.isFixDefectPage)
                postData = this.allocation;
            else
                postData = this.stock;    
            
            this.datasharingService.showLoader();
            this.loading = true;    
            try
            {    
                this.apiCall.PostData(url,JSON.stringify(postData)).subscribe(data=>
                {
                    data=JSON.parse(data);
                    if(data.ErrorMessage!=null && data.ErrorMessage!="")
                    {
                        this.displayMessage("Error",data.ErrorMessage);
                    }
                    else
                    {
                        if(this.isAddPage)
                            this.displayMessage("Success","Successfully added stock");
                        else if(this.isEditPage)
                            this.displayMessage("Success","Successfully updated stock");
                        else if(this.isReportDefectPage)
                            this.displayMessage("Success","Successfully reported defective stock");    
                        else if(this.isFixDefectPage)
                            this.displayMessage("Success","Repaired stock received successfully");            
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
        this.initializeForm();
        this.getItems();
        this.getCities();
    }

    initializeForm()
    {
        this.stock = new Stock();
        this.stock.Item = new Item();
        this.stock.City = new City();
        this.stock.Date=new Date(Date.now());
        this.stock.Defective=0;
        this.stock.Dead=0;
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
