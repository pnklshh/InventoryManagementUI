import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core'; 

import { City } from '../../../models/City';
import { ApiServiceCall } from '../../../service/api-call.service'; 
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';

@Component({
    selector: 'view-cities',
    templateUrl: './view-cities.component.html',
    styleUrls: ['./view-cities.component.scss']
})

export class ViewCitiesComponent implements OnInit {
    @ViewChild(DataTableDirective, { static: true })
    public datatableElement:DataTableDirective;

    public columnDefs:DataTables.Settings={};
    public dtOptions:any={};
    public dtTrigger:Subject<any>=new Subject();

    public errorAlert:boolean=false;
    public successAlert:boolean=false;
    public message:string="";

    public cityList:City[]=[];

    constructor(private apiCall: ApiServiceCall, private chRef: ChangeDetectorRef, private router: Router){}

    ngOnInit()
    {
        this.getCities();
    }

    getCities()
    {
        let url = "api/City/GetAllCities";
        this.cityList=[];
        try
        {
            this.apiCall.GetData(url).subscribe(data=>
            {
                console.log(JSON.parse(data));
                data=JSON.parse(data);
                let appData=JSON.parse(data.AppData);
                
                if(data.ErrorMessage!=null && data.ErrorMessage!="")
                {
                    this.displayMessage("Error",data.ErrorMessage);
                }
                else
                {
                    this.cityList=appData;
                }

                this.dtOptions={
                    pagingType: 'full_numbers',
                    pageLength: 10,
                    paging: true,
                    stateSave: false,
                    destroy: true,
                    columns: [{
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
                            filename:'cities'
                        },
                        {
                            extend:'pdf',
                            filename:'cities'
                        },
                        'print'
                    ]
                };
                
                //this.rerender();                
                this.chRef.detectChanges();
                this.dtTrigger.next();
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
    
    editCity(city: City)
    {
        this.router.navigate(['/pages/editcity',JSON.stringify(city)]);
    }

    deleteCity(cityId: number, cityName: string)
    {
        //this.stockList=[];
        
        let url = "api/City/DeleteCity?cityId=" + cityId;
        if(window.confirm("Are you sure you want to delete this city ?" ))
        {
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
                        this.displayMessage("Success","City deleted successfully");
                        this.getCities();
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

    rerender(): void
    {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.clear().draw();
            this.dtTrigger.next();
        });
    }

    // ngAfterViewInit()
    // {
    //     this.dtOptions={
    //         pagingType: 'full_numbers',
    //         pageLength: 10,
    //         paging: true,
    //         stateSave: false,
    //         destroy: true,
    //         columns: [{
    //             title: 'Item name',
    //             data: 'ItemName'
    //         },
    //         {
    //             title: 'Quantity',
    //             data: 'Quantity'
    //         },
    //         {
    //             title: 'Defective',
    //             data: 'Defective'
    //         },
    //         {
    //             title: 'Dead',
    //             data: 'Dead'
    //         },
    //         {
    //             title: 'Challan number',
    //             data: 'ChallanNumber'
    //         },
    //         {
    //             title: 'Date',
    //             data: 'Date'
    //         },
    //         {
    //             title: 'City name',
    //             data: 'CityName'
    //         },
    //         {
    //             title: 'Actions'
    //         }
    //         ]
    //     };

    //     this.dtTrigger.next();
    // }

}
