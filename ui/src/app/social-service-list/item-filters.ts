import { MAX_YEAR } from '../social-service-editor/social-service-utils';
export class ItemFilter {
    public condition(item: any): boolean {
        return true;
    }

    public filter(items: any[]): any[] {
        return items.filter(
            (item: any) => (!item.item || this.condition(item.item))
        );
    }
}

export class ItemFilterActive extends ItemFilter {
    public condition(item: any): boolean {
        return !item.deleted;
    }
}

export class ItemFilterPublished extends ItemFilter {
    public condition(item: any): boolean {
        return !item.deleted && !item.keepPrivate;
    }
}

export class ItemFilterUpdateNeeded extends ItemFilter {
    public condition(item: any): boolean {
        // const tenders = item.tenders || [];
        const manualBudget = (item.manualBudget || []).filter(x => x.approved || x.executed);
        const beneficiaries = (item.beneficiaries || []).filter(x => x.num_beneficiaries);
        const updated = (
          manualBudget.length > 0 && manualBudget[0].year >= MAX_YEAR &&
          beneficiaries.length > 0 && beneficiaries[0].year >= MAX_YEAR
        );
        return !item.deleted && item.complete && !updated;
    }
}

export class ItemFilterWIP extends ItemFilter {
    public condition(item: any): boolean {
        return !item.complete && !item.deleted;;
    }
}

export class ItemFilterComplete extends ItemFilter {
    public condition(item: any): boolean {
        return !!item.complete;
    }
}

export class ItemFilterInactive extends ItemFilter {
    public condition(item: any): boolean {
        return !!item.deleted;
    }
}

export const FILTERS = {
    all: new ItemFilter(),
    active: new ItemFilterActive(),
    published: new ItemFilterPublished(),
    updateNeeded: new ItemFilterUpdateNeeded(),
    wip: new ItemFilterWIP(),
    complete: new ItemFilterComplete(),
    inactive: new ItemFilterInactive(),
};