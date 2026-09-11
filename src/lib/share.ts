import type { NameEntry } from '../types';

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function meaningLine(n: Pick<NameEntry, 'meaning' | 'hiddenMeaning'>): string {
  return (n.hiddenMeaning || n.meaning || '').trim();
}

/** Single-name share caption (COPY-share-privacy.md). */
export function shareCaptionSingle(name: Pick<NameEntry, 'name' | 'meaning' | 'hiddenMeaning'>): string {
  return `${name.name} — ${meaningLine(name)}\n\nFound on Namey`;
}

/**
 * Favourites multi-name caption.
 * Cap at 5 lines; if more, end with +{N} more before footer.
 */
export function shareCaptionFavourites(
  names: Array<Pick<NameEntry, 'name' | 'meaning' | 'hiddenMeaning'>>,
): string {
  const cap = 5;
  const lines = names.slice(0, cap).map((n) => `${n.name} — ${meaningLine(n)}`);
  const extra = names.length - cap;
  const body = ['Our shortlist:', ...lines];
  if (extra > 0) body.push(`+${extra} more`);
  body.push('', 'Found on Namey');
  return body.join('\n');
}

/** @deprecated use shareCaptionSingle / shareCaptionFavourites */
export function shareCaption(names: string[]): string {
  return `Name ideas from Namey\n${names.slice(0, 5).join(', ')}`;
}

export async function shareOrCopy(text: string, title = 'Namey'): Promise<'shared' | 'copied' | 'failed'> {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ title, text });
      return 'shared';
    }
  } catch (err) {
    // User cancelled share — don't fall through as failure noise
    if (err instanceof DOMException && err.name === 'AbortError') return 'failed';
  }
  const ok = await copyText(text);
  return ok ? 'copied' : 'failed';
}
