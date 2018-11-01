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
        value: []
      },
      routed: {
        type: Object,
        observer: '_routedChanged',
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

  route(location, rules) {
    if (!location) {
      return;
    }
    rules = rules || this.rules;
    let r = {};
    let path = location.path;
    if (path == "" || path == "/") {
      r.routed = { page: "__root", params: {} };
      return r;
    }
    for(let i in rules) {
      let r = this._match(rules[i], path);
      if (r !== false) {
        r.query = this._queryParams(location, r.routed);
        return r;
      }
    }
    let p = path.replace(/^\//g, '').split("/");
    r.routed = {
      page: p.shift(),
      params: {}
    };
    r.tail = {
      path: '/' + p.join('/'),
      query: location.query,
      hash: location.hash,
    };
    r.query = location.query;
    return r;
  }

  _calc() {
    let res = this.route(this.location);
    if (res) {
      this.routed = res.routed;
      this.tail = res.tail;
      this.query = res.query;
    }
  }

  _match(rule, path) {
    let r = this._regexp(rule['rule']);
    let matched = path.match(r.regexp);
    if (matched == null) {
      return false;
    }
    let res = {};
    res.routed = {
      page: rule.page,
      params: this._params(this._m(matched), r.ids)
    };
    res.tail = (function(query, path) {
      return {
        path: path,
        query: query,
      };
    })(location.query, path.replace(r.regexp, ""));
    return res;
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

  _routedChanged(routed) {
    if (routed == null) {
      return;
    }

    this.query = this._queryParams(this.location, routed);
  }

  _queryParams(location, routed) {
    let query = {};
    for(let j in location.query) {
      query[j] = location.query[j];
    }
    query['__uris'] = routed.params;

    return query;
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
