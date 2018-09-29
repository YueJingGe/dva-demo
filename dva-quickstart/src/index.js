// 从 'dva' 依赖中引入 dva ：
import dva from 'dva';
import './index.css';
import createLoading from 'dva-loading';

// 1. Initialize 通过函数生成一个 app 对象
const app = dva({
  initialState: {
    products: [
      { name: 'kangkang', id: 1 },
      { name: 'caocao', id: 2 }
    ]
  }
});

// 2. Plugins 加载插件 
app.use(createLoading());

// 3. Model 注入 model
app.model(require('./models/products').default);
app.model(require('./models/users').default);

// 4. Router 添加路由
app.router(require('./router').default);

// 5. Start 启动
app.start('#root');
