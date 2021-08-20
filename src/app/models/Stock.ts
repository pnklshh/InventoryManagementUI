import {Item} from './Item';
import { City } from './City';

export class Stock
{
    StockID:number;
    Item:Item;
    Quantity:number;
    Defective:number = 0;
    Dead:number = 0;
    Date:Date = new Date(Date.now());
    City:City;
    ChallanNumber:string = "0";
}