import { Component, OnInit } from '@angular/core'; 
import { Usage } from '../../../models/Usage';
import { Engineer } from '../../../models/Engineer';
import {Item} from '../../../models/Item';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import { DatePipe, formatDate } from '../../../../../node_modules/@angular/common';
import { City } from '../../../models/City';
import { DatasharingService } from '../../../service/datasharing-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'report-usage',
    templateUrl: './report-usage.component.html',
    styleUrls: ['./report-usage.component.scss']
})

export class ReportUsageComponent implements OnInit {

    public errorAlert:boolean=false;
    public successAlert:boolean=false;
    public message:string="";
    public loading:boolean=true;
    public isAddPage: boolean = true;

    public usageDetail: Usage;
    
    public engineerList: Engineer[]=[];
    public itemList: Item[]=[];
    public cityList: City[]=[];

    public todayDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        //new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd');
    public usageDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        

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
            this.getEngineers();
            this.getItems();
            this.getCities();
            if(this.activatedRoute.routeConfig.path != "reportusage")
            {
                this.isAddPage = false;
                this.activatedRoute.params.subscribe(param => {
                    this.usageDetail = JSON.parse(param["usage"]);
                    console.log(this.usageDetail);
                });
            }
        }
    }

    initializeForm()
    {
        this.usageDetail = new Usage();
        this.usageDetail.UsageDate=new Date(Date.now());
        this.usageDetail.Warranty=true;
        this.usageDetail.Engineer = new Engineer();
        this.usageDetail.Item = new Item();
        this.usageDetail.City = new City();
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
                        this.usageDetail.Engineer=this.engineerList[0];
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
                        this.usageDetail.Item=this.itemList[0];
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
                        this.usageDetail.City=this.cityList[0];
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
            let url = ""
            if(this.isAddPage)
                url = "api/Usage/ReportUsage";
            else
                url = "api/Usage/UpdateUsage";    

            this.datasharingService.showLoader();
            this.loading = true;
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
                        if(this.isAddPage)
                            this.displayMessage("Success","Successfully reported usage");
                        else
                            this.displayMessage("Success","Successfully updated usage");
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
        this.getEngineers();
        this.getItems();
        this.getCities();
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
