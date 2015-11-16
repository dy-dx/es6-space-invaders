(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

/*! cash-dom 1.3.7, https://github.com/kenwheeler/cash @license MIT */
;(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports !== "undefined") {
    module.exports = factory();
  } else {
    root.cash = root.$ = factory();
  }
})(this, function () {
  var doc = document, win = window, ArrayProto = Array.prototype, slice = ArrayProto.slice, filter = ArrayProto.filter, push = ArrayProto.push;

  var noop = function () {}, isFunction = function (item) {
    // @see https://crbug.com/568448
    return typeof item === typeof noop && item.call;
  }, isString = function (item) {
    return typeof item === typeof "";
  };

  var idMatch = /^#[\w-]*$/, classMatch = /^\.[\w-]*$/, htmlMatch = /<.+>/, singlet = /^\w+$/;

  function find(selector, context) {
    context = context || doc;
    var elems = (classMatch.test(selector) ? context.getElementsByClassName(selector.slice(1)) : singlet.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
    return elems;
  }

  var frag;
  function parseHTML(str) {
    if (!frag) {
      frag = doc.implementation.createHTMLDocument(null);
      var base = frag.createElement("base");
      base.href = doc.location.href;
      frag.head.appendChild(base);
    }

    frag.body.innerHTML = str;

    return frag.body.childNodes;
  }

  function onReady(fn) {
    if (doc.readyState !== "loading") {
      setTimeout(fn);
    } else {
      doc.addEventListener("DOMContentLoaded", fn);
    }
  }

  function Init(selector, context) {
    if (!selector) {
      return this;
    }

    // If already a cash collection, don't do any further processing
    if (selector.cash && selector !== win) {
      return selector;
    }

    var elems = selector, i = 0, length;

    if (isString(selector)) {
      elems = (idMatch.test(selector) ?
      // If an ID use the faster getElementById check
      doc.getElementById(selector.slice(1)) : htmlMatch.test(selector) ?
      // If HTML, parse it into real elements
      parseHTML(selector) :
      // else use `find`
      find(selector, context));

      // If function, use as shortcut for DOM ready
    } else if (isFunction(selector)) {
      onReady(selector);return this;
    }

    if (!elems) {
      return this;
    }

    // If a single DOM element is passed in or received via ID, return the single element
    if (elems.nodeType || elems === win) {
      this[0] = elems;
      this.length = 1;
    } else {
      // Treat like an array and loop through each item.
      length = this.length = elems.length;
      for (; i < length; i++) {
        this[i] = elems[i];
      }
    }

    return this;
  }

  function cash(selector, context) {
    return new Init(selector, context);
  }

  var fn = cash.fn = cash.prototype = Init.prototype = { // jshint ignore:line
    cash: true,
    length: 0,
    push: push,
    splice: ArrayProto.splice,
    map: ArrayProto.map,
    init: Init
  };

  Object.defineProperty(fn, "constructor", { value: cash });

  cash.parseHTML = parseHTML;
  cash.noop = noop;
  cash.isFunction = isFunction;
  cash.isString = isString;

  cash.extend = fn.extend = function (target) {
    target = target || {};

    var args = slice.call(arguments), length = args.length, i = 1;

    if (args.length === 1) {
      target = this;
      i = 0;
    }

    for (; i < length; i++) {
      if (!args[i]) {
        continue;
      }
      for (var key in args[i]) {
        if (args[i].hasOwnProperty(key)) {
          target[key] = args[i][key];
        }
      }
    }

    return target;
  };

  function each(collection, callback) {
    var l = collection.length, i = 0;

    for (; i < l; i++) {
      if (callback.call(collection[i], collection[i], i, collection) === false) {
        break;
      }
    }
  }

  function matches(el, selector) {
    var m = el && (el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector);
    return !!m && m.call(el, selector);
  }

  function getCompareFunction(selector) {
    return (
    /* Use browser's `matches` function if string */
    isString(selector) ? matches :
    /* Match a cash element */
    selector.cash ? function (el) {
      return selector.is(el);
    } :
    /* Direct comparison */
    function (el, selector) {
      return el === selector;
    });
  }

  function unique(collection) {
    return cash(slice.call(collection).filter(function (item, index, self) {
      return self.indexOf(item) === index;
    }));
  }

  cash.extend({
    merge: function (first, second) {
      var len = +second.length, i = first.length, j = 0;

      for (; j < len; i++, j++) {
        first[i] = second[j];
      }

      first.length = i;
      return first;
    },

    each: each,
    matches: matches,
    unique: unique,
    isArray: Array.isArray,
    isNumeric: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

  });

  var uid = cash.uid = "_cash" + Date.now();

  function getDataCache(node) {
    return (node[uid] = node[uid] || {});
  }

  function setData(node, key, value) {
    return (getDataCache(node)[key] = value);
  }

  function getData(node, key) {
    var c = getDataCache(node);
    if (c[key] === undefined) {
      c[key] = node.dataset ? node.dataset[key] : cash(node).attr("data-" + key);
    }
    return c[key];
  }

  function removeData(node, key) {
    var c = getDataCache(node);
    if (c) {
      delete c[key];
    } else if (node.dataset) {
      delete node.dataset[key];
    } else {
      cash(node).removeAttr("data-" + name);
    }
  }

  fn.extend({
    data: function (name, value) {
      if (isString(name)) {
        return (value === undefined ? getData(this[0], name) : this.each(function (v) {
          return setData(v, name, value);
        }));
      }

      for (var key in name) {
        this.data(key, name[key]);
      }

      return this;
    },

    removeData: function (key) {
      return this.each(function (v) {
        return removeData(v, key);
      });
    }

  });

  var notWhiteMatch = /\S+/g;

  function getClasses(c) {
    return isString(c) && c.match(notWhiteMatch);
  }

  function hasClass(v, c) {
    return (v.classList ? v.classList.contains(c) : new RegExp("(^| )" + c + "( |$)", "gi").test(v.className));
  }

  function addClass(v, c) {
    if (v.classList) {
      v.classList.add(c);
    } else if (!hasClass(v, c)) {
      v.className += " " + c;
    }
  }

  function removeClass(v, c) {
    if (v.classList) {
      v.classList.remove(c);
    } else {
      v.className = v.className.replace(c, "");
    }
  }

  fn.extend({
    addClass: function (c) {
      var classes = getClasses(c);

      return (classes ? this.each(function (v) {
        each(classes, function (c) {
          addClass(v, c);
        });
      }) : this);
    },

    attr: function (name, value) {
      if (!name) {
        return undefined;
      }

      if (isString(name)) {
        if (value === undefined) {
          return this[0] ? this[0].getAttribute ? this[0].getAttribute(name) : this[0][name] : undefined;
        }

        return this.each(function (v) {
          if (v.setAttribute) {
            v.setAttribute(name, value);
          } else {
            v[name] = value;
          }
        });
      }

      for (var key in name) {
        this.attr(key, name[key]);
      }

      return this;
    },

    hasClass: function (c) {
      var check = false, classes = getClasses(c);
      if (classes && classes.length) {
        this.each(function (v) {
          check = hasClass(v, classes[0]);
          return !check;
        });
      }
      return check;
    },

    prop: function (name, value) {
      if (isString(name)) {
        return (value === undefined ? this[0][name] : this.each(function (v) {
          v[name] = value;
        }));
      }

      for (var key in name) {
        this.prop(key, name[key]);
      }

      return this;
    },

    removeAttr: function (name) {
      return this.each(function (v) {
        if (v.removeAttribute) {
          v.removeAttribute(name);
        } else {
          delete v[name];
        }
      });
    },

    removeClass: function (c) {
      if (!arguments.length) {
        return this.attr("class", "");
      }
      var classes = getClasses(c);
      return (classes ? this.each(function (v) {
        each(classes, function (c) {
          removeClass(v, c);
        });
      }) : this);
    },

    removeProp: function (name) {
      return this.each(function (v) {
        delete v[name];
      });
    },

    toggleClass: function (c, state) {
      if (state !== undefined) {
        return this[state ? "addClass" : "removeClass"](c);
      }
      var classes = getClasses(c);
      return (classes ? this.each(function (v) {
        each(classes, function (c) {
          if (hasClass(v, c)) {
            removeClass(v, c);
          } else {
            addClass(v, c);
          }
        });
      }) : this);
    } });

  fn.extend({
    add: function (selector, context) {
      return unique(cash.merge(this, cash(selector, context)));
    },

    each: function (callback) {
      each(this, callback);
      return this;
    },

    eq: function (index) {
      return cash(this.get(index));
    },

    filter: function (selector) {
      if (!selector) {
        return this;
      }

      var comparator = (isFunction(selector) ? selector : getCompareFunction(selector));

      return cash(filter.call(this, function (e) {
        return comparator(e, selector);
      }));
    },

    first: function () {
      return this.eq(0);
    },

    get: function (index) {
      if (index === undefined) {
        return slice.call(this);
      }
      return (index < 0 ? this[index + this.length] : this[index]);
    },

    index: function (elem) {
      var child = elem ? cash(elem)[0] : this[0], collection = elem ? this : cash(child).parent().children();
      return slice.call(collection).indexOf(child);
    },

    last: function () {
      return this.eq(-1);
    }

  });

  var camelCase = (function () {
    var camelRegex = /(?:^\w|[A-Z]|\b\w)/g, whiteSpace = /[\s-_]+/g;
    return function (str) {
      return str.replace(camelRegex, function (letter, index) {
        return letter[index === 0 ? "toLowerCase" : "toUpperCase"]();
      }).replace(whiteSpace, "");
    };
  }());

  var getPrefixedProp = (function () {
    var cache = {}, doc = document, div = doc.createElement("div"), style = div.style;

    return function (prop) {
      prop = camelCase(prop);
      if (cache[prop]) {
        return cache[prop];
      }

      var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1), prefixes = ["webkit", "moz", "ms", "o"], props = (prop + " " + (prefixes).join(ucProp + " ") + ucProp).split(" ");

      each(props, function (p) {
        if (p in style) {
          cache[p] = prop = cache[prop] = p;
          return false;
        }
      });

      return cache[prop];
    };
  }());

  cash.prefixedProp = getPrefixedProp;
  cash.camelCase = camelCase;

  fn.extend({
    css: function (prop, value) {
      if (isString(prop)) {
        prop = getPrefixedProp(prop);
        return (arguments.length > 1 ? this.each(function (v) {
          return v.style[prop] = value;
        }) : win.getComputedStyle(this[0])[prop]);
      }

      for (var key in prop) {
        this.css(key, prop[key]);
      }

      return this;
    }

  });

  function compute(el, prop) {
    return parseInt(win.getComputedStyle(el[0], null)[prop], 10) || 0;
  }

  each(["Width", "Height"], function (v) {
    var lower = v.toLowerCase();

    fn[lower] = function () {
      return this[0].getBoundingClientRect()[lower];
    };

    fn["inner" + v] = function () {
      return this[0]["client" + v];
    };

    fn["outer" + v] = function (margins) {
      return this[0]["offset" + v] + (margins ? compute(this, "margin" + (v === "Width" ? "Left" : "Top")) + compute(this, "margin" + (v === "Width" ? "Right" : "Bottom")) : 0);
    };
  });

  function registerEvent(node, eventName, callback) {
    var eventCache = getData(node, "_cashEvents") || setData(node, "_cashEvents", {});
    eventCache[eventName] = eventCache[eventName] || [];
    eventCache[eventName].push(callback);
    node.addEventListener(eventName, callback);
  }

  function removeEvent(node, eventName, callback) {
    var events = getData(node, "_cashEvents"), eventCache = (events && events[eventName]), index;

    if (!eventCache) {
      return;
    }

    if (callback) {
      node.removeEventListener(eventName, callback);
      index = eventCache.indexOf(callback);
      if (index >= 0) {
        eventCache.splice(index, 1);
      }
    } else {
      each(eventCache, function (event) {
        node.removeEventListener(eventName, event);
      });
      eventCache = [];
    }
  }

  fn.extend({
    off: function (eventName, callback) {
      return this.each(function (v) {
        return removeEvent(v, eventName, callback);
      });
    },

    on: function (eventName, delegate, callback, runOnce) {
      // jshint ignore:line

      var originalCallback;

      if (!isString(eventName)) {
        for (var key in eventName) {
          this.on(key, delegate, eventName[key]);
        }
        return this;
      }

      if (isFunction(delegate)) {
        callback = delegate;
        delegate = null;
      }

      if (eventName === "ready") {
        onReady(callback);
        return this;
      }

      if (delegate) {
        originalCallback = callback;
        callback = function (e) {
          var t = e.target;

          while (!matches(t, delegate)) {
            if (t === this) {
              return (t = false);
            }
            t = t.parentNode;
          }

          if (t) {
            originalCallback.call(t, e);
          }
        };
      }

      return this.each(function (v) {
        var finalCallback = callback;
        if (runOnce) {
          finalCallback = function () {
            callback.apply(this, arguments);
            removeEvent(v, eventName, finalCallback);
          };
        }
        registerEvent(v, eventName, finalCallback);
      });
    },

    one: function (eventName, delegate, callback) {
      return this.on(eventName, delegate, callback, true);
    },

    ready: onReady,

    trigger: function (eventName, data) {
      var evt = doc.createEvent("HTMLEvents");
      evt.data = data;
      evt.initEvent(eventName, true, false);
      return this.each(function (v) {
        return v.dispatchEvent(evt);
      });
    }

  });

  function encode(name, value) {
    return "&" + encodeURIComponent(name) + "=" + encodeURIComponent(value).replace(/%20/g, "+");
  }

  function getSelectMultiple_(el) {
    var values = [];
    each(el.options, function (o) {
      if (o.selected) {
        values.push(o.value);
      }
    });
    return values.length ? values : null;
  }

  function getSelectSingle_(el) {
    var selectedIndex = el.selectedIndex;
    return selectedIndex >= 0 ? el.options[selectedIndex].value : null;
  }

  function getValue(el) {
    var type = el.type;
    if (!type) {
      return null;
    }
    switch (type.toLowerCase()) {
      case "select-one":
        return getSelectSingle_(el);
      case "select-multiple":
        return getSelectMultiple_(el);
      case "radio":
        return (el.checked) ? el.value : null;
      case "checkbox":
        return (el.checked) ? el.value : null;
      default:
        return el.value ? el.value : null;
    }
  }

  fn.extend({
    serialize: function () {
      var query = "";

      each(this[0].elements || this, function (el) {
        if (el.disabled || el.tagName === "FIELDSET") {
          return;
        }
        var name = el.name;
        switch (el.type.toLowerCase()) {
          case "file":
          case "reset":
          case "submit":
          case "button":
            break;
          case "select-multiple":
            var values = getValue(el);
            if (values !== null) {
              each(values, function (value) {
                query += encode(name, value);
              });
            }
            break;
          default:
            var value = getValue(el);
            if (value !== null) {
              query += encode(name, value);
            }
        }
      });

      return query.substr(1);
    },

    val: function (value) {
      if (value === undefined) {
        return getValue(this[0]);
      } else {
        return this.each(function (v) {
          return v.value = value;
        });
      }
    }

  });

  function insertElement(el, child, prepend) {
    if (prepend) {
      var first = el.childNodes[0];
      el.insertBefore(child, first);
    } else {
      el.appendChild(child);
    }
  }

  function insertContent(parent, child, prepend) {
    var str = isString(child);

    if (!str && child.length) {
      each(child, function (v) {
        return insertContent(parent, v, prepend);
      });
      return;
    }

    each(parent, str ? function (v) {
      return v.insertAdjacentHTML(prepend ? "afterbegin" : "beforeend", child);
    } : function (v, i) {
      return insertElement(v, (i === 0 ? child : child.cloneNode(true)), prepend);
    });
  }

  fn.extend({
    after: function (selector) {
      cash(selector).insertAfter(this);
      return this;
    },

    append: function (content) {
      insertContent(this, content);
      return this;
    },

    appendTo: function (parent) {
      insertContent(cash(parent), this);
      return this;
    },

    before: function (selector) {
      cash(selector).insertBefore(this);
      return this;
    },

    clone: function () {
      return cash(this.map(function (v) {
        return v.cloneNode(true);
      }));
    },

    empty: function () {
      this.html("");
      return this;
    },

    html: function (content) {
      if (content === undefined) {
        return this[0].innerHTML;
      }
      var source = (content.nodeType ? content[0].outerHTML : content);
      return this.each(function (v) {
        return v.innerHTML = source;
      });
    },

    insertAfter: function (selector) {
      var _this = this;


      cash(selector).each(function (el, i) {
        var parent = el.parentNode, sibling = el.nextSibling;
        _this.each(function (v) {
          parent.insertBefore((i === 0 ? v : v.cloneNode(true)), sibling);
        });
      });

      return this;
    },

    insertBefore: function (selector) {
      var _this2 = this;
      cash(selector).each(function (el, i) {
        var parent = el.parentNode;
        _this2.each(function (v) {
          parent.insertBefore((i === 0 ? v : v.cloneNode(true)), el);
        });
      });
      return this;
    },

    prepend: function (content) {
      insertContent(this, content, true);
      return this;
    },

    prependTo: function (parent) {
      insertContent(cash(parent), this, true);
      return this;
    },

    remove: function () {
      return this.each(function (v) {
        return v.parentNode.removeChild(v);
      });
    },

    text: function (content) {
      if (content === undefined) {
        return this[0].textContent;
      }
      return this.each(function (v) {
        return v.textContent = content;
      });
    }

  });

  var docEl = doc.documentElement;

  fn.extend({
    position: function () {
      var el = this[0];
      return {
        left: el.offsetLeft,
        top: el.offsetTop
      };
    },

    offset: function () {
      var rect = this[0].getBoundingClientRect();
      return {
        top: rect.top + win.pageYOffset - docEl.clientTop,
        left: rect.left + win.pageXOffset - docEl.clientLeft
      };
    },

    offsetParent: function () {
      return cash(this[0].offsetParent);
    }

  });

  fn.extend({
    children: function (selector) {
      var elems = [];
      this.each(function (el) {
        push.apply(elems, el.children);
      });
      elems = unique(elems);

      return (!selector ? elems : elems.filter(function (v) {
        return matches(v, selector);
      }));
    },

    closest: function (selector) {
      if (!selector || this.length < 1) {
        return cash();
      }
      if (this.is(selector)) {
        return this.filter(selector);
      }
      return this.parent().closest(selector);
    },

    is: function (selector) {
      if (!selector) {
        return false;
      }

      var match = false, comparator = getCompareFunction(selector);

      this.each(function (el) {
        match = comparator(el, selector);
        return !match;
      });

      return match;
    },

    find: function (selector) {
      if (!selector || selector.nodeType) {
        return cash(selector && this.has(selector).length ? selector : null);
      }

      var elems = [];
      this.each(function (el) {
        push.apply(elems, find(selector, el));
      });

      return unique(elems);
    },

    has: function (selector) {
      var comparator = (isString(selector) ? function (el) {
        return find(selector, el).length !== 0;
      } : function (el) {
        return el.contains(selector);
      });

      return this.filter(comparator);
    },

    next: function () {
      return cash(this[0].nextElementSibling);
    },

    not: function (selector) {
      if (!selector) {
        return this;
      }

      var comparator = getCompareFunction(selector);

      return this.filter(function (el) {
        return !comparator(el, selector);
      });
    },

    parent: function () {
      var result = [];

      this.each(function (item) {
        if (item && item.parentNode) {
          result.push(item.parentNode);
        }
      });

      return unique(result);
    },

    parents: function (selector) {
      var last, result = [];

      this.each(function (item) {
        last = item;

        while (last && last.parentNode && last !== doc.body.parentNode) {
          last = last.parentNode;

          if (!selector || (selector && matches(last, selector))) {
            result.push(last);
          }
        }
      });

      return unique(result);
    },

    prev: function () {
      return cash(this[0].previousElementSibling);
    },

    siblings: function () {
      var collection = this.parent().children(), el = this[0];

      return collection.filter(function (i) {
        return i !== el;
      });
    }

  });


  return cash;
});
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sprite = require('./sprite');

