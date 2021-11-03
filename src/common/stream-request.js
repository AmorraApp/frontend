
import fetch from 'common/fetch';
import { EventEmitter } from 'common/utils';

export default class StreamRequest extends EventEmitter {
  constructor (url, { delay, ...options } = {}) {
    super();
    this.url = url;
    this.options = options;
    this.delete = delay || 0;
    this.xhr = null;
    this.pollerID = null;
    this.done = null;
  }

  start () {
    if (this.xhr) {
      this.xhr.abort();
    }

    this.done = false;
    this.pollerID = null;

    this.emit('stream-opened');
    this._poll(true);
  }

  abort () {
    this.xhr?.abort();
  }

  _poll (reset) {
    const control = this.xhr = new AbortController();
    const signal = control.signal;

    const url = reset
      ? this.url
      : `/search/poller/${this.pollerID}`
    ;

    fetch(url, { ...this.options, signal }).then(
      (r) => this._handleResponse(r),
      (err) => this._handleError(err),
    );
  }

  _handleResponse (data) {
    this.xhr = null;

    if (!this.pollerID) {
      this.pollerID = data.id;
    } else if (this.pollerID !== data.id) {
      // We got a response that isn't the current request, ignore it.
      return;
    }

    if (data.errors) {
      for (const err of data.errors) {
        this.emit('error', err);
      }

      this.done = true;
      this.emit('stream-closed');
      return;
    }

    for (const ev of data.events || []) {
      if (ev[0] === 'end') {
        this.done = true;
        this.pollerID = null;
      }
      this.emit(...ev);
    }

    if (this.done) {
      this.emit('stream-closed');
    } else {
      setTimeout(() => this._poll(), this.delay);
    }
  }

  _handleError (err) {
    this.done = true;
    this.xhr = null;
    this.pollerID = null;
    this.emit('error', err);
  }
}
