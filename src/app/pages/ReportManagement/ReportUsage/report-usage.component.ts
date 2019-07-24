import { Component, OnInit } from '@angular/core'; 
import { Usage } from '../../../models/Usage';
import { Engineer } from '../../../models/Engineer';
import {Item} from '../../../models/Item';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import { DatePipe, formatDate } from '../../../../../node_modules/@angular/common';
import { City } from '../../../models/City';
import { DatasharingService } from '../../../service/datasharing-service';

@Component({
    selector: 'report-usage',
    templateUrl: './report-usage.component.html',
    styleUrls: ['./report-usage.component.scss']
})

export class ReportUsageComponent implements OnInit {

    public errorAlert:boolean=false;
    public successAlert:boolean=false;
    public message:string="";

    public usageDetail: Usage = new Usage();
    public engineer: Engineer=new Engineer();
    public city: City = new City();
    public engineerList: Engineer[]=[];
    public item:Item=new Item();
    public itemList: Item[]=[];
    public cityList: City[]=[];

    public todayDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        //new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd');
    public usageDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        

    constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService){}

    ngOnInit()
    {
        this.usageDetail.UsageDate=new Date(Date.now());
        this.usageDetail.Warranty=true;
        this.usageDetail.Engineer=this.engineer;
        this.usageDetail.Item=this.item;
        this.usageDetail.City=this.city;
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
                    this.usageDetail.Engineer=this.engineerList[0];
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
                    this.usageDetail.Item=this.itemList[0];
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
                    this.cityList=appData;
                    this.usageDetail.City=this.cityList[0];
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

    reportUsage()
    {
        this.errorAlert = false;
        this.successAlert = false;
        this.usageDate = formatDate(this.usageDetail.UsageDate,'yyyy-MM-dd','en-US');

        if((this.usageDetail.QuantityUsed == 0) || (this.usageDate > this.todayDate))
        {
            this.displayMessage("Error","Please enter valid values in all fields");
        }
        else
        {
            let url = "api/Usage/ReportUsage";
            this.datasharingService.showLoader();
            try
            {
                this.apiCall.PostData(url,JSON.stringify(this.usageDetail)).subscribe(data=>
                {
                    data=JSON.parse(data);
                    if(data.ErrorMessage!=null && data.ErrorMessage!="")
                    {
                        this.displayMessage("Error",data.ErrorMessage);
                    }
                    else
                    {
                        this.displayMessage("Success","Successfully reported usage");
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
        this.usageDetail.Engineer=this.engineerList.find(x=>x.EngineerID==newValue)   
    }

    onItemChange(newValue) {
        this.usageDetail.Item=this.itemList.find(x=>x.ItemID==newValue);
    }

    onCityChange(newValue){
        this.usageDetail.City=this.cityList.find(x=>x.CityID==newValue);
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
