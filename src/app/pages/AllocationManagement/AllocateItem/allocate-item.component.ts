import { Component, OnInit } from '@angular/core'; 
import { AllocationDetail } from '../../../models/AllocationDetail';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import { Engineer } from '../../../models/Engineer';
import {Item} from '../../../models/Item';
import {City} from '../../../models/City';
import { DatePipe, formatDate } from '../../../../../node_modules/@angular/common';
import { DatasharingService } from '../../../service/datasharing-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'allocate-item',
    templateUrl: './allocate-item.component.html',
    styleUrls: ['./allocate-item.component.scss']
})

export class AllocateItemComponent implements OnInit {

    public errorAlert:boolean=false;
    public successAlert:boolean=false;
    public message:string="";
    public loading:boolean=true;
    public isAddPage: boolean = true;

    public allocationDetail: AllocationDetail;
    public engineer: Engineer;
    public item: Item;
    public city: City;

    public engineerList: Engineer[]=[];
    public itemList: Item[]=[];
    public cityList: City[]=[];
    
    public todayDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        //new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd');
    public allocationDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        

    constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService, private router: Router,private activatedRoute: ActivatedRoute){}

    
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
            this.getEngineers();
            this.getItems();   
            this.getCities();
            if(this.activatedRoute.routeConfig.path != "allocateitem")
            {
                this.isAddPage = false;
                this.activatedRoute.params.subscribe(param => {
                    this.allocationDetail = JSON.parse(param["allocation"]);
                });
            }
        }       
    }

    initializeForm()
    {
        this.allocationDetail = new AllocationDetail();
        this.allocationDetail.AllocationDate = new Date(Date.now());
        this.allocationDetail.Engineer = new Engineer();
        this.allocationDetail.Item = new Item();
        this.allocationDetail.City = new City();
    }

    getEngineers()
    {
        let url = "api/Engineer/GetAllEngineers";
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
                    this.engineerList=appData;
                    if(this.isAddPage)
                        this.allocationDetail.Engineer=this.engineerList[0];
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
                    if(this.isAddPage)
                        this.allocationDetail.Item=this.itemList[0];
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
                    if(this.isAddPage)
                        this.allocationDetail.City=this.cityList[0];
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

    allocateItem()
    {
        this.errorAlert = false;
        this.successAlert = false;
        this.allocationDate = formatDate(this.allocationDetail.AllocationDate,'yyyy-MM-dd','en-US');

        if((this.allocationDetail.QuantityAllocated == 0) || (this.allocationDate > this.todayDate))
        {
            this.displayMessage("Error","Please enter valid values in all fields");
        }
        else
        {
            let url = "";
            if(this.isAddPage)
                url = "api/Engineer/AllocateItem";
            else
                url = "api/Engineer/UpdateAllocation";    

            this.datasharingService.showLoader();
            this.loading = true;
            try
            {
                this.apiCall.PostData(url,JSON.stringify(this.allocationDetail)).subscribe(data=>
                {
                    data=JSON.parse(data);
                    if(data.ErrorMessage!=null && data.ErrorMessage!="")
                    {
                        this.displayMessage("Error",data.ErrorMessage);
                    }
                    else
                    {
                        if(this.isAddPage)
                            this.displayMessage("Success","Successfully allocated item");
                        else
                            this.displayMessage("Success","Successfully updated allocation");
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
        // this.initializeForm();
        // this.getEngineers();
        // this.getItems();   
        // this.getCities();
    }

    onEngineerChange(newValue) {
        this.allocationDetail.Engineer=this.engineerList.find(x=>x.EngineerID==newValue)   
    }

    onItemChange(newValue) {
        this.allocationDetail.Item=this.itemList.find(x=>x.ItemID==newValue);
    }

    onCityChange(newValue){
        this.allocationDetail.City=this.cityList.find(x=>x.CityID==newValue);
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
