
import styles from './modal.scss';

export default class Modal {

  constructor (ref, manager) {
    this.ref = ref;
    this.manager = manager;

    this.setState = this.setState.bind(this);
  }

  show () {
    this.setState({ isOpening: true, open: true });
    this.manager.push(this);

    const element = this.ref.current;
    const modalBody = element.querySelector(styles['modal-body']);

    element.style.display = 'block';
    element.removeAttribute('aria-hidden');
    element.setAttribute('aria-modal', true);
    element.setAttribute('role', 'dialog');
    element.scrollTop = 0;

    if (modalBody) {
      modalBody.scrollTop = 0;
    }
  }

  hide () {
    this.manager.remove(this);
    this.setState({ isClosing: true });

    const element = this.ref.current;
    element.style.display = '';
    element.style.paddingLeft = '';
    element.style.paddingRight = '';
  }

  dispose () {
    // this gets called when the modal component is dismounted.
    // The manager _shouldn't_ have this modal right now, but lets just make sure
    this.manager.remove(this);
  }

  _onResize () {
    if (!this.props.show) return;

    const element = this.ref.current;
    if (!element) return;

    const isModalOverflowing = element.scrollHeight > document.documentElement.clientHeight;

    const isRTL = document.documentElement.dir === 'rtl';

    if ((!this._isBodyOverflowing && isModalOverflowing && !isRTL) || (this._isBodyOverflowing && !isModalOverflowing && isRTL)) {
      element.style.paddingLeft = `${this._scrollbarWidth}px`;
    }

    if ((this._isBodyOverflowing && !isModalOverflowing && !isRTL) || (!this._isBodyOverflowing && isModalOverflowing && isRTL)) {
      element.style.paddingRight = `${this._scrollbarWidth}px`;
    }
  }

  setState (newState) {
    this._setState({ ...this.state, ...newState });
  }

  onEnter () {
    this.props.onEnter?.();
  }

  onEntering () {
    this.props.onEntering?.();
  }

  onEntered () {
    this.props.onEntered?.();
    this.setState({ isOpening: false });
  }

  onExit () {
    this.props.onExit?.();
  }

  onExiting () {
    this.props.onExiting?.();
  }

  onExited () {
    this.setState({ open: false, isClosing: false });
    this.props.onExited?.();
  }

}
