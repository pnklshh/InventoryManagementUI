import { Component, OnInit } from '@angular/core'; 

import { Stock } from '../../../models/Stock';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import { DatePipe, formatDate } from '../../../../../node_modules/@angular/common';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { Engineer } from '../../../models/Engineer';

@Component({
    selector: 'add-engineer',
    templateUrl: './add-engineer.component.html',
    styleUrls: ['./add-engineer.component.scss']
})

export class AddEngineerComponent implements OnInit {

    public errorAlert:boolean=false;
    public successAlert:boolean=false;
    public message:string="";
    
    public engineer:Engineer = new Engineer();
    public isAddPage: boolean = true;
    
    public todayDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        //new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd');

    constructor(private apiCall: ApiServiceCall, private activatedRoute: ActivatedRoute){}

    
    ngOnInit()
    {
        if(this.activatedRoute.routeConfig.path != "addengineer")
        {
            this.isAddPage = false;
            this.activatedRoute.params.subscribe(param => {
                this.engineer = JSON.parse(param["engineer"]);
            });
        }
    }

    addEngineer()
    {
        let url = "";
        this.errorAlert = false;
        this.successAlert = false;
        
        console.log(JSON.stringify(this.engineer));
        if(this.isAddPage)
            url = "api/Engineer/AddEngineer";
        else
            url = "api/Engineer/UpdateEngineer";    

        try
        {
            this.apiCall.PostData(url,JSON.stringify(this.engineer)).subscribe(data=>
            {
                data=JSON.parse(data);
                console.log(data);
                if(data.ErrorMessage!=null && data.ErrorMessage!="")
                {
                    this.displayMessage("Error",data.ErrorMessage);
                }
                else
                {
                    if(this.isAddPage)
                        this.displayMessage("Success","Successfully added engineer");
                    else
                        this.displayMessage("Success","Successfully updated engineer");
                }
            },
            err=>
            {
                console.log(err);
                console.log("err");
            });
        }
        catch(ex)
        {
            console.log(ex);
            console.log("catch");
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
