import type { Shortcut, ShortcutEventDetail } from '../types';

export type ShortcutCallbackArgs = ShortcutEventDetail & { shortcut: Shortcut; event: CustomEvent };
