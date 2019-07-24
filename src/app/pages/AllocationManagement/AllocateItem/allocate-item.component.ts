import { Component, OnInit } from '@angular/core'; 
import { AllocationDetail } from '../../../models/AllocationDetail';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import { Engineer } from '../../../models/Engineer';
import {Item} from '../../../models/Item';
import {City} from '../../../models/City';
import { DatePipe, formatDate } from '../../../../../node_modules/@angular/common';
import { DatasharingService } from '../../../service/datasharing-service';

@Component({
    selector: 'allocate-item',
    templateUrl: './allocate-item.component.html',
    styleUrls: ['./allocate-item.component.scss']
})

export class AllocateItemComponent implements OnInit {

    public errorAlert:boolean=false;
    public successAlert:boolean=false;
    public message:string="";

    public allocationDetail: AllocationDetail = new AllocationDetail();
    public engineer: Engineer=new Engineer();
    public engineerList: Engineer[]=[];
    public item:Item=new Item();
    public itemList: Item[]=[];
    public cityList: City[]=[];
    
    public todayDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        //new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd');
    public allocationDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        

    constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService){}

    
    ngOnInit()
    {
        this.allocationDetail.AllocationDate=new Date(Date.now());
        this.allocationDetail.Engineer=this.engineer;
        this.allocationDetail.Item=this.item;
        this.getEngineers();
        this.getItems();   
        this.getCities();
    }

    getEngineers()
    {
        let url = "api/Engineer/GetAllEngineers";
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
                    this.engineerList=appData;
                    this.allocationDetail.Engineer=this.engineerList[0];
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

    getItems()
    {
        let url = "api/Item/GetAllItems";
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
                    this.itemList=appData;
                    console.log("itemList");
                    console.log(this.itemList);
                    this.allocationDetail.Item=this.itemList[0];
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

    getCities()
    {
        let url = "api/City/GetAllCities";
        
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
                    this.allocationDetail.City=this.cityList[0];
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
            let url = "api/Engineer/AllocateItem";
            this.datasharingService.showLoader();
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
                        this.displayMessage("Success","Successfully allocated stock");
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
