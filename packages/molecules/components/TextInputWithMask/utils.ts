const splitCharacters = ['-', '/', '.', '年', ' '];

export function detectCharacter(mask: string): string {
    const c = splitCharacters.find(ch => mask.includes(ch));
    return c || '';
}

// TODO - make it more universal
export function enhanceTextWithMask(text: string, mask: string, previousValue: string): string {
    const isBackSpace = previousValue.length > text.length;
    const splitCharacter = detectCharacter(mask);

    const maskParts = mask.split(splitCharacter);
    const textParts = text.split(splitCharacter);

    const finalString: string[] = [];
    for (let maskPartIndex = 0; maskPartIndex < mask.length; maskPartIndex++) {
        const partString: string[] = [];

        const maskPart = maskParts[maskPartIndex];
        const textPart = textParts[maskPartIndex];
        if (!textPart) {
            continue;
        }

        for (let maskDigitIndex = 0; maskDigitIndex < maskPart.length; maskDigitIndex++) {
            const currentCharacter = textPart[maskDigitIndex];

            if (isBackSpace && currentCharacter === undefined) {
                continue;
            }

            const character = textPart[maskDigitIndex];

            if (character !== undefined) {
                partString.push(character);
            }
        }

        finalString.push(partString.join(''));
    }

    const lastPart = finalString[finalString.length - 1];
    const lastMaskPart = maskParts[finalString.length - 1];
    if (
        // if mask is completed
        finalString.length !== maskParts.length &&
        // or ...
        lastPart &&
        lastMaskPart &&
        lastPart.length === lastMaskPart.length
    ) {
        return finalString.join(splitCharacter) + (isBackSpace ? '' : splitCharacter);
    }
    return finalString.join(splitCharacter);
}
