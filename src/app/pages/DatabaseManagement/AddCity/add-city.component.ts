import { Component, OnInit } from '@angular/core'; 

import { Stock } from '../../../models/Stock';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import { DatePipe, formatDate } from '../../../../../node_modules/@angular/common';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { City } from '../../../models/City';
import { DatasharingService } from '../../../service/datasharing-service';

@Component({
    selector: 'add-city',
    templateUrl: './add-city.component.html',
    styleUrls: ['./add-city.component.scss']
})

export class AddCityComponent implements OnInit {

    public errorAlert:boolean=false;
    public successAlert:boolean=false;
    public message:string="";
    public loading:boolean=false;
    
    public city:City = new City();
    public isAddPage: boolean = true;
    
    public todayDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        //new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd');

    constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService, private router: Router, private activatedRoute: ActivatedRoute){}

    ngOnInit()
    {
        if(this.datasharingService.getUserDetail() == null)
        {
            this.datasharingService.showLoader();
            this.loading = true;
            this.router.navigate(['/auth/login']);
        }
        else
        {
            if(this.activatedRoute.routeConfig.path != "addcity")
            {
                this.isAddPage = false;
                this.activatedRoute.params.subscribe(param => {
                    this.city = JSON.parse(param["city"]);
                });
            }
        }
    }

    addCity()
    {
        let url = "";
        this.errorAlert = false;
        this.successAlert = false;
        
        if(this.isAddPage)
            url = "api/City/AddCity";
        else
            url = "api/City/UpdateCity";    

        this.datasharingService.showLoader();
        this.loading = true;
        try
        {
            this.apiCall.PostData(url,JSON.stringify(this.city)).subscribe(data=>
            {
                data=JSON.parse(data);
                if(data.ErrorMessage!=null && data.ErrorMessage!="")
                {
                    this.displayMessage("Error",data.ErrorMessage);
                }
                else
                {
                    if(this.isAddPage)
                        this.displayMessage("Success","Successfully added city");
                    else
                        this.displayMessage("Success","Successfully updated city");
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