var _sprite2 = _interopRequireDefault(_sprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Enemy extends _sprite2.default {
  constructor(parent, x, y) {
    super(parent);

    this.positionComp.x = x;
    this.positionComp.y = y;

    this.physicsComp = Object.assign(this.physicsComp, {
      width: 20,
      height: 20
    });

    this.appearanceComp.width = this.physicsComp.width;
    this.appearanceComp.height = this.physicsComp.height;
    this.appearanceComp.zIndex = 100;
    this.appearanceComp.bgColor = 'red';

    this.health = 1;
  }

  update(dt) {
    super.update(dt);
    if (this.health <= 0) {
      this.destroy();
    }
  }
}
exports.default = Enemy;

},{"./sprite":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cashDom = require('cash-dom');

var _cashDom2 = _interopRequireDefault(_cashDom);

var _wall = require('./wall');

var _wall2 = _interopRequireDefault(_wall);

var _player = require('./player');

var _player2 = _interopRequireDefault(_player);

var _enemy = require('./enemy');

var _enemy2 = _interopRequireDefault(_enemy);

var _render = require('./systems/render');

var _render2 = _interopRequireDefault(_render);

var _physics = require('./systems/physics');

var _physics2 = _interopRequireDefault(_physics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Game {
  constructor(elem, width, height) {
    this.height = height;
    this.width = width;

    this.positionComp = {
      x: 0,
      y: 0
    };
    this.appearanceComp = {
      $element: (0, _cashDom2.default)(elem),
      width: this.width,
      height: this.height,
      'background-color': 'black'
    };

    this.children = [];
    this.player = null;
    this.systems = [_physics2.default, _render2.default];

    this.reset();
  }

  makeWalls() {
    let walls = [];
    let wallWidth = 30;
    walls.push(new _wall2.default(this, wallWidth / 2, this.height / 2, wallWidth, this.height));
    walls.push(new _wall2.default(this, this.width - wallWidth / 2, this.height / 2, wallWidth, this.height));
    return walls;
  }

  reset() {
    this.children = [];

    this.children.push(...this.makeWalls());

    for (let i = 0; i < 10; i++) {
      this.children.push(new _enemy2.default(this, i * 50 + 100, 400));
    }

    this.player = new _player2.default(this, this.width / 2, 50);
    this.children.push(this.player);
  }

  update(dt) {
    // iterate backwards so we can splice
    for (let i = this.children.length - 1; i >= 0; i--) {
      let sprite = this.children[i];
      if (sprite.alive) {
        sprite.update(dt);
      } else {
        this.children.splice(i, 1);
      }
    }

    _render2.default.update([this]);
    this.systems.forEach(s => {
      s.update(this.children, dt);
    });
  }
}
exports.default = Game;

},{"./enemy":2,"./player":6,"./systems/physics":9,"./systems/render":10,"./wall":12,"cash-dom":1}],4:[function(require,module,exports){
'use strict';

var _game = require('./game');

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const game = new _game2.default(document.getElementById('main'), 640, 480);
let last = Date.now();
const loop = () => {
  let now = Date.now();
  game.update((now - last) / 1000);
  last = now;
  window.requestAnimationFrame(loop);
};

loop();

},{"./game":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cashDom = require('cash-dom');

var _cashDom2 = _interopRequireDefault(_cashDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const KEYCODES = {
  32: 'space',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
};

class Input {
  constructor() {
    this.pressed = {
      space: false,
      left: false,
      up: false,
      right: false,
      down: false
    };

    (0, _cashDom2.default)(document).on('keydown', this.pressKey.bind(this));
    (0, _cashDom2.default)(document).on('keyup', this.releaseKey.bind(this));
  }

  pressKey(evt) {
    let direction = KEYCODES[evt.which];
    if (!direction) {
      return;
    }
    evt.preventDefault();
    this.pressed[direction] = true;
  }

  releaseKey(evt) {
    let direction = KEYCODES[evt.which];
    if (!direction) {
      return;
    }
    evt.preventDefault();
    this.pressed[direction] = false;
  }
}
exports.default = Input;

},{"cash-dom":1}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sprite = require('./sprite');

var _sprite2 = _interopRequireDefault(_sprite);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _projectile = require('./projectile');

var _projectile2 = _interopRequireDefault(_projectile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Player extends _sprite2.default {
  constructor(parent, x, y) {
    super(parent);

    this.positionComp.x = x;
    this.positionComp.y = y;

    this.physicsComp = Object.assign(this.physicsComp, {
      width: 20,
      height: 20,
      collision: {
        type: 'moveable'
      }
    });

    this.appearanceComp.width = this.physicsComp.width;
    this.appearanceComp.height = this.physicsComp.height;
    this.appearanceComp.zIndex = 100;
    this.appearanceComp.bgColor = 'blue';

    this.input = new _input2.default();

    this.speed = 300;
    this.health = 1;
    this.fireRate = 150; // ms between shots
    this.msSinceFired = Infinity;
  }

  move(dt, direction) {
    if (direction === 'left') {
      this.physicsComp.velocity.x = -this.speed;
    } else if (direction === 'right') {
      this.physicsComp.velocity.x = this.speed;
    } else if (direction === 'up') {
      this.physicsComp.velocity.y = this.speed;
    } else if (direction === 'down') {
      this.physicsComp.velocity.y = -this.speed;
    }
  }

  stop() {
    this.physicsComp.velocity.x = 0;
    this.physicsComp.velocity.y = 0;
  }

  shoot() {
    if (this.msSinceFired >= this.fireRate) {
      this.spawnBullet();
      this.msSinceFired = 0;
    }
  }

  spawnBullet() {
    this.parent.children.push(new _projectile2.default(this.parent, this.positionComp.x, this.positionComp.y + this.physicsComp.height, 0, 500, 1));
  }

  update(dt) {
    if (this.input.pressed.left) {
      this.move(dt, 'left');
    } else if (this.input.pressed.right) {
      this.move(dt, 'right');
    } else {
      this.stop();
    }

    if (this.input.pressed.space || this.input.pressed.up) {
      this.shoot();
    }

    this.msSinceFired += dt * 1000;

    super.update(dt);
  }
}
exports.default = Player;

},{"./input":5,"./projectile":7,"./sprite":8}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sprite = require('./sprite');

var _sprite2 = _interopRequireDefault(_sprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Projectile extends _sprite2.default {
  constructor(parent, x, y, vx, vy, lifetime = 2) {
    super(parent);

    this.positionComp.x = x;
    this.positionComp.y = y;

    this.physicsComp = Object.assign(this.physicsComp, {
      width: 6,
      height: 10,
      velocity: {
        x: vx,
        y: vy
      }
    });

    this.appearanceComp.width = this.physicsComp.width;
    this.appearanceComp.height = this.physicsComp.height;
    this.appearanceComp.zIndex = 200;
    this.appearanceComp.bgColor = 'yellow';

    this.lifetime = lifetime;
  }

  update(dt) {
    this.parent.children.forEach(sprite => {
      if (!this.alive || this.parent.player === sprite) {
        return;
      }

      if (this.overlaps(sprite)) {
        sprite.takeDamage(1);
        this.destroy();
      }
    });
    super.update(dt);
  }
}
exports.default = Projectile;

},{"./sprite":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cashDom = require('cash-dom');

var _cashDom2 = _interopRequireDefault(_cashDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Sprite {
  constructor(parent) {
    this.alive = true;
    this.parent = parent;
    this.children = [];

    this.positionComp = {
      x: 0,
      y: 0
    };

    this.physicsComp = {
      width: 10,
      height: 10,
      velocity: {
        x: 0,
        y: 0
      }
    };

    this.appearanceComp = {
      $element: (0, _cashDom2.default)('<div>').addClass('sprite'),
      width: this.physicsComp.width,
      height: this.physicsComp.height,
      bgColor: 'magenta',
      zIndex: 1
    };

    this.health = 0;
    this.lifetime = Infinity;

    parent.appearanceComp.$element.append(this.appearanceComp.$element);
  }

  takeDamage(damage) {
    this.health -= damage;
  }

  overlaps(sprite) {
    if (this === sprite) {
      return false;
    }

    let bounds = {
      left: this.positionComp.x - this.physicsComp.width / 2,
      top: this.positionComp.y + this.physicsComp.height / 2
    };
    bounds.right = bounds.left + this.physicsComp.width;
    bounds.bottom = bounds.top - this.physicsComp.height;

    let compare = {
      left: sprite.positionComp.x - sprite.physicsComp.width / 2,
      top: sprite.positionComp.y + sprite.physicsComp.height / 2
    };
    compare.right = compare.left + sprite.physicsComp.width;
    compare.bottom = compare.top - sprite.physicsComp.height;

    return !(compare.right < bounds.left || compare.left > bounds.right || compare.bottom > bounds.top || compare.top < bounds.bottom);
  }

  update(dt) {
    if (this.lifetime <= 0) {
      this.destroy();
      return;
    }
    this.lifetime -= dt;
  }

  destroy() {
    this.appearanceComp.$element.remove();
    this.alive = false;
    this.parent = null;
    this.children.forEach(sprite => {
      sprite.destroy();
    });
  }
}
exports.default = Sprite;

},{"cash-dom":1}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _system = require('./system');

var _system2 = _interopRequireDefault(_system);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PhysicsSystem extends _system2.default {
  static update(entities, dt) {
    const physicsEntities = entities.filter(e => e.physicsComp);

    physicsEntities.forEach(e => {
      const p = e.positionComp;
      const c = e.physicsComp.collision;
      const v = e.physicsComp.velocity;

      if (!c || c.type !== 'moveable') {
        p.y += v.y * dt;
        p.x += v.x * dt;
        return;
      }

      // naive collision handling, resolve x first
      if (v.x !== 0) {
        p.x += v.x * dt;
        physicsEntities.filter(o => o.physicsComp.collision).forEach(o => {
          if (e.overlaps(o)) {
            if (Math.sign(v.x) > 0) {
              p.x = o.positionComp.x - o.appearanceComp.width / 2 - e.appearanceComp.width / 2;
            } else {
              p.x = o.positionComp.x + o.appearanceComp.width / 2 + e.appearanceComp.width / 2;
            }
          }
        });
      }

      if (v.y !== 0) {
        p.y += v.y * dt;
        physicsEntities.filter(o => o.physicsComp.collision).forEach(o => {
          if (e.overlaps(o)) {
            if (Math.sign(v.y) > 0) {
              p.y = o.positionComp.y - o.appearanceComp.height / 2 - e.appearanceComp.height / 2;
            } else {
              p.y = o.positionComp.y + o.appearanceComp.height / 2 + e.appearanceComp.height / 2;
            }
          }
        });
      }
    });
  }
}
exports.default = PhysicsSystem;

},{"./system":11}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _system = require('./system');

var _system2 = _interopRequireDefault(_system);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RenderSystem extends _system2.default {
  static update(entities, _dt) {
    entities.filter(e => e.appearanceComp).forEach(e => {
      e.appearanceComp.$element.css({
        left: `${e.positionComp.x}px`,
        bottom: `${e.positionComp.y}px`,
        // todo: cache these?
        width: `${e.appearanceComp.width}px`,
        height: `${e.appearanceComp.height}px`,
        'background-color': e.appearanceComp.bgColor,
        'z-index': e.appearanceComp.zIndex
      });
    });
  }
}
exports.default = RenderSystem;

},{"./system":11}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class System {
  static update(_entities, _dt) {}
}
exports.default = System;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sprite = require('./sprite');

var _sprite2 = _interopRequireDefault(_sprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Wall extends _sprite2.default {
  constructor(parent, x, y, width = 50, height = 50) {
    super(parent);

    this.positionComp.x = x;
    this.positionComp.y = y;

    this.physicsComp = Object.assign(this.physicsComp, {
      width,
      height,
      collision: {
        type: 'static'
      }
    });

    this.appearanceComp.width = this.physicsComp.width;
    this.appearanceComp.height = this.physicsComp.height;
    this.appearanceComp.zIndex = 10;
    this.appearanceComp.bgColor = 'gray';

    this.health = 1;
  }
}
exports.default = Wall;

},{"./sprite":8}]},{},[4]);
