import { Component, OnInit } from '@angular/core'; 

import { Stock } from '../../../models/Stock';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import {Item} from '../../../models/Item';
import { DatePipe, formatDate } from '../../../../../node_modules/@angular/common';
import { ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { City } from '../../../models/City';
import { Group } from '../../../models/Group';

@Component({
    selector: 'add-item',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.scss']
})

export class AddItemComponent implements OnInit {

    public errorAlert:boolean=false;
    public successAlert:boolean=false;
    public message:string="";
    
    public item:Item = new Item();
    public city:City = new City();
    public group:Group = new Group();
    public groupList:Group[]=[];
    public isAddPage: boolean = true;
    
    public todayDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        //new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd');

    constructor(private apiCall: ApiServiceCall, private activatedRoute: ActivatedRoute){}

    
    ngOnInit()
    {
        if(this.activatedRoute.routeConfig.path != "additem")
        {
            this.isAddPage = false;
            this.activatedRoute.params.subscribe(param => {
                this.item = JSON.parse(param["item"]);
            });
        }
        this.getGroups();
    }

    getGroups()
    {
        let url = "api/Group/GetAllGroups";
        
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
                    this.groupList=appData;
                    console.log("groupList");
                    console.log(this.groupList);
                    this.item.ItemGroup=this.groupList[0];
                }
            },
            err=>
            {
                console.log(err);
            });
        }
        catch(ex)
        {
            console.log(ex);
        }
    }


    addItem()
    {
        let url = "";
        this.errorAlert = false;
        this.successAlert = false;
        
        console.log(JSON.stringify(this.item));
        if(this.isAddPage)
            url = "api/Item/AddItem";
        else
            url = "api/Item/UpdateItem";    

        try
        {
            this.apiCall.PostData(url,JSON.stringify(this.item)).subscribe(data=>
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
                        this.displayMessage("Success","Successfully added item");
                    else
                        this.displayMessage("Success","Successfully updated item");
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

    onGroupChange(newValue) {
        console.log(newValue);
        this.item.ItemGroup =this.groupList.find(x=>x.GroupID==newValue);
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
