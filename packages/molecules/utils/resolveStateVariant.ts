// src/utils/stateVariants.ts
type StateConditions = Record<string, boolean>;
type StatePriority = Array<string>;

export const resolveStateVariant = (
    conditions: StateConditions,
    priority?: StatePriority,
): string => {
    if (priority) {
        for (const state of priority) {
            if (conditions[state]) {
                return state;
            }
        }
    } else {
        const activeStates = Object.entries(conditions)
            .filter(([_, isActive]) => isActive)
            .map(([stateName]) => stateName);

        if (activeStates.length > 0) {
            return activeStates[0];
        }
    }

    return 'default';
};
