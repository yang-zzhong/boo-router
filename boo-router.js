import {PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `boo-router`
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
        observer: '_calc'
      },
      rules: {
        type: Array,
        observer: '_calc'
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
    if (!this.location) {
      return;
    }
    let path = this.location.path;
    if (path == "" || path == "/") {
      this.route = { page: "__root", params: {} };
      return;
    }
    for(let i in this.rules) {
      if (this._match(this.rules[i], path)) {
        return;
      }
    }
    this.route = { page: "__undefined", params: {} };
  }

  _match(rule, path) {
    let r = this._regexp(rule['rule']);
    let matched = path.match(r.regexp);
    if (matched == null) {
      return false;
    }
    this.route = {
      page: rule.page,
      params: this._params(this._m(matched), r.ids)
    };
    let query = {};
    for(let j in this.location.query) {
      query[j] = this.location.query[j];
    }
    query['__uris'] = this.route.params;
    this.query = query;
    this.tail = (function(query, path) {
      return {
        path: path,
        query: query,
      };
    })(this.location.query, path.replace(r.regexp, ""));
    return true;
  }

  _regexp(rule) {
    let ids = this._m(rule.match(/(:\w+)/g));
    rule = rule.replace(/(:\w+)/g, '([^\/]+)');
    return {
      ids: ids,
      regexp: new RegExp('^'+rule.replace(/\//, '\/'))
    }
  }

  _params(p, ids) {
    let result = {};
    for(let i in p) {
      result[ids[i].replace(":", "")] = p[i];
    }
    return result;
  }

  _m(matched) {
    if (!matched) {
      return null;
    }
    if (matched['input']) {
      matched.splice(0, 1);
      delete(matched['input']);
      delete(matched['groups']);
      delete(matched['index']);
    }
    return matched;
  }
}

window.customElements.define('boo-router', BooRouter);
