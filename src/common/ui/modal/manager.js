
import styles from './modal.scss';
import { isObject, qsa } from 'common/utils';

const Selector = {
  FIXED_CONTENT: [
    '.' + styles['fixed-top'],
    '.' + styles['fixed-bottom'],
    '.' + styles['is-fixed'],
    '.' + styles['sticky-top'],
  ].join(''),
  STICKY_CONTENT: '.' + styles['sticky-top'],
  NAVBAR_TOGGLER: '.' + styles['navbar-toggler'],
};

class ModalManager {

  constructor () {
    this.hooks = [];
    this.stateHooks = new Set();
    this.styleCache = new ElementDataCache;
  }

  get active () {
    return !!this.hooks.length;
  }

  get first () {
    return this.hooks[0];
  }

  get last () {
    return this.hooks[this.hooks.length - 1];
  }

  isFirst (ref) {
    return ref === this.first;
  }

  isLast (ref) {
    return ref === this.last;
  }

  _stateChanged () {
    setTimeout(() => this.stateHooks.forEach((fn) => fn()));
  }

  push (ref) {
    this.activate();
    const prevLast = this.last;
    this.hooks.push(ref);
    invokeState(prevLast?.setState, { isForeground: false });
    this._stateChanged();
  }

  unshift (ref) {
    this.activate();
    const prevFirst = this.last;
    this.hooks.push(ref);
    invokeState(prevFirst?.setState, { isForeground: this.hooks.length === 2 });
    this._stateChanged();
    return !prevFirst;
  }

  pop () {
    const ref = this.hooks.pop();
    const newLast = this.last;
    if (newLast) {
      // if there's only one ref, then it's the first.
      invokeState(newLast?.setState, { isForeground: true });
    } else {
      this.deactivate();
    }
    this._stateChanged();
    return ref;
  }

  shift () {
    const ref = this.modals.shift();
    const newFirst = this.first;
    if (newFirst) {
      invokeState(newFirst?.setState, { isForeground: this.hooks.length === 1 });
    } else {
      this.deactivate();
    }
    this._stateChanged();
    return ref;
  }

  remove (ref) {
    if (ref === this.last) {
      return this.pop();
    }

    if (ref === this.first) {
      return this.shift();
    }

    const idx = this.hooks.indexOf(ref);
    if (idx < 0) return;
    return this.hooks.splice(idx, 1);
  }

  activate () {
    if (this.active) return;

    if (isBodyOverflowing()) {
      const scrollbarWidth = getScrollbarWidth();
      this._setElementAttributes(Selector.FIXED_CONTENT,  'paddingRight', (v) => v + scrollbarWidth);
      this._setElementAttributes(Selector.STICKY_CONTENT, 'marginRight',  (v) => v - scrollbarWidth);
      this._setElementAttributes('body',                  'paddingRight', (v) => v + scrollbarWidth);
    }

    this._setElementAttributes('body', 'overflow', 'hidden');
  }

  deactivate () {
    if (this.active) return;

    this._resetElementAttributes(Selector.FIXED_CONTENT, 'paddingRight');
    this._resetElementAttributes(Selector.STICKY_CONTENT, 'marginRight');
    this._resetElementAttributes('body', 'paddingRight');
    this._resetElementAttributes('body', 'overflow');
  }

  _setElementAttributes (selector, styleProp, fn) {
    qsa(selector, (el) => {
      if (this.styleCache.has(el)) return;

      const actualValue = this.styleCache.has(el)
        ? this.styleCache.get(el, styleProp)
        : el.style[styleProp]
      ;

      if (!this.styleCache.has(el)) this.styleCache.set(el, actualValue);

      const calculatedValue = window.getComputedStyle(el)[styleProp];

      var val;
      if (typeof fn === 'function') {
        val = fn(Number.parseFloat(calculatedValue));
      } else {
        val = fn;
      }
      el.style[styleProp] = (typeof val === 'number') ? val + 'px' : val;
    });
  }

  _resetElementAttributes (selector, styleProp) {
    qsa(selector, (el) => {
      el.style[styleProp] = this.styleCache.get(el, styleProp) || '';
      this.styleCache.delete(el, styleProp);
    });
  }

}


function invokeState (fn, state) {
  if (!fn) return;
  setTimeout(() => fn(state));
}



class ElementDataCache extends Map {

  get (el, prop) {
    const data = super.get(el);
    return prop ? data && data[prop] : data;
  }

  set (el, prop, value) {
    let data = {};
    if (super.has(el)) {
      data = super.get(el);
    }

    if (isObject(prop)) {
      data = { ...data, ...prop };
    } else {
      data = { ...data, [prop]: value };
    }

    super.set(el, data);
  }

  has (el, prop) {
    if (!super.has(el)) return false;
    const data = super.get(el);
    return prop in data;
  }

  delete (el, prop) {
    if (!prop) super.delete(el);
    if (!super.has(el)) return;
    const data = super.get(el);
    if (prop in data && Object.keys(data).length === 1) {
      super.delete(el);
      return;
    }
    delete data[prop];
    super.set(el, data);
  }
}


function getScrollbarWidth () {
  const scrollDiv = document.createElement('div');
  scrollDiv.className = styles['modal-scrollbar-measure'];
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}

function isBodyOverflowing () {
  const rect = document.body.getBoundingClientRect();
  return Math.round(rect.left + rect.right) < window.innerWidth;
}

const Manager = new ModalManager();
export default Manager;
