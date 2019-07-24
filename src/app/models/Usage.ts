import {Engineer} from './Engineer';
import {Item} from './Item';
import { City } from './City';

export class Usage
{
    UsageID:number;
    Engineer:Engineer;
    Item:Item;
    QuantityUsed:number;
    Warranty:boolean;
    BillNumber:number;
    Amount:number;
    ServiceCharge:number;
    UsageDate:Date;
    Remarks:string;
    PartyName:string;
    City:City;
}