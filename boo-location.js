import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import "@polymer/iron-location/iron-location.js";
import "@polymer/iron-location/iron-query-params.js";

class BooLocation extends PolymerElement {
  static get template() {
    return html`
      <iron-query-params id="query"></iron-query-params>
      <iron-location
        query={{__query}}
        path={{__path}}
        on-location-changed="_urlChanged"></iron-location>
    `;
  }

  static get properties() {
    return {
      location: {
        type: Object,
        notify: true
      },
      timer: Object,
      __query: {
        type: String,
        observer: '_urlChanged'
      },
      __path: {
        type: String,
        observer: '_urlChanged'
      }
    };
  }

  _urlChanged() {
    clearTimeout(this.timer);
    this.timer = setTimeout(function() {
      this.$.query.paramsString = this.__query;
      this.location = {
        query: this.$.query.paramsObject,
        path: this.__path
      };
    }.bind(this), 1);
  }
}

window.customElements.define('boo-location', BooLocation);
