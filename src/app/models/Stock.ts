import {Item} from './Item';
import { City } from './City';

export class Stock
{
    StockID:number;
    Item:Item;
    Quantity:number;
    Defective:number;
    Dead:number;
    Date:Date;
    City:City;
    ChallanNumber:string;
}