// Small helpers shared by the behaviour modules (browser only).
export type Cleanup = () => void;

export const byId = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T | null;
export const qs = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector(sel) as T | null;
export const qsa = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll(sel)) as T[];
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)");

/** addEventListener that hands back its own removal. */
export function on<K extends keyof WindowEventMap>(t: Window, type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions): Cleanup;
export function on<K extends keyof DocumentEventMap>(t: Document, type: K, fn: (e: DocumentEventMap[K]) => void, opts?: AddEventListenerOptions): Cleanup;
export function on<K extends keyof HTMLElementEventMap>(t: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions): Cleanup;
export function on(t: EventTarget, type: string, fn: (e: Event) => void, opts?: AddEventListenerOptions): Cleanup {
  t.addEventListener(type, fn, opts);
  return () => t.removeEventListener(type, fn, opts);
}

export function runAll(list: (Cleanup | void | undefined | null)[]): Cleanup {
  return () => list.forEach((c) => { try { if (c) c(); } catch { /* ignore */ } });
}
