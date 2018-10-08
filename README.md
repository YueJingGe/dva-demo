<!-- TOC -->

- [dva-demo](#dva-demo)
  - [启动](#启动)
  - [是什么](#是什么)
  - [核心](#核心)
  - [做什么](#做什么)
  - [特点](#特点)
- [dva](#dva)
  - [背景](#背景)
    - [redux](#redux)
    - [redux-saga](#redux-saga)
    - [react-router](#react-router)
  - [dva源码 之 dva](#dva源码-之-dva)
    - [隐藏在 package.json 里的秘密](#隐藏在-packagejson-里的秘密)
      - ['npm start'命令背后发生了什么？](#npm-start命令背后发生了什么)
      - [src/index.js 做了什么事情？](#srcindexjs-做了什么事情)
    - [寻找dva](#寻找dva)
      - [dva中的package.json文件](#dva中的packagejson文件)
      - [src/index.js](#srcindexjs)
      - [FAQ](#faq)
      - [使用 react-redux 的高阶组件传递 store](#使用-react-redux-的高阶组件传递-store)
      - [FAQ](#faq-1)
    - [redux 与 router](#redux-与-router)
      - [看看dva中router的实现](#看看dva中router的实现)
    - [数据与视图（上）](#数据与视图上)
  - [dva源码 之 dva-core](#dva源码-之-dva-core)
    - [隐藏在 package.json 里的秘密](#隐藏在-packagejson-里的秘密-1)
      - [src/index.js](#srcindexjs-1)

<!-- /TOC -->

# dva-demo
学习dva框架

官网： https://dvajs.com/guide/

## 启动

```bash
cd dva-quickstart
npm i
npm start
npm run build
```

## 是什么

一个基于redux 和 redux-saga 的数据流方案。

## 核心

state

action 

dispatch

effect

reducer

subscription

connect

router

router components

## 做什么

1. 使用 React 解决 view 层
2. redux 管理 model
3. saga 解决异步

> **分离动态的 data 和静态的 view **

## 特点

Dva 是基于 React + Redux + Saga 的最佳实践沉淀, 做了 3 件很重要的事情, 大大提升了编码体验:

把 store 及 saga 统一为一个 model 的概念, 写在一个 js 文件里面
增加了一个 Subscriptions, 用于收集其他来源的 action, eg: 键盘操作
model 写法很简约, 类似于 DSL 或者 RoR, coding 快得飞起✈️

```js
app.model({
  namespace: 'count',
  state: {
    record: 0,
    current: 0,
  },
  reducers: {
    add(state) {
      const newCurrent = state.current + 1;
      return { ...state,
        record: newCurrent > state.record ? newCurrent : state.record,
        current: newCurrent,
      };
    },
    minus(state) {
      return { ...state, current: state.current - 1};
    },
  },
  effects: {
    *add(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: 'minus' });
    },
  },
  subscriptions: {
    keyboardWatcher({ dispatch }) {
      key('⌘+up, ctrl+up', () => { dispatch({type:'add'}) });
    },
  },
});
```

# dva

- 用一用dva，写一个例子。

  github地址：https://github.com/YueJingGe/dva-demo

- 看dva源码。

  源码解析地址：https://dvajs.com/guide/source-code-explore.html

## 背景

### redux 

https://github.com/reduxjs/redux

关键字：state、 action、 dispatch、 subscribe、type、 createStore

### redux-saga

https://github.com/redux-saga/redux-saga

关键字： * 、yield、 call、 put、 middleware、createSagaMiddleware、applyMiddleware

### react-router

请前往react-router官网查看。

## dva源码 之 dva

### 隐藏在 package.json 里的秘密

#### 'npm start'命令背后发生了什么？

> 看源码之前，先去看 package.json 。看看项目的入口文件，翻翻它用了哪些依赖，对项目便有了大致的概念。

```js
"scripts": {
  "start": "roadhog server",
},
"devDependencies": {
  "roadhog": "^2.0.0" // 和 webpack 相似的库  起的是 webpack 自动打包和热更替的作用
}
```

运行 ‘roadhog server’命令，启动入口 ‘src/index.js’。

#### src/index.js 做了什么事情？

六部曲：

```js
import dva from 'dva'; // 1. 从dva依赖中引入dva

const app = dva({ 
  initialState: {
    products: [
      {name: 'kangknag', id: 1},
      {name: 'xiaoming', id: 2},
    ]
  }
}); // 2. 通过函数创建一个app对象

app.use({}); // 3. 加载插件

app.model(require('./models/products').default); // 4. 注入model

app.router(require('./router'.default)); // 5. 添加路由

app.start('#app'); // 6. 启动
```

此时的app是什么呢？

```js
model: ƒ ()
replaceModel: ƒ ()
router: ƒ router(router)
start: ƒ start(container)
unmodel: ƒ ()
use: ƒ ()
_getProvider: ƒ ()
_getSaga: ƒ ()
_history: {length: 4, action: "POP", location: {…}, createHref: ƒ, push: ƒ, …}
_models: Array(2)
  0: {namespace: "@@dva", state: 0, reducers: {…}}
  1: {namespace: "products", state: Array(0), reducers: {…}}
  length: 2
  __proto__: Array(0)
_plugin: Plugin {_handleActions: null, hooks: {…}}
_router: ƒ RouterConfig(_ref)
_store: {dispatch: ƒ, subscribe: ƒ, getState: ƒ, replaceReducer: ƒ, liftedStore: {…}, …}
__proto__: Object
```

> 总结来说，dva就是一个函数，返回了一个**app对象**。在这6步中dva完成了 **使用react解决view层**、**redux管理model**、**saga解决异步**的主要功能。
前端工程师一直在做的就是 **分离动态的data和静态的view** 。

### 寻找dva

> 目前 dva 的源码核心部分包含两部分，**dva** 和 **dva-core**。前者用高阶组件 React-redux 实现了 view 层，后者是用 redux-saga 解决了 model 层。

#### dva中的package.json文件

```js
{
  "dependencies": {
    "@babel/runtime": "7.0.0-beta.46", // 编译后文件引用的公共库，可以复用工具函数，有效的减少编译后的体积
    "@types/isomorphic-fetch": "^0.0.34", // 解决fetch兼容性问题
    "@types/react-router-dom": "^4.2.7", // 得到react-router-dom的声明文件
    "@types/react-router-redux": "^5.0.13",
    "dva-core": "^1.4.0", // dva 另一个核心，用于处理数据层
    "global": "^4.3.2",  // 用于提供全局函数的引用
    "history": "^4.6.3", // browserHistory 或者 hashHistory
    "invariant": "^2.2.2", // 一个有趣的断言库
    "isomorphic-fetch": "^2.2.1",// 方便请求异步的函数，dva 中的 fetch 来源
    "react-redux": "^5.0.5", // 提供了一个高阶组件，方便在各处调用 store
    "react-router-dom": "^4.1.2", // router4，终于可以像写组件一样写 router 了
    "react-router-redux": "5.0.0-alpha.9", // redux 的中间件，在 provider 里可以嵌套 router
    "redux": "^3.7.2" // 提供了 store、dispatch、reducer 
  },
}
```

> 引用依赖很好的说明了 dva 的功能：统一 view 层。

#### src/index.js

```js
export default function (opts = {}) {

  // ...初始化 route ，和添加 route 中间件的方法

  /**
   * 1. 新建 function ，函数内实例化一个 app 对象。
   * 
   */
  const app = core.create(opts, createOpts);
  /**
   * 2. 新建变量指向该对象希望代理的方法
   * 
   */
  const oldAppStart = app.start;
  app.router = router;
  /**
   * 4. 令 app.start = start，完成对 app 对象的 start 方法的代理。
   * @type {[type]}
   */
  app.start = start;
  return app;

  // router 赋值

  /**
   * 3.1 新建同名方法 start，
   * 
   */
  function start(container) {
    // 合法性检测代码

    /**
     * 3.2 在其中使用 call，指定 oldStart 的调用者为 app。
     */
    oldAppStart.call(app);

    // 因为有 3.2 的执行才有现在的 store
    const store = app._store;
  }
}
```
#### FAQ

> 实现代理模式一定要用到 call 吗？

不一定，看看有没有用箭头函数或者函数里面有没有用到this。call能改变this的指向并且立即执行函数。

> 前端还有那里会用到 call ？

实际开发讲，因为已经使用了es6的标准，基本和this没有什么打交道的机会了。使用class类型的组件还会用到this.xxx.bind(this)。

#### 使用 react-redux 的高阶组件传递 store

```js
// 使用 querySelector 获得 dom
if (isString(container)) {
  container = document.querySelector(container);
  invariant(
    container,
    `[app.start] container ${container} not found`,
  );
}

// 其他代码

// 实例化 store
oldAppStart.call(app); 
const store = app._store;

// export _getProvider for HMR
// ref: https://github.com/dvajs/dva/issues/469
app._getProvider = getProvider.bind(null, store, app);

// If has container, render; else, return react component
// 如果有真实的 dom 对象就把 react 拍进去
if (container) {
  render(container, store, app, app._router);
  // 热加载在这里
  app._plugin.apply('onHmr')(render.bind(null, container, store, app));
} else {
  // 否则就生成一个 react ，供外界调用
  return getProvider(store, this, this._router);
}

// 使用高阶组件包裹组件
function getProvider(store, app, router) {
  return extraProps => (
    <Provider store={store}>
      { router({ app, history: app._history, ...extraProps }) }
    </Provider>
  );
}

// 真正的 react 在这里
function render(container, store, app, router) {
  const ReactDOM = require('react-dom');  // eslint-disable-line
  ReactDOM.render(React.createElement(getProvider(store, app, router)), container);
}
```

#### FAQ

> React.createElement(getProvider(store, app, router)) 怎么理解？

getProvider返回的不单单是一个函数，而是一个无状态的react组件。

> Provider 是个什么东西？

代理模式实现的高阶组件。 接收redux生成的store做参数后，通过上下文context将store传递进被代理组件。

> connect 是个什么东西？

代理模式实现的高阶组件。 为被代理的组件 从context中获得store

> connect()(MyComponent) 时发生了什么？

结论：对于 connect()(MyComponent)

1. connect 调用时生成 0 号 connect
2. connect() 0 号 connect 调用，返回 1 号 connect 的调用 connectHOC() ，生成 2 号 connect(也是个函数) 。
3. connect()(MyComponent) 等价于 connect2(MyComponent)，返回值是一个新的组件

### redux 与 router

redux是状态管理的库。router是控制页面跳转的库。但两者无法协同工作。换句话说，当路由变化以后，store 无法感知到。

于是便有了 react-router-redux（redux的一个中间件）。

主要监听history的变化：

```js
history.listen(location => analyticsService.track(location.pathname))
```

#### 看看dva中router的实现

1. 在 createOpts 中初始化了添加 react-router-redux 中间件的方法 和其 reducer，方便 dva-core 在创建 store 的时候直接调用。
2. 使用patchHistory函数代理history.linsten,增加一个回调函数的做参数（也就是订阅）
```js
  const history = opts.history || createHashHistory();
  const createOpts = {
    // 初始化 react-router-redux 的 router
    initialReducer: {  
      routing,
    },
    // 初始化 react-router-redux 添加中间件的方法，放在所有中间件最前面
    setupMiddlewares(middlewares) {
      return [
        routerMiddleware(history),
        ...middlewares,
      ];
    },
    // 使用代理模式为 history 对象增加新功能，并赋给 app
    setupApp(app) {
      app._history = patchHistory(history);
    },

// 使用代理模式扩展 history 对象的 listen 方法，添加了一个回调函数做参数并在路由变化是主动调用
function patchHistory(history) {
  const oldListen = history.listen;
  history.listen = (callback) => {
    callback(history.location);
    return oldListen.call(history, callback);
  };
  return history;
}
```

### 数据与视图（上）

src/index.js主要实现了dva的view层，同时传递一些初始化的数据给dva-core所实现的model层。

而dva-core主要解决model的问题，包括state的管理，数据的异步加载，订阅-发布模式的实现。

## dva源码 之 dva-core

### 隐藏在 package.json 里的秘密

```js
  "dependencies": {
    "@babel/runtime": "7.0.0-beta.46",
    "flatten": "^1.0.2",
    "global": "^4.3.2",
    "invariant": "^2.2.1",
    "is-plain-object": "^2.0.3", // 判断是否是一个对象
    "redux": "^3.7.1",
    "redux-saga": "^0.16.0", // // 处理异步数据流
    "warning": "^3.0.0" // 同样是个断言库，不过输出的是警告
  },
```

#### src/index.js

```js
export function create(hooksAndOpts = {}, createOpts = {}) {
  const {
    initialReducer,
    setupApp = noop,
  } = createOpts;

  const plugin = new Plugin();
  plugin.use(filterHooks(hooksAndOpts));

  const app = {
    _models: [
      prefixNamespace({ ...dvaModel }),
    ],
    _store: null,
    _plugin: plugin,
    use: plugin.use.bind(plugin),
    model,
    start,
  };
  return app;
  	// .... 方法的实现
	
	function model(){
		// model 方法
	}
	
	functoin start(){
		// Start 方法
	}
}
```