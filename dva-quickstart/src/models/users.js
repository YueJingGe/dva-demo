import * as usersService from '../services/users';

export default {
  namespace: 'users',
  state: {
    list: [],
    total: null,
    page: -1,
    pageSize: 3,
    loading: true
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/users') {
          dispatch({ type: 'fetch', payload: { page: 1} });
        }
      });
    },
  },
  effects: {
    *fetch({ payload: { page } }, { call, put }) {
      const { data } = yield call(usersService.fetch, { page });
      yield put({ type: 'save', payload: { data, total: data.length } });
    },
  },
  reducers: {
    save(state, { payload: { data: list, total } }) {
      return { ...state, list, total, loading: false };
    },
  }
};