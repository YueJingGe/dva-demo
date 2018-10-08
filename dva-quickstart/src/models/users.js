import * as usersService from '../services/users';
import pathToRegexp from 'path-to-regexp';

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    page: -1,
    pageSize: 5,
    loading: true,
    userItem: {},
    visible: false,
    type: 'add'
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (pathToRegexp('/users/:page?').test(pathname)) {
          let match = pathToRegexp('/users/:page?').exec(pathname);
          let page = match ? match[1] : 1;
          dispatch({ type: 'fetch', payload: { page: page }});
        }
      });
    },
  },
  effects: {
    *fetch({ payload: { page } }, { call, put }) {
      yield put({ type: 'init' });
      const { data, headers } = yield call(usersService.fetch, { page });
      yield put({ type: 'search', payload: { data, total: headers['x-total-count'], page } });
    },
    *remove({ payload: { id } }, { call, put, select }) {
      yield call(usersService.remove, { id });
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page }});
    },
    *setItem({ payload: { record, visible, type } }, { put }) {
      yield put({ type: 'getItem', payload: { record, visible, type }});
    },
    *patch({ payload: {id, values}}, { call, put, select }) {
      const type = yield select(state => state.users.type);
      switch (type) {
        case 'add':
          yield call(usersService.create, values);
          break;
        case 'edit':
          yield call(usersService.patch, id, values);
          break;
        default:
          break;
      }
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page }});
      yield put({ type: 'getItem', payload: { record: {}, valisble: false, type: 'add'}});
    }
  },
  reducers: {
    init(state) {
      return { ...state, loading: true }
    },
    search(state, { payload: { data: list, total, page } }) {
      return { ...state, list, total, loading: false, page };
    },
    getItem(state, { payload: { record: userItem, visible, type}}){
      return { ...state, userItem, visible, type }
    }
  }
};