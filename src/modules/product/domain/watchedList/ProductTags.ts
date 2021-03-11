import { WatchedList } from "../../../../shared/domain/WatchedList";

export class ProductTags extends WatchedList<any> {
    compareItems(a: any, b: any): boolean {
        throw new Error("Method not implemented.");
    }
}