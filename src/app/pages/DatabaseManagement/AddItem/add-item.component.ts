import { Component, OnInit } from '@angular/core'; 

import { Stock } from '../../../models/Stock';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import {Item} from '../../../models/Item';
import { DatePipe, formatDate } from '../../../../../node_modules/@angular/common';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { City } from '../../../models/City';
import { Group } from '../../../models/Group';
import { DatasharingService } from '../../../service/datasharing-service';

@Component({
    selector: 'add-item',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.scss']
})

export class AddItemComponent implements OnInit {

    public errorAlert:boolean=false;
    public successAlert:boolean=false;
    public message:string="";
    public loading:boolean=true;
    
    public item: Item;
    public groupList:Group[]=[];
    public isAddPage: boolean = true;

    options = [1,2,3];
    //     { value: 1, name: '1' },
    //     { value: 2, name: '2' },
    //     { value: 3, name: '3' },
    // ];
    
    public selectedOption;
        
    public todayDate:string=formatDate(new Date(),'yyyy-MM-dd','en-US');        //new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd');

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
            this.getGroups();
            if(this.activatedRoute.routeConfig.path != "additem")
            {
                this.isAddPage = false;
                this.activatedRoute.params.subscribe(param => {
                    this.item = JSON.parse(param["item"]);
                });
            }  
        } 
    }

    initializeForm()
    {
        this.item = new Item();
        this.item.ItemGroup = new Group();
    }

    getGroups()
    {
        let url = "api/Group/GetAllGroups";
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
                    this.groupList=appData;
                    this.item.ItemGroup=this.groupList[0];
                }
                this.datasharingService.hideLoader();
                this.loading = false;
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
        
        if(this.isAddPage)
            url = "api/Item/AddItem";
        else
            url = "api/Item/UpdateItem";    

        this.datasharingService.showLoader();
        this.loading = true;
        try
        {
            this.apiCall.PostData(url,JSON.stringify(this.item)).subscribe(data=>
            {
                data=JSON.parse(data);
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
                this.datasharingService.hideLoader();
                this.loading = false;
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
        this.initializeForm();
        this.getGroups();
    }

    onGroupChange(newValue) {
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
