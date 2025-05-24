import { computed, signal } from "@angular/core";

type SelectionModel<T> = {
    selected: () => T[];
    select: (item: T) => void;
    deselect: (item: T) => void;
    clear: () => void;
    toggle: (item: T) => void;
    selectAll: () => void;
    isSelected: (item: T) => boolean;
    isAllSelected: () => boolean;
}

export function createSelectionModel<T>(items: T[], initialSelection: T[] = []): SelectionModel<T> {
    const selectedSignal = signal(initialSelection);

    return {
        selected: () => selectedSignal(),
        select: (item: T) => selectedSignal.set(
            selectedSignal().includes(item) ? selectedSignal().filter((i) => i !== item) : [...selectedSignal(), item]
        ),
        deselect: (item: T) => selectedSignal.set(selectedSignal().filter((i) => i !== item)),
        clear: () => selectedSignal.set([]),
        toggle: (item: T) => selectedSignal.set(
            selectedSignal().includes(item) ? selectedSignal().filter((i) => i !== item) : [...selectedSignal(), item]
        ),
        selectAll: () => selectedSignal.set(items.length === selectedSignal().length ? [] : items),
        isSelected: (item: T) => computed(() => selectedSignal().includes(item))(),
        isAllSelected: () => computed(() => items.length === selectedSignal().length)(),
    };
}
