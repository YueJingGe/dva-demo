## 工具

### npm install query-string
```js
/**
 * query-string：用来获取URL中使用query传递的参数
 * 例如：http://localhost:8000/#/users?page=1
 */
import queryString from 'query-string';

history.listen(({ pathname, search }) => {

  console.log(pathname); // /users
  console.log(search); // ?page=1

  if (pathname === '/users') {
    let { page } = queryString.parse(search); // {page: "1"}
    dispatch({ type: 'fetch', payload: { page } });
  }
});
```

### npm install path-to-regexp

```js
/**
 * path-to-regexp：用来获取路由中的动态参数
 * 例如：http://localhost:8000/#/users/1/2
 * 路由：/users/:page/:id
 */
import pathToRegexp from 'path-to-regexp';

history.listen(({ pathname, search }) => {

  let match = pathToRegexp('/users/:page/:id').exec(pathname);

  console.log(match); // ["/users/1/2", "1", "2", index: 0, input: "/users/1/2", groups: undefined]
  
  if (pathname === '/users') {
    dispatch({ type: 'fetch', payload: { page: match[1], id: match[2]} });
  }
});

```

### router v4中可选的动态路由如何表示？

```js
/**
 * 动态路由后面跟上`?`号
 */ 
<Route path="/users/:page?" exact component={Users} />
```

### effects中的方法想要获取state

```js
/**
 * 使用 ‘select’ 方法, 注意不要忘记加命名空间
 */ 
const page = yield select(state => state.users.page);
```