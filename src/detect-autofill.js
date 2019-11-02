import './detect-autofill.scss';

document.addEventListener('animationstart', onAnimationStart, true);
document.addEventListener('input', onInput, true);

// polyfill CustomEvent for < IE11
if (typeof window.CustomEvent !== 'function') {
  /**
   * @TODO Polyfill or no CustomEvent on IE?
   *
   * @param {string} event
   * @param {any} params
   * @return {CustomEvent}
   */
  function CustomEvent(event, params) {
    params = params || {bubbles: false, cancelable: false, detail: null};
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return e;
  }

  window.CustomEvent = CustomEvent;
}

/**
 * Handler for -webkit based browser that listen for a custom
 * animation create using the :pseudo-selector in the stylesheet.
 * Works with Chrome, Safari
 *
 * @param {AnimationEvent} event
 */
function onAnimationStart(event) {
  ('onautofillstart' === event.animationName) ?
    autocomplete(event.target) :
    cancelAutocomplete(event.target);
}

/**
 * Handler for non-webkit based browser that listen for input
 * event to trigger the autocomplete-cancel process.
 * Works with Firefox, Edge, IE11
 *
 * @param {InputEvent} event
 */
function onInput(event) {
  ('insertReplacementText' === event.inputType || !('data' in event)) ?
    autocomplete(event.target) :
    cancelAutocomplete(event.target);
}

/**
 * Manage an input element when its value is autocompleted
 * by the browser in the following steps:
 * - add [autocompleted] attribute from event.target
 * - create 'onautocomplete' cancelable CustomEvent
 * - dispatch the Event
 *
 * @param {HtmlInputElement} element
 */
function autocomplete(element) {
  if (element.hasAttribute('autocompleted')) return;
  element.setAttribute('autocompleted', '');

  var event = new window.CustomEvent('onautocomplete', {
    bubbles: true, cancelable: true, detail: null,
  });

  // no autofill if preventDefault is called
  if (!element.dispatchEvent(event)) {
    element.value = '';
  }
}

/**
 * Manage an input element when its autocompleted value is
 * removed by the browser in the following steps:
 * - remove [autocompleted] attribute from event.target
 * - create 'onautocomplete' non-cancelable CustomEvent
 * - dispatch the Event
 *
 * @param {HtmlInputElement} element
 */
function cancelAutocomplete(element) {
  if (!element.hasAttribute('autocompleted')) return;
  element.removeAttribute('autocompleted');

  // dispatch event
  element.dispatchEvent(new window.CustomEvent('onautocomplete', {
    bubbles: true, cancelable: false, detail: null,
  }));
}
