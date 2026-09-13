// QTPay Live DOM Localization & Auto-Translation Engine
import { DICTIONARY, type SupportedLanguage } from './i18n';

// Symbol / property on Text nodes to preserve original English string
const ORIG_TEXT_PROP = '__qtpay_orig_text__';
const ORIG_PLACEHOLDER_PROP = '__qtpay_orig_placeholder__';

let activeObserver: MutationObserver | null = null;
let currentLanguage: SupportedLanguage = 'English';

function translateString(str: string, lang: SupportedLanguage): string {
  if (!str || lang === 'English') return str;
  const trimmed = str.trim();
  
  if (DICTIONARY[trimmed] && DICTIONARY[trimmed][lang]) {
    // Preserve leading / trailing whitespace
    const leading = str.match(/^\s*/)?.[0] || '';
    const trailing = str.match(/\s*$/)?.[0] || '';
    return leading + DICTIONARY[trimmed][lang] + trailing;
  }

  // Check case-insensitive match
  const found = Object.keys(DICTIONARY).find(
    (k) => k.toLowerCase() === trimmed.toLowerCase()
  );
  if (found && DICTIONARY[found][lang]) {
    const leading = str.match(/^\s*/)?.[0] || '';
    const trailing = str.match(/\s*$/)?.[0] || '';
    return leading + DICTIONARY[found][lang] + trailing;
  }

  return str;
}

function processNode(node: Node, lang: SupportedLanguage) {
  // Don't translate script, style, noscript
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();
    if (tagName === 'script' || tagName === 'style' || tagName === 'noscript' || tagName === 'code') {
      return;
    }

    // Translate placeholder
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (el.placeholder) {
        if (!(el as any)[ORIG_PLACEHOLDER_PROP]) {
          (el as any)[ORIG_PLACEHOLDER_PROP] = el.placeholder;
        }
        const orig = (el as any)[ORIG_PLACEHOLDER_PROP];
        if (lang === 'English') {
          el.placeholder = orig;
        } else {
          el.placeholder = translateString(orig, lang);
        }
      }
    }
  }

  // Translate Text Nodes
  if (node.nodeType === Node.TEXT_NODE) {
    const textNode = node as Text;
    const val = textNode.nodeValue || '';
    if (!val.trim()) return;

    if (!(textNode as any)[ORIG_TEXT_PROP]) {
      (textNode as any)[ORIG_TEXT_PROP] = val;
    }

    const orig = (textNode as any)[ORIG_TEXT_PROP];
    if (lang === 'English') {
      if (textNode.nodeValue !== orig) {
        textNode.nodeValue = orig;
      }
    } else {
      const translated = translateString(orig, lang);
      if (translated !== orig && textNode.nodeValue !== translated) {
        textNode.nodeValue = translated;
      }
    }
    return;
  }

  // Recursively process child nodes
  const children = node.childNodes;
  for (let i = 0; i < children.length; i++) {
    processNode(children[i], lang);
  }
}

export function applyLanguageToDOM(lang: SupportedLanguage) {
  currentLanguage = lang;

  // Handle RTL
  if (lang === 'العربية') {
    document.documentElement.dir = 'rtl';
    document.body.classList.add('rtl');
  } else {
    document.documentElement.dir = 'ltr';
    document.body.classList.remove('rtl');
  }

  // Translate entire body
  const root = document.querySelector('.app-viewport') || document.body;
  if (root) {
    processNode(root, lang);
  }

  // Ensure MutationObserver is active
  if (!activeObserver) {
    activeObserver = new MutationObserver((mutations) => {
      if (currentLanguage === 'English') return;

      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((addedNode) => {
            processNode(addedNode, currentLanguage);
          });
        } else if (mutation.type === 'characterData') {
          // If a text node changed and wasn't already translated
          const target = mutation.target as Text;
          if (target && target.nodeValue) {
            const orig = (target as any)[ORIG_TEXT_PROP] || target.nodeValue;
            const trans = translateString(orig, currentLanguage);
            if (target.nodeValue !== trans) {
              (target as any)[ORIG_TEXT_PROP] = orig;
              target.nodeValue = trans;
            }
          }
        }
      }
    });

    activeObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
}
