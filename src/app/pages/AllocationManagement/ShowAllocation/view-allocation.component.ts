import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { AllocationDetail } from '../../../models/AllocationDetail';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import {Subject} from 'rxjs';
import { Router } from '../../../../../node_modules/@angular/router';
import { DatasharingService } from '../../../service/datasharing-service';

@Component({
    selector: 'view-allocation',
    templateUrl: './view-allocation.component.html',
    styleUrls: ['./view-allocation.component.scss']
})

export class ViewAllocationComponent implements OnInit {

    public columnDefs: DataTables.Settings = {};
    public dtOptions: any = {};
    public dtTrigger: Subject<any> = new Subject();

    public errorAlert: boolean = false;
    public successAlert: boolean = false;
    public message: string = "";
    public loading: boolean = true;

    public allocationList: AllocationDetail[] = [];
    public role: string;

    constructor(private apiCall: ApiServiceCall, private datasharingService: DatasharingService, private chRef: ChangeDetectorRef, private router: Router){}

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
            this.showAllocations();
        }
    }

    showAllocations()
    {
        this.allocationList = [];
        let url = "api/Engineer/GetAllocations";
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
                    this.allocationList=appData;
                }

                this.dtOptions={
                    pagingType: 'full_numbers',
                    pageLength: 10,
                    paging: true,
                    stateSave: false,
                    destroy: true,
                    columns: [{
                        title: 'Engineer name',
                        data: 'EngineerName'
                    },
                    {
                        title: 'Item name',
                        data: 'ItemName'
                    },
                    {
                        title: 'Quantity allocated',
                        data: 'QuantityAllocated'
                    },
                    {
                        title: 'Allocation date',
                        data: 'AllocationDate'
                    },
                    {
                        title:'Actions'
                    }
                    ],
                    dom:'Bfrtip',
                    buttons:[
                        {
                            extend:'excel',
                            filename:'allocation'
                        },
                        {
                            extend:'pdf',
                            filename:'allocation'
                        },
                        'print'
                    ]
                };
                
                //this.rerender();                
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

    editAllocation(allocation: AllocationDetail)
    {
        this.router.navigate(['/pages/editallocation',JSON.stringify(allocation)]);
    }

    deleteAllocation(allocationId: number)
    {
        //this.stockList=[];
        
        let url = "api/Engineer/DeleteAllocation?allocationId=" + allocationId;
        if(window.confirm("Are you sure you want to delete this allocation ?" ))
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
                        this.displayMessage("Success","Allocation deleted successfully");
                        this.showAllocations();
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

    fixDefect(allocation: AllocationDetail)
    {
        this.router.navigate(['/pages/fixdefect',JSON.stringify(allocation)]);
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
