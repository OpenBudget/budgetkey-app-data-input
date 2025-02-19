import { MAX_YEAR } from '../../social-service-editor/social-service-utils';

export class ItemMeasurementFilter {
    public condition(item: any): boolean {
        return true;
    }

    public filter(items: any[]): any[] {
        return items.filter(
            (item: any) => (!item.item || this.condition(item.item))
        );
    }
}

export class ItemMeasurementFlagFilter extends ItemMeasurementFilter {
    public condition(item: any): boolean {
        return item.tender.tqs.flag === 'yes';
    }
}

export class ItemMeasurementBaseFilter extends ItemMeasurementFilter {
    public condition(item: any): boolean {
        return item.tender.tqs.flag === 'no';
    }
}

export const FILTERS = {
    all: new ItemMeasurementFilter(),
    base: new ItemMeasurementBaseFilter(),
    flag: new ItemMeasurementFlagFilter(),
};