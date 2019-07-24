import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { Usage } from '../../../models/Usage'
import { Stock } from '../../../models/Stock';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import { Subject } from 'rxjs';
import { Router } from '../../../../../node_modules/@angular/router';
import { DatasharingService } from '../../../service/datasharing-service';

@Component({
    selector: 'view-usage',
    templateUrl: './view-usage.component.html',
    styleUrls: ['./view-usage.component.scss']
})

export class ViewUsageComponent implements OnInit {
    
    public columnDefs:DataTables.Settings={};
    public dtOptions:any={};
    public dtTrigger:Subject<any>=new Subject();

    public errorAlert:boolean=false;
    public successAlert:boolean=false;
    public message:string="";

    public usageList:Usage[]=[];

    constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService, private chRef: ChangeDetectorRef, private router: Router){}

    ngOnInit()
    {
        this.viewUsage();
    }

    viewUsage()
    {
        let url = "api/Usage/GetHistory";
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
                    this.usageList=appData;
                }

                this.dtOptions={
                    pagingType: 'full_numbers',
                    pageLength: 10,
                    paging: true,
                    stateSave: false,
                    destroy: true,
                    scrollX: true,
                    columns: [{
                        title: 'Engineer name',
                        data: 'EngineerName'
                    },
                    {
                        title: 'Item name',
                        data: 'ItemName'
                    },
                    {
                        title: 'Quantity',
                        data: 'QuantityUsed'
                    },
                    {
                        title: 'Warranted',
                        data: 'Warranted'
                    },
                    {
                        title: 'Usage date',
                        data: 'UsageDate'
                    },
                    {
                        title: 'Bill number',
                        data: 'BillNumber'
                    },
                    {
                        title: 'Amount',
                        data: 'Amount'
                    },
                    {
                        title: 'Service charge',
                        data: 'ServiceCharge'
                    },
                    {
                        title: 'Party name',
                        data: 'PartyName'
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
                            filename:'usage'
                        },
                        {
                            extend:'pdf',
                            filename:'usage'
                        },
                        'print'
                    ]
                };
                              
                this.chRef.detectChanges();
                this.dtTrigger.next();
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

    reportDefect(usage: Usage)
    {
        let stock = new Stock();
        stock.ChallanNumber = "RTN";
        stock.City = null;
        stock.Date = new Date(Date.now());
        stock.Dead = 0;
        stock.Defective = usage.QuantityUsed;
        stock.Item = usage.Item;
        stock.Quantity = usage.QuantityUsed;
        this.router.navigate(['/pages/reportdefect',JSON.stringify(stock)]);
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
