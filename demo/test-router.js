import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '../boo-router.js'

class TestRouter extends PolymerElement {
  static get template() {
    return html`
      <boo-router 
        location="[[location]]"
        rules="[[rules]]"
        route="{{route}}"
        query="{{query}}"></boo-router>

      <div>route: [[_route]]</div>
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
      route: Object,
      query: Object,
      _query: {
        type: String,
        computed: '_computeQuery(query)'
      },
      _route: {
        type: String,
        computed: '_computeQuery(route)'
      }
    };
  }

  _computeQuery(query) {
    return JSON.stringify(query);
  }
}

window.customElements.define('test-router', TestRouter);
