
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
        return !item.deleted && item.complete && item.manualBudget && item.manualBudget.length > 0 && item.manualBudget[0].year < 2022;
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