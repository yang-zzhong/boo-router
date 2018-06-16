import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '../boo-router.js'

class TestRouter extends PolymerElement {
  static get template() {
    return html`
      <boo-router 
        location="[[location]]"
        rules="[[rules]]"
        page="{{page}}"
        query="{{query}}"></boo-router>

      <div>page: [[page]]</div>
      <div>query: [[_query]]</div>
    `;
  }

  static get properties() {
    return {
      location: {
        type: Object,
        value: {
          path: '/hello/1234/321/world/1234',
          query: {},
          hash: '',
        }
      },
      rules: {
        type: Array,
        value: [{
          regexp: '\/hello\/(\\d+)/(\\d+)',
          page: 'hello'
        }]
      },
      page: String,
      query: Object,
      _query: {
        type: String,
        computed: '_computeQuery(query)'
      }
    };
  }

  _computeQuery(query) {
    return JSON.stringify(query);
  }
}

window.customElements.define('test-router', TestRouter);
