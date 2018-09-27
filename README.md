# dva-demo
学习dva框架

官网： https://dvajs.com/guide/

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
