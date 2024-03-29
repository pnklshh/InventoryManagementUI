import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { Usage } from '../../../models/Usage'
import { Stock } from '../../../models/Stock';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import { Subject } from 'rxjs';
import { Router } from '../../../../../node_modules/@angular/router';
import { DatasharingService } from '../../../service/datasharing-service';
import { Constant } from '../../../constants/Constants';

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
    public loading:boolean=true;

    public usageList:Usage[]=[];
    public role: string;

    constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService, private constant: Constant, private chRef: ChangeDetectorRef, private router: Router){}

    ngOnInit()
    {
        this.datasharingService.showLoader();
        if(this.datasharingService.getUserDetail() == null)
        {
            this.router.navigate(['/auth/login']);
        }
        else
        {
            this.role = this.datasharingService.getUserDetail().Role;
            this.viewUsage();
        }
    }

    viewUsage()
    {
        this.usageList = [];
        let url = "api/Usage/GetHistory";
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
                    this.usageList=appData;
                }

                this.dtOptions={
                    pagingType: 'full_numbers',
                    pageLength: 10,
                    paging: true,
                    stateSave: false,
                    destroy: true,
                    scrollX: true,
                    // columns: [{
                    //     title: 'Engineer name',
                    //     data: 'EngineerName',
                    // },
                    // {
                    //     title: 'Item name',
                    //     data: 'ItemName'
                    // },
                    // {
                    //     title: 'Quantity',
                    //     data: 'QuantityUsed'
                    // },
                    // {
                    //     title: 'Warranted',
                    //     data: 'Warranted'
                    // },
                    // {
                    //     title: 'Usage date',
                    //     data: 'UsageDate'
                    // },
                    // {
                    //     title: 'Bill number',
                    //     data: 'BillNumber'
                    // },
                    // {
                    //     title: 'Amount',
                    //     data: 'Amount'
                    // },
                    // {
                    //     title: 'Service charge',
                    //     data: 'ServiceCharge'
                    // },
                    // {
                    //     title: 'Party name',
                    //     data: 'PartyName'
                    // },
                    // {
                    //     title: 'City name',
                    //     data: 'CityName'
                    // },
                    // {
                    //     title: 'Actions'
                    // }
                    // ],
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

    editUsage(usage: Usage)
    {
        this.router.navigate(['/pages/editusage',JSON.stringify(usage)]);
    }

    deleteUsage(usageId: number)
    {
        //this.stockList=[];
        
        let url = "api/Usage/DeleteUsage?usageId=" + usageId;
        if(window.confirm("Are you sure you want to delete this usage ?" ))
        {
            this.datasharingService.showLoader();
            this.loading = true;
            try
            {
                this.apiCall.GetData(url).subscribe(data=>
                {
                    data=JSON.parse(data);
                    
                    if(data.ErrorMessage!=null && data.ErrorMessage!="")
                    {
                        this.displayMessage("Error",data.ErrorMessage);
                    }
                    else
                    {
                        this.displayMessage("Success","Usage deleted successfully");
                        this.viewUsage();
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

    }

    reportDefect(usage: Usage)
    {
        let stock = new Stock();
        stock.ChallanNumber = this.constant.Defective_ChallanNumber;
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
