import {Engineer} from './Engineer';
import {Item} from './Item';
import {City} from './City';

export class AllocationDetail
{
    AllocationID:number;
    Engineer:Engineer;
    Item:Item;
    QuantityAllocated:number;
    City:City;
    AllocationDate:Date;
}