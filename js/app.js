(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.reset = function() {
    modules = {};
    cache = {};
    aliases = {};
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
require.register("app.coffee", function(exports, require, module) {
var Application, FooterController, HomeController, MenuController, SideBarController, StoryBarController, routes, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MenuController = require('controllers/menu');

FooterController = require('controllers/footer');

HomeController = require('controllers/home');

SideBarController = require('controllers/sidebar');

StoryBarController = require('controllers/storybar');

routes = require('routes');

'use strict';

module.exports = Application = (function(_super) {
  __extends(Application, _super);

  function Application() {
    _ref = Application.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Application.prototype.initialize = function() {
    window.APP = this;
    this.initDispatcher({
      controllerSuffix: '',
      controllerPath: 'controllers/'
    });
    this.initLayout();
    this.initComposer();
    this.initMediator();
    this.initControllers();
    this.initRouter(routes, {
      root: '/',
      pushState: false
    });
    this.start();
    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
  };

  Application.prototype.initMediator = function() {
    Chaplin.mediator.controllerAction = "";
    return Chaplin.mediator.actionParams = {};
  };

  Application.prototype.initControllers = function() {
    new HomeController;
    new SideBarController;
    new StoryBarController;
    new MenuController;
    return new FooterController;
  };

  return Application;

})(Chaplin.Application);
});

;require.register("controllers/base/controller.coffee", function(exports, require, module) {
'use strict';
var BaseController, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = BaseController = (function(_super) {
  __extends(BaseController, _super);

  function BaseController() {
    _ref = BaseController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return BaseController;

})(Chaplin.Controller);
});

;require.register("controllers/footer.coffee", function(exports, require, module) {
var BaseController, FooterController, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseController = require('controllers/base/controller');

'use strict';

module.exports = FooterController = (function(_super) {
  __extends(FooterController, _super);

  function FooterController() {
    _ref = FooterController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return FooterController;

})(BaseController);
});

;require.register("controllers/home.coffee", function(exports, require, module) {
var HomeController, PageController, log, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PageController = require('controllers/page');

log = require('loglevel');

'use strict';

module.exports = HomeController = (function(_super) {
  __extends(HomeController, _super);

  function HomeController() {
    _ref = HomeController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  HomeController.prototype.showit = function() {
    return false;
  };

  HomeController.prototype.show = function() {
    return log.info('HomeController:show');
  };

  return HomeController;

})(PageController);
});

;require.register("controllers/menu.coffee", function(exports, require, module) {
var BaseController, MenuController, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseController = require('controllers/base/controller');

'use strict';

module.exports = MenuController = (function(_super) {
  __extends(MenuController, _super);

  function MenuController() {
    _ref = MenuController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return MenuController;

})(BaseController);
});

;require.register("controllers/page.coffee", function(exports, require, module) {
var BaseController, PageController, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseController = require('controllers/base/controller');

'use strict';

module.exports = PageController = (function(_super) {
  __extends(PageController, _super);

  function PageController() {
    _ref = PageController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  PageController.prototype.beforeAction = function(actionParams, controllerOptions) {
    Chaplin.mediator.controllerAction = controllerOptions.action;
    return Chaplin.mediator.actionParams = actionParams;
  };

  return PageController;

})(BaseController);
});

;require.register("controllers/sidebar.coffee", function(exports, require, module) {
var BaseController, SSView, SideBarController, StoryCollection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseController = require('controllers/base/controller');

StoryCollection = require('models/stories');

SSView = require('views/sidebar-view');

'use strict';

module.exports = SideBarController = (function(_super) {
  __extends(SideBarController, _super);

  function SideBarController() {
    _ref = SideBarController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SideBarController.prototype.initialize = function() {
    SideBarController.__super__.initialize.apply(this, arguments);
    this.stories = new StoryCollection;
    return this.view = new SSView(this.stories, function(s) {
      return (s.get('siteHandle')) === siteHandle;
    });
  };

  SideBarController.prototype.showit = function() {
    return this.view.render();
  };

  return SideBarController;

})(BaseController);
});

;require.register("controllers/storybar.coffee", function(exports, require, module) {
var BaseController, StoryBarController, StoryCollection, StorybarView, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

BaseController = require('controllers/base/controller');

StoryCollection = require('models/stories');

StorybarView = require('views/storybar-view');

'use strict';

module.exports = StoryBarController = (function(_super) {
  __extends(StoryBarController, _super);

  function StoryBarController() {
    _ref = StoryBarController.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  StoryBarController.prototype.initialize = function() {
    StoryBarController.__super__.initialize.apply(this, arguments);
    this.stories = new StoryCollection;
    return this.view = new StorybarView(this.stories, function(s) {
      return (s.get('siteHandle')) !== siteHandle;
    });
  };

  StoryBarController.prototype.showit = function() {
    return this.view.render(function() {});
  };

  return StoryBarController;

})(BaseController);
});

;require.register("generated/all-posts.js", function(exports, require, module) {
module.exports = [{"debug":"","className":"Story","created":"2011-03-18 15:48:28","lastEdited":"2011-03-18 16:01:59","title":"Aloha 'Oe to Something","published":"2011-03-18 16:01:59","embargo":"2011-03-18 16:01:59","category":"island-life/honolulu","slug":"aloha-oe-to-something","snippets":{},"domain":"stjohnsjim.com","hVersion":0.1,"memberOf":[],"siteHandle":"stjohnsjim","headlines":["What Have We Lost? Really","Did We Ever Get It Right?","Memories Are Today's Myth","Honolulu Ghosts"]},{"debug":"","className":"Story","created":"2010-10-03 16:18:48","lastEdited":"2010-10-03 17:41:29","title":"Catchy Slogan Sunday","published":"2010-10-03 17:41:29","embargo":"2010-10-03 17:41:29","category":"st-johns","slug":"catchy-slogan-sunday","headlines":["Wherin We Meet Bambi Brew"],"snippets":{},"domain":"stjohnsjim.com","hVersion":0.1,"memberOf":["GUNAS","PDX"],"siteHandle":"stjohnsjim"},{"debug":"","className":"Story","created":"2011-06-07 13:42:29","lastEdited":"2011-06-07 17:17:07","title":"Coala: Harbor Cat","published":"2011-06-07 17:17:07","embargo":"2011-06-07 17:17:07","headlines":["Confrontations with Sea Deamons!","Cats Adrift!","Dead Cat Tells All!"],"category":"california","slug":"coala-harbor-cat","snippets":{},"domain":"stjohnsjim.com","hVersion":0.1,"memberOf":["GUNAS"],"siteHandle":"stjohnsjim"},{"debug":"","className":"Story","created":"2010-12-01 17:23:35","lastEdited":"2010-12-01 18:04:05","title":"Corporate Punishment is Your Path to Financial Security","published":"2010-12-01 18:04:05","embargo":"2010-12-01 18:04:05","headlines":["Good Times in the Slammer!","Don't Think of it as Prison, but...","Serving Your Employers, Not Just Serving Time","We Pay Your Bodyguard Well!"],"category":"story","slug":"corporate-punishment-is-your-path-to-financial-security","snippets":{},"domain":"stjohnsjim.com","hVersion":0.1,"memberOf":["TAROT"],"siteHandle":"stjohnsjim"},{"debug":"","className":"Story","created":"2010-11-12 16:53:25","lastEdited":"2010-11-12 18:04:12","title":"Deadwood?","published":"2010-11-12 18:04:12","embargo":"2010-11-12 18:04:12","category":"almost-history","headlines":["The Scout and The Colonel","Legend of the Old West"],"slug":"deadwood","snippets":{},"domain":"stjohnsjim.com","hVersion":0.1,"siteHandle":"stjohnsjim"},{"debug":"","title":"Good News Bad News","slug":"good-news-bad-news","created":"2015-12-02T05:26:30.000Z","lastEdited":"2016-03-17","published":"2016-01-01","embargo":"2016-01-01","archive":"2016-01-01","category":"announcement","categories":["general"],"date":"2015-12-31T22:51:40.000Z","priority":2000,"tags":null,"siteHandle":"bamboosnow","headlines":["Insane Inventor Finds Greatest Boon in Dust","Saipan Scientist Proves Everything He Knew was Wrong!","Bamboo Snow is Purified Bamboo!"]},{"debug":"marked","className":"Story","created":"2016-03-11 12:40:04","lastEdited":"2016-03-11 14:20:28","title":"Bamboo Snow Starts Here","embargo":"2016-03-11 12:40:04","category":"/","slug":"index","siteHandle":"bamboosnow","domain":"bamboosnow.com","headlines":["Inventor Discovers Miracle Substance","Dust Farmer Tells All","Better Hygiene With Bamboo Snow","A Discovery that Slept for a Million Years"],"hVersion":0.1,"memberOf":[],"snippets":{}},{"debug":"","className":"Story","created":"2016-03-11 12:40:04","lastEdited":"2016-03-11 14:20:28","title":"Grand Visions from the 'Puter of St. John's Jim","published":"2016-03-11 12:40:04","headlines":["Visions of Beauty Obscured","The Most Beautiful Bridge, But?!?!","Hookers Hook in the Great Northwest!","Tales from Pre-legalization!"],"category":"/","slug":"index","siteHandle":"stjohnsjim","domain":"stjohnsjim.com","hVersion":0.1,"memberOf":[],"snippets":{},"embargo":"2016-03-11 12:40:04"},{"debug":"","title":"New Look!","slug":"new-look","created":"2016-04-08","lastEdited":"2016-04-06","published":"2016-04-06","embargo":"2016-04-06","category":"announcement","className":"Story","siteHandle":"stjohnsjim","headlines":["New Presses Roll on St John's Jim Stories!","Stories of The Bizarre and Normal: Portland, Saipan and elsewhere"]},{"debug":"","title":"Sweeping Compound","slug":"sweeping-compound","created":"2015-12-02T05:26:30.000Z","lastEdited":"2016-03-17","published":"2015-12-31","embargo":"2015-12-31","category":"products/industrial","categories":["products","raw"],"tags":["oil spill","floor cleaner","sweeping compound"],"headlines":["Sweep Away Messes without Water","Tames the Messiest Spills","Clean Up That Garage Floor!"],"siteHandle":"bamboosnow"},{"debug":"","title":"The Big Picture","slug":"the-big-picture","date":"2016-01-03T22:33:13.000Z","created":"2015-12-02T05:26:30.000Z","lastEdited":"2016-03-17","published":"2015-12-31","embargo":"2015-12-31","headlines":["A Rising Tide Lifts All boats","Nature is the source of all abundance","A new natural resource to lift our boats","Many Uses, Many Opportunities"],"category":"announcement","siteHandle":"bamboosnow"},{"debug":"","className":"Story","created":"2011-08-05 18:38:57","lastEdited":"2016-04-15","embargo":"2016-04-15","title":"The Great Aerial Tram Station","published":"2011-08-05 18:54:38","tagList":"Pathy, Winnie, Daough Sisters, aerial tram, portland, st. john's, Leo, Station, Portland's Malibu","category":"st-johns/baltimore-wood","slug":"the-great-aerial-tram-station","headlines":["Leo and Station's Very Odd Internet School","Treetop Transportation from Recycled Materials"],"snippets":{},"domain":"stjohnsjim.com","hVersion":0.1,"memberOf":["TAO"],"siteHandle":"stjohnsjim"},{"debug":"","className":"Story","created":"2010-12-28 21:35:15","lastEdited":"2011-11-09 10:24:21","title":"The Norse Psychologist Files on Thor","published":"2010-12-28 22:08:13","embargo":"2010-12-28 22:08:13","category":"almost-history","slug":"the-norse-psychologist-files-on-thor","headlines":["Could The End Times be This Bizarre?","Modern Psychology for the Elder Gods","Thor's HIPAA Account Cracked!"],"snippets":{},"domain":"stjohnsjim.com","hVersion":0.1,"memberOf":["TAROT"],"siteHandle":"stjohnsjim"},{"debug":"","title":"Two Years with Bamboo Snow","slug":"two-years-with-bamboo-snow","created":"2015-12-25T00:00:00.000Z","lastEdited":"2016-03-17","published":"2015-12-31","embargo":"2015-12-31","category":"announcement","headlines":["The Most Import Announcement in 100,000 Years"],"categories":["announcement"],"Tags":["testimonial","economic impact"],"priority":1000,"comments":true,"siteHandle":"bamboosnow"}];
});

require.register("generated/sites.js", function(exports, require, module) {
module.exports = {"bamboosnow":{"author":"James A. Hinds: Bubba Baba Bamboo Jim","description":"All that is known about Bamboo Snow","title":"Bamboo Snow: The Amazing Substance","keywords":"bamboo snow,dinoderus minutus,absorbant,dessicant,organic,bamboo byproduct,bamboo","rsyncDestination":"stjohnsjim@stjohnsjim.com:bamboosnow.com","port":3131,"lurl":"0.0.0.0","template":{}},"stjohnsjim":{"author":"James A. Hinds: St. John's Jim","title":"Stories from the 'Puter of St. John's Jim","description":"Stories from the 'Puter of St. John's Jim","lurl":"stjohnsjim.com","keywords":"Pier Park, Cathedral Park, fiction, North Portland,St. John's, st johns","rsyncDestination":"stjohnsjim@stjohnsjim.com:stjohnsjim.com","template":{}}};
});

require.register("initialize.coffee", function(exports, require, module) {
var Application, FontFaceObserver, routes;

Application = require('app');

routes = require('routes');

FontFaceObserver = require('font-face-observer');

$(function() {
  var app;
  return app = new Application({
    title: 'Brunch example application',
    controllerSuffixNot: '-controller',
    routes: routes
  });
});
});

;require.register("lib/utils.coffee", function(exports, require, module) {
' use strict';
var mediator, utils,
  __hasProp = {}.hasOwnProperty,
  __slice = [].slice;

mediator = Chaplin.mediator;

utils = Chaplin.utils.beget(Chaplin.utils);

_(utils).extend({
  camelize: (function() {
    var camelizer, regexp;
    regexp = /[-_]([a-z])/g;
    camelizer = function(match, c) {
      return c.toUpperCase();
    };
    return function(string) {
      return string.replace(regexp, camelizer);
    };
  })(),
  dasherize: function(string) {
    return string.replace(/[A-Z]/g, function(char, index) {
      return (index !== 0 ? '-' : '') + char.toLowerCase();
    });
  },
  sessionStorage: (function() {
    if (window.sessionStorage && sessionStorage.getItem && sessionStorage.setItem && sessionStorage.removeItem) {
      return function(key, value) {
        if (typeof value === 'undefined') {
          value = sessionStorage.getItem(key);
          if ((value != null) && value.toString) {
            return value.toString();
          } else {
            return value;
          }
        } else {
          sessionStorage.setItem(key, value);
          return value;
        }
      };
    } else {
      return function(key, value) {
        if (typeof value === 'undefined') {
          return utils.getCookie(key);
        } else {
          utils.setCookie(key, value);
          return value;
        }
      };
    }
  })(),
  sessionStorageRemove: (function() {
    if (window.sessionStorage && sessionStorage.getItem && sessionStorage.setItem && sessionStorage.removeItem) {
      return function(key) {
        return sessionStorage.removeItem(key);
      };
    } else {
      return function(key) {
        return utils.expireCookie(key);
      };
    }
  })(),
  getCookie: function(key) {
    var pair, pairs, val, _i, _len;
    pairs = document.cookie.split('; ');
    for (_i = 0, _len = pairs.length; _i < _len; _i++) {
      pair = pairs[_i];
      val = pair.split('=');
      if (decodeURIComponent(val[0]) === key) {
        return decodeURIComponent(val[1] || '');
      }
    }
    return null;
  },
  setCookie: function(key, value, options) {
    var expires, getOption, payload;
    if (options == null) {
      options = {};
    }
    payload = "" + (encodeURIComponent(key)) + "=" + (encodeURIComponent(value));
    getOption = function(name) {
      if (options[name]) {
        return "; " + name + "=" + options[name];
      } else {
        return '';
      }
    };
    expires = options.expires ? "; expires=" + (options.expires.toUTCString()) : '';
    return document.cookie = [payload, expires, getOption('path'), getOption('domain'), getOption('secure')].join('');
  },
  expireCookie: function(key) {
    return document.cookie = "" + key + "=nil; expires=" + ((new Date).toGMTString());
  },
  loadLib: function(url, success, error, timeout) {
    var head, onload, script, timeoutHandle;
    if (timeout == null) {
      timeout = 7500;
    }
    head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    script = document.createElement('script');
    script.async = 'async';
    script.src = url;
    onload = function(_, aborted) {
      if (aborted == null) {
        aborted = false;
      }
      if (!(aborted || !script.readyState || script.readyState === 'complete')) {
        return;
      }
      clearTimeout(timeoutHandle);
      script.onload = script.onreadystatechange = script.onerror = null;
      if (head && script.parentNode) {
        head.removeChild(script);
      }
      script = void 0;
      if (success && !aborted) {
        return success();
      }
    };
    script.onload = script.onreadystatechange = onload;
    script.onerror = function() {
      onload(null, true);
      if (error) {
        return error();
      }
    };
    timeoutHandle = setTimeout(script.onerror, timeout);
    return head.insertBefore(script, head.firstChild);
  },
  deferMethods: function(options) {
    var deferred, func, host, methods, methodsHash, name, onDeferral, target, _i, _len, _results;
    deferred = options.deferred;
    methods = options.methods;
    host = options.host || deferred;
    target = options.target || host;
    onDeferral = options.onDeferral;
    methodsHash = {};
    if (typeof methods === 'string') {
      methodsHash[methods] = host[methods];
    } else if (methods.length && methods[0]) {
      for (_i = 0, _len = methods.length; _i < _len; _i++) {
        name = methods[_i];
        func = host[name];
        if (typeof func !== 'function') {
          throw new TypeError("utils.deferMethods: method " + name + " notfound on host " + host);
        }
        methodsHash[name] = func;
      }
    } else {
      methodsHash = methods;
    }
    _results = [];
    for (name in methodsHash) {
      if (!__hasProp.call(methodsHash, name)) continue;
      func = methodsHash[name];
      if (typeof func !== 'function') {
        continue;
      }
      _results.push(target[name] = utils.createDeferredFunction(deferred, func, target, onDeferral));
    }
    return _results;
  },
  createDeferredFunction: function(deferred, func, context, onDeferral) {
    if (context == null) {
      context = deferred;
    }
    return function() {
      var args;
      args = arguments;
      if (deferred.state() === 'resolved') {
        return func.apply(context, args);
      } else {
        deferred.done(function() {
          return func.apply(context, args);
        });
        if (typeof onDeferral === 'function') {
          return onDeferral.apply(context);
        }
      }
    };
  },
  accumulator: {
    collectedData: {},
    handles: {},
    handlers: {},
    successHandlers: {},
    errorHandlers: {},
    interval: 2000
  },
  wrapAccumulators: function(obj, methods) {
    var func, name, _i, _len,
      _this = this;
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      name = methods[_i];
      func = obj[name];
      if (typeof func !== 'function') {
        throw new TypeError("utils.wrapAccumulators: method " + name + " not found");
      }
      obj[name] = utils.createAccumulator(name, obj[name], obj);
    }
    return $(window).unload(function() {
      var handler, _ref, _results;
      _ref = utils.accumulator.handlers;
      _results = [];
      for (name in _ref) {
        handler = _ref[name];
        _results.push(handler({
          async: false
        }));
      }
      return _results;
    });
  },
  createAccumulator: function(name, func, context) {
    var acc, accumulatedError, accumulatedSuccess, cleanup, id;
    if (!(id = func.__uniqueID)) {
      id = func.__uniqueID = name + String(Math.random()).replace('.', '');
    }
    acc = utils.accumulator;
    cleanup = function() {
      delete acc.collectedData[id];
      delete acc.successHandlers[id];
      return delete acc.errorHandlers[id];
    };
    accumulatedSuccess = function() {
      var handler, handlers, _i, _len;
      handlers = acc.successHandlers[id];
      if (handlers) {
        for (_i = 0, _len = handlers.length; _i < _len; _i++) {
          handler = handlers[_i];
          handler.apply(this, arguments);
        }
      }
      return cleanup();
    };
    accumulatedError = function() {
      var handler, handlers, _i, _len;
      handlers = acc.errorHandlers[id];
      if (handlers) {
        for (_i = 0, _len = handlers.length; _i < _len; _i++) {
          handler = handlers[_i];
          handler.apply(this, arguments);
        }
      }
      return cleanup();
    };
    return function() {
      var data, error, handler, rest, success;
      data = arguments[0], success = arguments[1], error = arguments[2], rest = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
      if (data) {
        acc.collectedData[id] = (acc.collectedData[id] || []).concat(data);
      }
      if (success) {
        acc.successHandlers[id] = (acc.successHandlers[id] || []).concat(success);
      }
      if (error) {
        acc.errorHandlers[id] = (acc.errorHandlers[id] || []).concat(error);
      }
      if (acc.handles[id]) {
        return;
      }
      handler = function(options) {
        var args, collectedData;
        if (options == null) {
          options = options;
        }
        if (!(collectedData = acc.collectedData[id])) {
          return;
        }
        args = [collectedData, accumulatedSuccess, accumulatedError].concat(rest);
        func.apply(context, args);
        clearTimeout(acc.handles[id]);
        delete acc.handles[id];
        return delete acc.handlers[id];
      };
      acc.handlers[id] = handler;
      return acc.handles[id] = setTimeout((function() {
        return handler();
      }), acc.interval);
    };
  },
  afterLogin: function() {
    var args, context, eventType, func, loginHandler;
    context = arguments[0], func = arguments[1], eventType = arguments[2], args = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
    if (eventType == null) {
      eventType = 'login';
    }
    if (mediator.user) {
      return func.apply(context, args);
    } else {
      loginHandler = function() {
        mediator.unsubscribe(eventType, loginHandler);
        return func.apply(context, args);
      };
      return mediator.subscribe(eventType, loginHandler);
    }
  },
  deferMethodsUntilLogin: function(obj, methods, eventType) {
    var func, name, _i, _len, _results;
    if (eventType == null) {
      eventType = 'login';
    }
    if (typeof methods === 'string') {
      methods = [methods];
    }
    _results = [];
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      name = methods[_i];
      func = obj[name];
      if (typeof func !== 'function') {
        throw new TypeError("utils.deferMethodsUntilLogin: method " + name + "not found");
      }
      _results.push(obj[name] = _(utils.afterLogin).bind(null, obj, func, eventType));
    }
    return _results;
  },
  ensureLogin: function() {
    var args, context, e, eventType, func, loginContext;
    context = arguments[0], func = arguments[1], loginContext = arguments[2], eventType = arguments[3], args = 5 <= arguments.length ? __slice.call(arguments, 4) : [];
    if (eventType == null) {
      eventType = 'login';
    }
    utils.afterLogin.apply(utils, [context, func, eventType].concat(__slice.call(args)));
    if (!mediator.user) {
      if ((e = args[0]) && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      return mediator.publish('!showLogin', loginContext);
    }
  },
  ensureLoginForMethods: function(obj, methods, loginContext, eventType) {
    var func, name, _i, _len, _results;
    if (eventType == null) {
      eventType = 'login';
    }
    if (typeof methods === 'string') {
      methods = [methods];
    }
    _results = [];
    for (_i = 0, _len = methods.length; _i < _len; _i++) {
      name = methods[_i];
      func = obj[name];
      if (typeof func !== 'function') {
        throw new TypeError("utils.ensureLoginForMethods: method " + name + "not found");
      }
      _results.push(obj[name] = _(utils.ensureLogin).bind(null, obj, func, loginContext, eventType));
    }
    return _results;
  },
  facebookImageURL: function(fbId, type) {
    var accessToken, params;
    if (type == null) {
      type = 'square';
    }
    params = {
      type: type
    };
    if (mediator.user) {
      accessToken = mediator.user.get('accessToken');
      if (accessToken) {
        params.access_token = accessToken;
      }
    }
    return "https://graph.facebook.com/" + fbId + "/picture?" + ($.param(params));
  }
});

module.exports = utils;
});

;require.register("models/base/collection.coffee", function(exports, require, module) {
var Collection, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Collection = (function(_super) {
  __extends(Collection, _super);

  function Collection() {
    _ref = Collection.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Collection;

})(Chaplin.Collection);
});

;require.register("models/base/model.coffee", function(exports, require, module) {
var Model, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = Model = (function(_super) {
  __extends(Model, _super);

  function Model() {
    _ref = Model.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return Model;

})(Chaplin.Model);
});

;require.register("models/navigation.coffee", function(exports, require, module) {
var Model, Navigation, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('models/base/model');

'use strict';

module.exports = Navigation = (function(_super) {
  __extends(Navigation, _super);

  function Navigation() {
    _ref = Navigation.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Navigation.prototype.defaults = {
    items: [
      {
        href: '/',
        title: 'Likes Browser'
      }, {
        href: '/posts',
        title: 'Wall Posts'
      }
    ]
  };

  return Navigation;

})(Model);
});

;require.register("models/stories.coffee", function(exports, require, module) {
var Collection, Stories, Story, allStories, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Collection = require('models/base/collection', Story = require('models/story'));

allStories = require('generated/all-posts');

'use strict';

module.exports = Stories = (function(_super) {
  __extends(Stories, _super);

  function Stories() {
    this.fetch = __bind(this.fetch, this);
    _ref = Stories.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Stories.prototype.model = Story;

  Stories.prototype.initialize = function() {
    Stories.__super__.initialize.apply(this, arguments);
    return this.fetch();
  };

  Stories.prototype.fetch = function() {
    console.debug('stories#fetch');
    return this.push(allStories);
  };

  return Stories;

})(Collection);
});

;require.register("models/story.coffee", function(exports, require, module) {
var Model, Sites, Story, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('models/base/model');

Sites = require('generated/sites');

'use strict';

module.exports = Story = (function(_super) {
  __extends(Story, _super);

  function Story() {
    this.href = __bind(this.href, this);
    _ref = Story.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Story.prototype.href = function(against) {
    var ref, sitePort, siteUrl;
    if (against == null) {
      against = false;
    }
    ref = "" + (this.get('category')) + "/" + (this.get('slug')) + ".html";
    if (!against || against === window.siteHandle) {
      return ref;
    }
    if (against.match('/')) {
      return "" + against + "/" + ref;
    }
    siteUrl = Sites[against].lurl;
    sitePort = Sites[against].port;
    if (!sitePort) {
      return "http://" + siteUrl + "/" + ref;
    }
    return "http://" + siteUrl + ":" + sitePort + "/" + ref;
  };

  Story.prototype.initialize = function() {
    Story.__super__.initialize.apply(this, arguments);
    return console.debug('Story#initialize');
  };

  return Story;

})(Model);
});

;require.register("models/user.coffee", function(exports, require, module) {
var Model, User, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Model = require('models/base/model');

'use strict';

module.exports = User = (function(_super) {
  __extends(User, _super);

  function User() {
    _ref = User.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return User;

})(Model);
});

;require.register("routes.coffee", function(exports, require, module) {
'use strict';
var routes;

routes = function(match) {
  match('/', 'home#show');
  return match('showit', 'sidebar#showit');
};

module.exports = routes;

return routes;
});

;require.register("views/sidebar-view.coffee", function(exports, require, module) {
var B, StoryBarView, T, Template, template,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

T = require('teacup');

B = require('backbone');

Template = require("payload-/" + siteHandle);

template = new Template;

module.exports = StoryBarView = (function(_super) {
  __extends(StoryBarView, _super);

  StoryBarView.prototype.autoRender = true;

  StoryBarView.prototype.autoAttach = true;

  function StoryBarView(collection, filter) {
    this.collection = collection;
    this.filter = filter != null ? filter : function() {
      return true;
    };
    this.getTemplateFunction = __bind(this.getTemplateFunction, this);
    this.getTemplateData = __bind(this.getTemplateData, this);
    StoryBarView.__super__.constructor.apply(this, arguments);
  }

  StoryBarView.prototype.el = "#sidebar";

  StoryBarView.prototype.getTemplateData = function() {
    var intermediate, stuff;
    intermediate = this.collection.filter(this.filter, this);
    stuff = _(intermediate).sortBy(function(s) {
      return s.get('category');
    }).groupBy(function(s) {
      return s.get('category');
    });
    return stuff;
  };

  StoryBarView.prototype.getTemplateFunction = function() {
    return T.renderable(function(data) {
      template.widgetWrap({
        title: "Contents"
      }, function() {
        return data.each(function(allCrap, category, stuff) {
          var catPostfix, catPrefix, headliner, stories,
            _this = this;
          if (category === '/') {
            return;
          }
          stories = stuff[category];
          catPostfix = category.match(/\/?[^\/]+$/);
          catPrefix = category.replace(/[^\/]/g, '');
          catPrefix = catPrefix.replace(/\//g, ' -');
          catPostfix = catPostfix.toString().replace(/\//g, '- ');
          headliner = _(stories).find(function(story) {
            return 'category' === story.get('className');
          });
          if (headliner) {
            T.h3(".category", function() {
              T.text("" + category + ": ");
              return T.em(".h4", _.sample(headliner.get('headlines')));
            });
          } else {
            T.h3(".category", "" + catPrefix + " " + catPostfix);
          }
          T.ul(".category.pr1", function() {
            return _(stuff[category]).each(function(story) {
              if ('category' === story.get('className')) {
                return;
              }
              return T.li(".category.b1", function() {
                return T.a(".goto.h3.category", {
                  href: siteHandle === story.get('siteHandle') ? story.href() : story.href(story.get('siteHandle'))
                }, "" + (story.get('title')));
              });
            });
          });
          return T.hr();
        });
      });
    });
  };

  return StoryBarView;

})(Chaplin.View);
});

;require.register("views/storybar-view.coffee", function(exports, require, module) {
var SidebarStoryView, T,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

T = require('teacup');

module.exports = SidebarStoryView = (function(_super) {
  __extends(SidebarStoryView, _super);

  SidebarStoryView.prototype.autoRender = true;

  SidebarStoryView.prototype.autoAttach = true;

  function SidebarStoryView(collection, filter) {
    this.collection = collection;
    this.filter = filter;
    this.getTemplateData = __bind(this.getTemplateData, this);
    this.data = this.collection.shuffle().filter(this.filter, this);
    SidebarStoryView.__super__.constructor.apply(this, arguments);
  }

  SidebarStoryView.prototype.el = ".siteInvitation";

  SidebarStoryView.prototype.getTemplateData = function() {
    return this.data;
  };

  SidebarStoryView.prototype.getTemplateFunction = function() {
    var _this = this;
    return function(data) {
      return function(a, b, c) {
        var V, badClass, badHeadline, story;
        story = null;
        while (!story) {
          story = data.pop();
          if (!story) {
            return null;
          }
          badClass = 'category' === story.get('className');
          badHeadline = !(story.get('headlines'));
          if (badClass || badHeadline) {
            story = null;
          }
        }
        return V = T.render(function() {
          var _this = this;
          return T.a(".goto", {
            href: siteHandle === story.get('siteHandle') ? story.href() : story.href(story.get('siteHandle'))
          }, function() {
            return T.div(".b1.bg-silver.bg-darken-3.mb1.ml2.border.rounded.p1", function() {
              T.h4(".adv-head", "From around the Web:");
              return T.h6(".adv-text", "" + (story.get('title')) + ": " + (_.sample(story.get('headlines'))));
            });
          });
        });
      };
    };
  };

  return SidebarStoryView;

})(Chaplin.View);
});

;require.register("payload-/bamboosnow.coffee", function(exports, require, module) {
/*
styling: "Lookand Feel"
*/

var BamboosnowLook, a, article, aside, badDog2, base, blockquote, body, br, button, comment, div, doctype, em, footer, form, h1, h2, h3, h4, h5, h6, head, header, headerLogoNav, hr, html, img, input, li, link, meta, myfooter, nav, normalizeArgs, p, raw, render, renderable, script, section, span, strong, tag, text, time, title, ul, _ref;

_ref = require("teacup"), img = _ref.img, normalizeArgs = _ref.normalizeArgs, render = _ref.render, doctype = _ref.doctype, html = _ref.html, title = _ref.title, meta = _ref.meta, base = _ref.base, link = _ref.link, script = _ref.script, body = _ref.body, header = _ref.header, raw = _ref.raw, section = _ref.section, p = _ref.p, text = _ref.text, em = _ref.em, ul = _ref.ul, li = _ref.li, strong = _ref.strong, hr = _ref.hr, comment = _ref.comment, div = _ref.div, a = _ref.a, span = _ref.span, h1 = _ref.h1, h2 = _ref.h2, h3 = _ref.h3, h4 = _ref.h4, h5 = _ref.h5, h6 = _ref.h6, head = _ref.head, renderable = _ref.renderable, blockquote = _ref.blockquote, nav = _ref.nav, form = _ref.form, input = _ref.input, button = _ref.button, aside = _ref.aside, br = _ref.br, time = _ref.time, tag = _ref.tag, article = _ref.article, footer = _ref.footer;

try {
  $(function() {
    var FontFaceObserver, observeTeamSpirit, observeVastShadow, observeVidaLoca;
    FontFaceObserver = require('font-face-observer');
    observeTeamSpirit = new FontFaceObserver("TeamSpirit", {
      weight: 400
    });
    observeTeamSpirit.check(null, 10000).then(function() {
      return document.documentElement.className += " team-spirit-loaded";
    }, function() {
      return alert("TeamSpirit Font Problem?!");
    });
    observeVidaLoca = new FontFaceObserver("vidaloka", {
      weight: 400
    });
    observeVidaLoca.check(null, 10000).then(function() {
      return document.documentElement.className += " vidaloka-loaded";
    }, function() {
      return alert("Vida Loka Font Problem?!");
    });
    observeVastShadow = new FontFaceObserver("vastshadow", {
      weight: 400
    });
    return observeVastShadow.check(null, 10000).then(function() {
      return document.documentElement.className += " vastshadow-loaded";
    }, function() {
      return alert("vastshadow Font Problem?!");
    });
  });
} catch (_error) {
  badDog2 = _error;
  console.log("Font Loader Error");
  console.log(badDog2);
}

headerLogoNav = require('./header-logo-nav');

myfooter = require('./footer');

module.exports = BamboosnowLook = (function() {
  function BamboosnowLook() {}

  BamboosnowLook.prototype.widgetWrap = function() {
    var attrs, contents, id, _ref1;
    _ref1 = normalizeArgs(arguments), attrs = _ref1.attrs, contents = _ref1.contents;
    id = attrs.id;
    delete attrs.id;
    title = attrs.title;
    delete attrs.title;
    if (attrs["class"] != null) {
      attrs["class"].push("widget-wrap");
    } else {
      attrs["class"] = ["widget-wrap"];
    }
    return div(attrs, function() {
      if (!!title) {
        h3(".widget-title.white", title);
      }
      return div(".widget.white", contents);
    });
  };

  BamboosnowLook.prototype.formatStory = renderable(function(story) {
    var options;
    options = story.attributes;
    comment("\nThe Body\n");
    return body(function() {
      div('.flex.flex-column', {
        style: 'min-height:100vh'
      }, function() {
        header('.center.flex-wrap.p2.border-bottom.bg-darken-4', function() {
          return a({
            href: '//bamboosnow.com',
            target: '_blank'
          }, function() {
            return h1('.white', 'Bamboo Snow -- Multi-Purpose Boon for the World');
          });
        });
        div('.flex-auto.md-flex', function() {
          tag("main", '#storybar.flex-auto.order-1.with-columns.p2.bg-lighten-4', function() {
            h1(options.title);
            hr();
            return raw(story.tmp.cooked || story.get("final"));
          });
          nav('#sidebar.order-0.bg-darken-2.flex-auto.col-3', {
            style: 'min-width:22rem'
          }, function() {
            h1("Sidebar");
            return p('Sidebar');
          });
          if (false) {
            return aside('#sidebar2.p2.border-left.order-3.col-2', {
              style: 'min-width:8rem'
            }, function() {
              h1("Sidebar2");
              return p('Sidebar2');
            });
          }
        });
        return footer('.p2.border-top.bg-silver', function() {
          h2('.center.m0', 'All contents copyright 2015, James A. Hinds');
          div('.center', function() {
            img('.circle', {
              src: 'http://www.gravatar.com/avatar/c105eda1978979dfb13059b8878ef95d'
            });
            br();
            return text('AKA Bamboo Jim');
          });
          h4('.center.m0', 'The ideas are yours to keep and share, the wording is mine.');
          br();
          return a({
            href: 'http://basscss.com/',
            target: '_blank'
          }, 'CSS -- BassCss.com');
        });
      });
      return div("#cover", {
        style: "background-image:url('/images/cover.jpg');"
      });
    });
  });

  return BamboosnowLook;

})();
});

;require.register("payload-/baranquillo/about.js", function(exports, require, module) {
+function($) {
    'use strict';

    // Fade out the blog and let drop the about card of the author and vice versa

    /**
     * AboutCard
     * @constructor
     */
    var AboutCard = function() {
        this.$openBtn   = $("#sidebar, #header").find("a[href*='#about']");
        this.$closeBtn  = $('#about-btn-close');
        this.$blog      = $('#blog');
        this.$about     = $('#about');
        this.$aboutCard = $('#about-card');
    };

    AboutCard.prototype = {

        /**
         * Run AboutCard feature
         */
        run: function() {
            var self = this;
            // Detect click on open button
            self.$openBtn.click(function(e) {
                e.preventDefault();
                self.play();
            });
            // Detect click on close button
            self.$closeBtn.click(function(e) {
                e.preventDefault();
                self.playBack();
            });
        },

        /**
         * Play the animation
         */
        play: function() {
            var self = this;
            // Fade out the blog
            self.$blog.fadeOut();
            // Fade in the about card
            self.$about.fadeIn();
            // Small timeout to drop the about card after that
            // the about card fade in and the blog fade out
            setTimeout(function() {
                self.dropAboutCard();
            }, 300);
        },

        /**
         * Play back the animation
         */
        playBack: function() {
            var self = this;

            // Lift the about card
            self.liftAboutCard();
            // Fade in the blog after that the about card lifted up
            setTimeout(function() {
                self.$blog.fadeIn();
            }, 500);
            // Fade out the about card after that the about card lifted up
            setTimeout(function() {
                self.$about.fadeOut();
            }, 500);
        },

        /**
         * Slide the card to the middle
         */
        dropAboutCard: function() {
            var self            = this;
            var aboutCardHeight = self.$aboutCard.innerHeight();

            self.$aboutCard
                .css('top', '0px')
                .css('top', '-' + aboutCardHeight + 'px')
                .show(500, function() {
                    self.$aboutCard.animate({
                        top: '+=' + (($(window).height() / 2) - (aboutCardHeight / 2) + aboutCardHeight) + 'px'
                    });
                });
        },

        /**
         * Slide the card to the top
         */
        liftAboutCard: function() {
            var self            = this;
            var aboutCardHeight = self.$aboutCard.innerHeight();

            self.$aboutCard.animate({
                top: '-=' + (($(window).height() / 2) - (aboutCardHeight / 2) + aboutCardHeight) + 'px'
            }, 500, function() {
                self.$aboutCard.hide();
            });
        }
    };

    $(document).ready(function() {
        var aboutCard = new AboutCard();
        aboutCard.run();
    });
}(jQuery);
});

require.register("payload-/baranquillo/archives-filter.js", function(exports, require, module) {
+function($) {
    'use strict';

    // Filter posts by using their date on archives page : `/archives`

    /**
     * ArchivesFilter
     * @param archivesElem
     * @constructor
     */
    var ArchivesFilter = function(archivesElem) {
        this.$form          = $(archivesElem).find('#filter-form');
        this.$searchInput   = $(archivesElem).find('input[name=date]');
        this.$archiveResult = $(archivesElem).find('.archive-result');
        this.$postsYear     = $(archivesElem).find('.archive-year');
        this.$postsMonth    = $(archivesElem).find('.archive-month');
        this.$postsDay      = $(archivesElem).find('.archive-day');
        this.postsYear      = archivesElem + ' .archive-year';
        this.postsMonth     = archivesElem + ' .archive-month';
        this.postsDay       = archivesElem + ' .archive-day';
    };

    ArchivesFilter.prototype = {

        /**
         * Run ArchivesFilter feature
         */
        run: function() {
            var self = this;

            self.$searchInput.keyup(function() {
                self.filter(self.sliceDate(self.getSearch()));
            });

            // Block submit action
            self.$form.submit(function(e) {
                e.preventDefault();
            });
        },

        /**
         * Get Filter entered by user
         * @returns {string} The date entered by the user
         */
        getSearch: function() {
            return this.$searchInput.val().replace(/([\/|.|-])/g, '').toLowerCase();
        },

        /**
         * Slice the date by year, month and day
         * @param {string} date - The date of the post
         * @returns {*[]} The date of the post splitted in a list
         */
        sliceDate: function(date) {
            return [
                date.slice(0, 4),
                date.slice(4, 6),
                date.slice(6)
            ];
        },

        /**
         * Show related posts and hide others
         * @param {string} date - The date of the post
         */
        filter: function(date) {
            var numberPosts;

            // Check if the search is empty
            if (date[0] == '') {
                this.showAll();
                this.showResult(-1);
            }
            else {
                numberPosts = this.countPosts(date);

                this.hideAll();
                this.showResult(numberPosts);

                if (numberPosts > 0) {
                    this.showPosts(date);
                }
            }
        },

        /**
         * Display results
         * @param {number} numbPosts - The number of posts found
         */
        showResult: function(numbPosts) {
            if (numbPosts == 0) {
                this.$archiveResult.html('No posts found').show();
            }
            else if (numbPosts == -1) {
                this.$archiveResult.html('').hide();
            }
            else {
                this.$archiveResult.html(numbPosts + ' post' + ((numbPosts > 1) ? 's' : '') + ' found').show();
            }
        },

        /**
         * Count number of posts
         * @param {string} date - The date of the post
         * @returns {number} The number of posts found
         */
        countPosts: function(date) {
            return $(this.postsDay + '[data-date^=' + date[0] + date[1] + date[2] + ']').length;
        },

        /**
         * Show all posts from a date
         * @param {string} date - The date of the post
         */
        showPosts: function(date) {
            $(this.postsYear + '[data-date^=' + date[0] + ']').show();
            $(this.postsMonth + '[data-date^=' + date[0] + date[1] + ']').show();
            $(this.postsDay + '[data-date^=' + date[0] + date[1] + date[2] + ']').show();
        },

        /**
         * Show all posts
         */
        showAll: function() {
            this.$postsYear.show();
            this.$postsMonth.show();
            this.$postsDay.show();
        },

        /**
         * Hide all posts
         */
        hideAll: function() {
            this.$postsYear.hide();
            this.$postsMonth.hide();
            this.$postsDay.hide();
        }
    };

    $(document).ready(function() {
        if ($('#archives').length) {
            var archivesFilter = new ArchivesFilter('#archives');
            archivesFilter.run();
        }
    })
}(jQuery);
});

require.register("payload-/baranquillo/categories-filter.js", function(exports, require, module) {
+function($) {
    'use strict';

    // Filter posts by using their categories on categories page : `/categories`

    /**
     * CategoriesFilter
     * @param categoriesArchivesElem
     * @constructor
     */
    var CategoriesFilter = function(categoriesArchivesElem) {
        this.$form        = $(categoriesArchivesElem).find('#filter-form');
        this.$inputSearch = $(categoriesArchivesElem).find('input[name=category]');
        // Element where result of the filter are displayed
        this.$archiveResult = $(categoriesArchivesElem).find('.archive-result');
        this.$categories    = $(categoriesArchivesElem).find('.category');
        this.$posts         = $(categoriesArchivesElem).find('.archive');
        this.categories     = categoriesArchivesElem + ' .category';
        this.posts          = categoriesArchivesElem + ' .archive';
        // Html data attribute without `data-` of `.archive` element which contains the name of category
        this.dataCategory = 'category';
        // Html ata attribute without `data-` of `.archive` element which contains the name of parent's categories
        this.dataParentCategories = 'parent-categories';
    };

    CategoriesFilter.prototype = {

        /**
         * Run CategoriesFilter feature
         */
        run: function() {
            var self = this;

            self.$inputSearch.keyup(function() {
                self.filter(self.getSearch());
            });

            // Block submit action
            self.$form.submit(function(e) {
                e.preventDefault();
            });
        },

        /**
         * Get the search entered by user
         * @returns {string} The name of the category
         */
        getSearch: function() {
            return this.$inputSearch.val().replace('.', '__').toLowerCase();
        },

        /**
         * Show related posts form a category and hide the others
         * @param {string} category - The name of the category
         */
        filter: function(category) {
            if (category == '') {
                this.showAll();
                this.showResult(-1);
            }
            else {
                this.hideAll();
                this.showPosts(category);
                this.showResult(this.countCategories(category));
            }
        },

        /**
         * Display results of the search
         * @param {Number} numbCategories - The number of categories found
         */
        showResult: function(numbCategories) {
            if (numbCategories == 0) {
                this.$archiveResult
                    .html('No categories found')
                    .show();
            }
            else if (numbCategories == -1) {
                this.$archiveResult
                    .html('')
                    .hide();
            }
            else {
                this.$archiveResult
                    .html(numbCategories + ' categor' + ((numbCategories > 1) ? 'ies' : 'y') + ' found')
                    .show();
            }
        },

        /**
         * Count number of categories
         * @param {string} category - The name of theThe date of the post category
         * @returns {Number} The number of categories found
         */
        countCategories: function(category) {
            return $(this.posts + '[data-' + this.dataCategory + '*=' + category + ']').length;
        },

        /**
         * Show all posts from a category
         * @param {string} category - The name of the category
         */
        showPosts: function(category) {
            var self = this;
            var parents;

            if (self.countCategories(category) > 0) {
                // Check if selected categories have parents
                if ($(self.posts + '[data-' + this.dataCategory + '*=' + category + '][data-' + self.dataParentCategories + ']').length) {
                    parents = $(self.posts + '[data-' + self.dataCategory + '*=' + category + ']').attr('data-' + self.dataParentCategories).split(',');

                    // Show only the title of the parents's categories and hide their posts
                    parents.forEach(function(parent) {
                        $(self.posts + '[data-' + self.dataCategory + '=' + parent + ']').show();
                        $(self.posts + '[data-' + self.dataCategory + '=' + parent + '] > .archive-posts > .archive-post').hide();
                    });
                }
            }
            // Show categories and related posts found
            $(self.categories + '[data-' + self.dataCategory + '*=' + category + ']').show();
            $(self.posts + '[data-' + self.dataCategory + '*=' + category + ']').show();
            $(self.posts + '[data-' + self.dataCategory + '*=' + category + '] > .archive-posts > .archive-post').show();
        },

        /**
         * Show all categories and all posts
         */
        showAll: function() {
            this.$categories.show();
            this.$posts.show();
            $(this.posts + ' > .archive-posts > .archive-post').show();
        },

        /**
         * Hide all categories and all posts
         */
        hideAll: function() {
            this.$categories.hide();
            this.$posts.hide();
        }
    };
    $(document).ready(function() {
        if ($('#categories-archives').length) {
            var categoriesFilter = new CategoriesFilter('#categories-archives');
            categoriesFilter.run();
        }
    });
}(jQuery);
});

require.register("payload-/baranquillo/fancybox.js", function(exports, require, module) {
+function($) {

    // Run fancybox feature

    $(document).ready(function() {
        $(".fancybox").fancybox({
            maxWidth:    900,
            maxHeight:   800,
            fitToView:   true,
            width:       '50%',
            height:      '50%',
            autoSize:    true,
            closeClick:  false,
            openEffect:  'elastic',
            closeEffect: 'elastic',
            prevEffect:  'none',
            nextEffect:  'none',
            padding:     '0',
            helpers:     {
                thumbs:  {
                    width:  70,
                    height: 70
                },
                overlay: {
                    css: {
                        'background': 'rgba(0, 0, 0, 0.85)'
                    }
                }
            }
        });
    });
}(jQuery);
});

require.register("payload-/baranquillo/header.js", function(exports, require, module) {
+function($) {
    'use strict';

    // Hide the header when the user scrolls down, and show it when he scrolls up

    /**
     * Header
     * @constructor
     */
    var Header = function() {
        this.$header      = $('#header');
        this.headerHeight = this.$header.height();
        // CSS class located in `source/_css/layout/_header.scss`
        this.headerUpCSSClass = 'header-up';
        this.delta            = 5;
        this.lastScrollTop    = 0;
        this.scrollTop;
    };

    Header.prototype = {

        /**
         * Run Header feature
         */
        run: function() {
            var self = this;
            var didScroll;

            // Detect if the user is scrolling
            $(window).scroll(function() {
                self.didScroll = true;
            });

            // Check if the user scrolled every 250 milliseconds
            setInterval(function() {
                if (self.didScroll) {
                    self.animate();
                    self.didScroll = false;
                }
            }, 250);
        },

        /**
         * Animate the header
         */
        animate: function() {
            this.scrollTop = $(window).scrollTop();

            // Check if the user scrolled more than `delta`
            if (Math.abs(this.lastScrollTop - this.scrollTop) <= this.delta) {
                return;
            }

            // Checks if the user has scrolled enough down and has past the navbar
            if ((this.scrollTop > this.lastScrollTop) && (this.scrollTop > this.headerHeight)) {
                this.$header.addClass(this.headerUpCSSClass);
            }
            else {
                // Check if the user has scrolled to the top of the page
                if (this.scrollTop + $(window).height() < $(document).height()) {
                    this.$header.removeClass(this.headerUpCSSClass);
                }
            }

            this.lastScrollTop = this.scrollTop;
        }
    };

    $(document).ready(function() {
        var header = new Header();
        header.run();
    });
}(jQuery);
});

require.register("payload-/baranquillo/image-gallery.js", function(exports, require, module) {
+function($) {
    'use strict'

    // Resize all images of an image-gallery

    /**
     * ImageGallery
     * @constructor
     */
    var ImageGallery       = function() {
        // CSS class located in `source/_css/components/_image-gallery.scss`
        this.photosBox = '.photo-box';
        this.$images   = $(this.photosBox + ' img');
    };
    ImageGallery.prototype = {

        /**
         * Run ImageGallery feature
         */
        run: function() {
            var self = this;

            // Resize all images at the loading of the page
            self.resizeImages();

            // Resize all images when the user is resizing the page
            $(window).smartresize(function() {
                self.resizeImages();
            });
        },

        /**
         * Resize all images of an image gallery
         */
        resizeImages: function() {
            var photoBoxWidth;
            var photoBoxHeight;
            var imageWidth;
            var imageHeight;
            var imageRatio;
            var $image;

            this.$images.each(function() {
                $image         = $(this);
                photoBoxWidth  = $image.parent().parent().width();
                photoBoxHeight = $image.parent().parent().innerHeight();
                imageWidth     = $image.width();
                imageHeight    = $image.height();

                // Checks if image height is smaller than his box
                if (imageHeight < photoBoxHeight) {
                    imageRatio = (imageWidth / imageHeight);
                    // Resize image with the box height
                    $image.css({
                        'height': photoBoxHeight,
                        'width':  (photoBoxHeight * imageRatio)
                    });
                    // Center image in his box
                    $image.parent().css({
                        'left': '-' + (((photoBoxHeight * imageRatio) / 2) - (photoBoxWidth / 2)) + 'px'
                    });
                }

                // Update new values of height and width
                imageWidth  = $image.width();
                imageHeight = $image.height();

                // Checks if image width is smaller than his box
                if (imageWidth < photoBoxWidth) {
                    imageRatio = (imageHeight / photoBoxWidth);

                    $image.css({
                        'width':  photoBoxWidth,
                        'height': (photoBoxWidth * imageRatio)
                    });
                    // Center image in his box
                    $image.parent().css({
                        'top': '-' + (((imageHeight) / 2) - (photoBoxHeight / 2)) + 'px'
                    });
                }

                // Checks if image height is larger than his box
                if (imageHeight > photoBoxHeight) {
                    // Center image in his box
                    $image.parent().css({
                        'top': '-' + (((imageHeight) / 2) - (photoBoxHeight / 2)) + 'px'
                    });
                }
            });
        }
    };

    $(document).ready(function() {
        if ($('.image-gallery').length) {
            var imageGallery = new ImageGallery();

            // Small timeout to wait the loading of all images.
            setTimeout(function() {
                imageGallery.run();
            }, 500);
        }
    });
}(jQuery);
});

require.register("payload-/baranquillo/post-bottom-bar.js", function(exports, require, module) {
+function($) {
    'use strict'

    // Hide the post bottom bar when the post footer is visible by the user,
    // and show it when the post footer isn't visible by the user

    /**
     * PostBottomBar
     * @constructor
     */
    var PostBottomBar = function() {
        this.$postBottomBar = $('.post-bottom-bar');
        this.$postFooter    = $('.post-footer');
    }

    PostBottomBar.prototype = {

        /**
         * Run PostBottomBar feature
         */
        run: function() {
            var self = this;
            var didScroll;

            // Run animation for first time
            self.swipePostBottomBar();

            // Detects if the user is scrolling
            $(window).scroll(function() {
                self.didScroll = true;
            });

            // Check if the user scrolled every 250 milliseconds
            setInterval(function() {
                if (self.didScroll) {
                    self.swipePostBottomBar();
                    self.didScroll = false;
                }
            }, 250);
        },

        /**
         * Animate the post bottom bar
         */
        swipePostBottomBar: function() {
            var postFooterElemPos = (this.$postFooter.offset().top + this.$postBottomBar.height());

            // Check if the post footer element is visible by the user
            if (($(window).scrollTop() + $(window).height()) > (postFooterElemPos)) {
                this.$postBottomBar.slideUp();
            }
            else {
                this.$postBottomBar.slideDown();
            }
        }
    };
    $(document).ready(function() {
        if ($('.post-bottom-bar').length) {
            var postBottomBar = new PostBottomBar();
            postBottomBar.run();
        }
    });
}(jQuery);
});

require.register("payload-/baranquillo/share-options.js", function(exports, require, module) {
+function($) {
    'use strict';

    // Open and close the share options bar

    /**
     * ShareOptionsBar
     * @constructor
     */
    var ShareOptionsBar = function() {
        this.$shareOptionsBar = $('#share-options-bar');
        this.$openBtn      = $('.btn-open-shareoptions');
        this.$closeBtn     = $('#share-options-mask');
    };

    ShareOptionsBar.prototype = {

        /**
         * Run ShareOptionsBar feature
         */
        run: function() {
            var self = this;

            // Detect the click on the open button
            self.$openBtn.click(function() {
                if (!self.$shareOptionsBar.hasClass('opened')) {
                    self.openShareOptions();
                    self.$closeBtn.show();

                }
            });

            // Detect the click on the close button
            self.$closeBtn.click(function() {
                if (self.$shareOptionsBar.hasClass('opened')) {
                    self.closeShareOptions();
                    self.$closeBtn.hide();
                }
            });
        },

        /**
         * Open share options bar
         */
        openShareOptions: function() {
            var self = this;

            // Check if the share option bar isn't opened and prevent multiple click on the open button with `.processing` class
            if (!self.$shareOptionsBar.hasClass('opened') && !this.$shareOptionsBar.hasClass('processing')) {
                // Open the share option bar
                self.$shareOptionsBar.addClass('processing opened');

                setTimeout(function() {
                    self.$shareOptionsBar.removeClass('processing');
                }, 250);
            }
        },

        /**
         * Close share options bar
         */
        closeShareOptions: function() {
            var self = this;

            // Check if the share options bar is opened and prevent multiple click on the close button with `.processing` class
            if (self.$shareOptionsBar.hasClass('opened') && !this.$shareOptionsBar.hasClass('processing')) {
                // Close the share option bar
                self.$shareOptionsBar
                    .addClass('processing')
                    .removeClass('opened');

                setTimeout(function() {
                    self.$shareOptionsBar.removeClass('processing');
                }, 250);
            }
        }
    };

    $(document).ready(function() {
        var shareOptionsBar = new ShareOptionsBar();
        shareOptionsBar.run();
    });
}(jQuery);
});

require.register("payload-/baranquillo/sidebar.js", function(exports, require, module) {
+function($) {
    'use strict';

    // Open and close the sidebar by swiping the sidebar and the blog and vice versa

    /**
     * Sidebar
     * @constructor
     */
    var Sidebar = function() {
        this.$sidebar = $('#sidebar');
        this.$openBtn = $('#btn-open-sidebar');
        // Elements where the user can click to close the sidebar
        this.$closeBtn = $('#header, #main');
        // Elements affected by the swipe of the sidebar
        // The `pushed` class is added to each elements
        // Each element has a different behvior when the sidebar is opened
        this.$blog     = $('body, .post-bottom-bar, #header, #main');
        // If you change value of `mediumScreenWidth`,
        // you have to change value of `$screen-min: (md-min)` too in `source/_css/utils/variables.scss`
        this.mediumScreenWidth = 768;
    };

    Sidebar.prototype = {

        /**
         * Run Sidebar feature
         */
        run: function() {
            var self = this;

            // Detect the click on the open button
            self.$openBtn.click(function() {
                if (!self.$sidebar.hasClass('pushed')) {
                    self.openSidebar();
                }
            });

            // Detect the click on close button
            self.$closeBtn.click(function() {
                if (self.$sidebar.hasClass('pushed')) {
                    self.closeSidebar();
                }
            });

            // Detect resize of the windows
            $(window).resize(function() {
                // Check if the window is larger than the minimal medium screen value
                if ($(window).width() > self.mediumScreenWidth) {
                    self.resetSidebarPosition();
                    self.resetBlogPosition();
                }
                else {
                    self.closeSidebar();
                }
            });
        },

        /**
         * Open the sidebar by swiping to the right the sidebar and the blog
         */
        openSidebar: function() {
            this.swipeBlogToRight();
            this.swipeSidebarToRight();
        },

        /**
         * Close the sidebar by swiping to the left the sidebar and the blog
         */
        closeSidebar: function() {
            this.swipeSidebarToLeft();
            this.swipeBlogToLeft();
        },

        /**
         * Reset sidebar position
         */
        resetSidebarPosition: function() {
            this.$sidebar.removeClass('pushed');
        },

        /**
         * Reset blog position
         */
        resetBlogPosition: function() {
            this.$blog.removeClass('pushed');
        },

        /**
         * Swipe the sidebar to the right
         */
        swipeSidebarToRight: function() {
            var self = this;

            // Check if the sidebar isn't swiped and prevent multiple click on the open button with `.processing` class
            if (!self.$sidebar.hasClass('pushed') && !this.$sidebar.hasClass('processing')) {
                // Swipe the sidebar to the right
                self.$sidebar.addClass('processing pushed');

                setTimeout(function() {
                    self.$sidebar.removeClass('processing');
                }, 250);
            }
        },

        /**
         * Swipe the sidebar to the left
         */
        swipeSidebarToLeft: function() {
            var self = this;

            // Check if the sidebar is swiped and prevent multiple click on the close button with `.processing` class
            if (self.$sidebar.hasClass('pushed') && !this.$sidebar.hasClass('processing')) {
                // Swipe the sidebar to the left
                self.$sidebar
                    .addClass('processing')
                    .removeClass('pushed processing');
            }
        },

        /**
         * Swipe the blog to the right
         */
        swipeBlogToRight: function() {
            var self = this;

            // Check if the blog isn't swiped and prevent multiple click on the open button with `.processing` class
            if (!self.$blog.hasClass('pushed') && !this.$blog.hasClass('processing')) {
                // Swipe the blog to the right
                self.$blog.addClass('processing pushed');

                setTimeout(function() {
                    self.$blog.removeClass('processing');
                }, 250);
            }
        },

        /**
         * Swipe the blog to the left
         */
        swipeBlogToLeft: function() {
            var self = this;

            // Check if the blog is swiped and prevent multiple click on the close button with `.processing` class
            if (self.$blog.hasClass('pushed') && !this.$blog.hasClass('processing')) {
                // Swipe the blog to the left
                self.$blog
                    .addClass('processing')
                    .removeClass('pushed');

                setTimeout(function() {
                    self.$blog.removeClass('processing');
                }, 250);
            }
        }
    };

    $(document).ready(function() {
        var sidebar = new Sidebar();
        sidebar.run();
    });
}(jQuery);
});

require.register("payload-/baranquillo/smartresize.js", function(exports, require, module) {
+(function($, sr) {

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce  = function(func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;

            function delayed () {
                if (!execAsap) {
                    func.apply(obj, args);
                }

                timeout = null;
            };

            if (timeout) {
                clearTimeout(timeout);
            }
            else if (execAsap) {
                func.apply(obj, args);
            }

            timeout = setTimeout(delayed, threshold || 100);
        };
    }
    jQuery.fn[sr] = function(fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };
})(jQuery, 'smartresize');
});

require.register("payload-/baranquillo/tags-filter.js", function(exports, require, module) {
+function($) {
    'use strict';

    // Filter posts by using their categories on categories page : `/categories`

    /**
     * TagsFilter
     * @param tagsArchivesElem
     * @constructor
     */
    var TagsFilter = function(tagsArchivesElem) {
        this.$form          = $(tagsArchivesElem).find('#filter-form');
        this.$inputSearch   = $(tagsArchivesElem + ' #filter-form input[name=tag]');
        this.$archiveResult = $(tagsArchivesElem).find('.archive-result');
        this.$tags          = $(tagsArchivesElem).find('.tag');
        this.$posts         = $(tagsArchivesElem).find('.archive');
        this.tags           = tagsArchivesElem + ' .tag';
        this.posts          = tagsArchivesElem + ' .archive';
        // Html data attribute without `data-` of `.archive` element which contains the name of tag
        this.dataTag = 'tag';
    };

    TagsFilter.prototype = {

        /**
         * Run TagsFilter feature
         */
        run: function() {
            var self = this;

            // Detect keystroke of the user
            self.$inputSearch.keyup(function() {
                self.filter(self.getSearch());
            });

            // Block submit action
            self.$form.submit(function(e) {
                e.preventDefault();
            });
        },

        /**
         * Get the search entered by user
         * @returns {string} the name of tag entered by the user
         */
        getSearch: function() {
            return this.$inputSearch.val().replace('.', '__').toLowerCase();
        },

        /**
         * Show related posts form a tag and hide the others
         * @param {string} tag - name of a tag
         */
        filter: function(tag) {
            if (tag == '') {
                this.showAll();
                this.showResult(-1);
            }
            else {
                this.hideAll();
                this.showPosts(tag);
                this.showResult(this.countTags(tag));
            }
        },

        /**
         * Display results of the search
         * @param {Number} numbTags - Number of tags found
         */
        showResult: function(numbTags) {
            if (numbTags == 0) {
                this.$archiveResult
                    .html('No tags found')
                    .show();
            }
            else if (numbTags == -1) {
                this.$archiveResult
                    .html('')
                    .hide();
            }
            else {
                this.$archiveResult
                    .html(numbTags + ' tag' + ((numbTags > 1) ? 's' : '') + ' found')
                    .show();
            }
        },

        /**
         * Count number of tags
         * @param tag
         * @returns {Number}
         */
        countTags: function(tag) {
            return $(this.posts + '[data-' + this.dataTag + '*=' + tag + ']').length;
        },

        /**
         * Show all posts from a tag
         * @param {string} tag - name of a tag
         */
        showPosts: function(tag) {
            $(this.tags + '[data-' + this.dataTag + '*=' + tag + ']').show();
            $(this.posts + '[data-' + this.dataTag + '*=' + tag + ']').show();
        },

        /**
         * Show all tags and all posts
         */
        showAll: function() {
            this.$tags.show();
            this.$posts.show();
        },

        /**
         * Hide all tags and all posts
         */
        hideAll: function() {
            this.$tags.hide();
            this.$posts.hide();
        }
    };

    $(document).ready(function() {
        if ($('#tags-archives').length) {
            var tagsFilter = new TagsFilter('#tags-archives');
            tagsFilter.run();
        }
    });
}(jQuery);
});

require.register("payload-/footer.coffee", function(exports, require, module) {
/*
styling: "skeleton"
_options:
*/

var a, base, body, comment, div, doctype, footer, h1, h2, h3, h4, h5, h6, head, header, html, link, meta, p, raw, renderable, script, section, span, tag, title, _ref;

_ref = require("teacup"), doctype = _ref.doctype, html = _ref.html, title = _ref.title, meta = _ref.meta, base = _ref.base, link = _ref.link, script = _ref.script, body = _ref.body, header = _ref.header, raw = _ref.raw, section = _ref.section, comment = _ref.comment, div = _ref.div, a = _ref.a, span = _ref.span, h1 = _ref.h1, h2 = _ref.h2, h3 = _ref.h3, h4 = _ref.h4, h5 = _ref.h5, h6 = _ref.h6, head = _ref.head, renderable = _ref.renderable, p = _ref.p, tag = _ref.tag, footer = _ref.footer;

module.exports = renderable(function(story) {
  var options;
  options = story.attributes;
  return footer("#footer.main-content-wrap.bg-white", function() {
    h2("All contents copyright 2015, James A. Hinds");
    return p("The ideas are yours to keep and share, the wording is mine.");
  });
});
});

;require.register("payload-/header-logo-nav.coffee", function(exports, require, module) {
/*
styling: "skeleton"
_options:
*/

var a, base, body, comment, div, doctype, footer, h1, h2, h3, h4, h5, h6, head, header, html, i, img, li, link, meta, nav, raw, renderable, script, section, span, tag, title, ul, _ref;

_ref = require("teacup"), doctype = _ref.doctype, html = _ref.html, title = _ref.title, meta = _ref.meta, base = _ref.base, link = _ref.link, script = _ref.script, body = _ref.body, header = _ref.header, raw = _ref.raw, section = _ref.section, comment = _ref.comment, i = _ref.i, img = _ref.img, div = _ref.div, a = _ref.a, span = _ref.span, h1 = _ref.h1, h2 = _ref.h2, h3 = _ref.h3, h4 = _ref.h4, h5 = _ref.h5, h6 = _ref.h6, head = _ref.head, renderable = _ref.renderable, nav = _ref.nav, ul = _ref.ul, li = _ref.li, tag = _ref.tag, footer = _ref.footer;

module.exports = renderable(function(story) {
  var options, siteHandle;
  options = story.attributes;
  siteHandle = story.get('siteHandle');
  return header("#header", {
    "data-behavior": "1"
  }, function() {
    i("#btn-open-sidebar.fa.fa-lg.fa-bars");
    h1(".header-title", function() {
      return a(".header-title-link", {
        href: "/ "
      }, "Home");
    });
    return a(".header-right-picture", {
      href: "/#about"
    }, function() {
      return img(".header-picture", {
        src: "http://www.gravatar.com/avatar/c105eda1978979dfb13059b8878ef95d?s=90"
      });
    });
  });
});
});

;
//# sourceMappingURL=app.js.map