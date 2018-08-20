import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '../boo-router.js'

class TestRouter extends PolymerElement {
  static get template() {
    return html`

      <pre>
        rules: [{
          rule: /:user_name/cates/:cate_id,
          page: user_cates
        }]
      </pre>

      <paper-input label="输入路经" value="{{path}}"></paper-input>

      <boo-router 
        location="[[location]]"
        rules="[[rules]]"
        route="{{route}}"
        tail="{{tail}}"
        query="{{query}}"></boo-router>

      <div>route: [[_route]]</div>
      <div>query: [[_query]]</div>
      <div>tail: [[_tail]]</div>
    `;
  }

  static get properties() {
    return {
      path: String,
      location: {
        type: Object,
        computed: "_computeLocation(path)",
      },
      rules: {
        type: Array,
        value: [{
          rule: '/:user_name/cates/:cate_id',
          page: 'user_cates'
        }]
      },
      route: Object,
      query: Object,
      tail: Object,
      _query: {
        type: String,
        computed: '_computeQuery(query)'
      },
      _route: {
        type: String,
        computed: '_computeQuery(route)'
      },
      _tail: {
        type: String,
        computed: '_computeQuery(tail)'
      }
    };
  }

  _computeLocation(path) {
    return {
      path: path,
      query: {},
      hash: '',
    };
  }

  _computeQuery(query) {
    return JSON.stringify(query);
  }
}

window.customElements.define('test-router', TestRouter);
