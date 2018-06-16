import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `boo-router`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class BooRouter extends PolymerElement {
  static get properties() {
    return {
      location: {
        type: Object,
        observer: '_calc',
        value: ""
      },
      rules: {
        type: Array,
        observer: '_calc',
        value: []
      },
      route: {
        type: Object,
        notify: true
      },
      query: {
        type: Object,
        notify: true
      },
      tail: {
        type: String,
        notify: true
      }
    };
  }

  _calc() {
    let path = this.location.path;
    for(let i in this.rules) {
      let rule = this.rules[i];
      let regexp = new RegExp(rule.regexp);
      let matched = path.match(regexp);
      if (matched == null) {
        continue;
      }
      this.route = {
        page: rule.page,
        params: this.q(matched)
      };
      let query = {};
      for(let j in this.location.query) {
        query[j] = this.location.query[j];
      }
      this.query = query;
      this.tail = this.t(this.location, path, regexp);
      return;
    }
  }

  q(matched) {
    matched.splice(0, 1);
    delete(matched['groups']);
    delete(matched['input']);
    delete(matched['index']);

    return matched;
  }

  t(location, path, regexp) {
    location.path = path.replace(regexp, "");

    return location;
  }
}

window.customElements.define('boo-router', BooRouter);
