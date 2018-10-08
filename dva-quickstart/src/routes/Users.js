import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button } from 'antd';
import  UserList from '../components/UserList';
import  UserItem from '../components/UserItem';

function Users ({ dispatch, users}) {
  const {list, total, page, pageSize, loading, 
      userItem, visible, type } = users;
  const onChange = (page) => {
    dispatch(routerRedux.replace({
      pathname: `/users/${page}`
    }));
  };
  const remove = (id) => {
    dispatch({
      type: 'users/remove',
      payload: { id }
    });
  };
  const add = () => {
    dispatch({
      type: 'users/setItem',
      payload: { record: {}, visible: true, type: 'add' }
    });
  }
  const edit = (record) => {
    dispatch({
      type: 'users/setItem',
      payload: { record, visible: true, type: 'edit' }
    });
  }
  const handleOk = (id, values) => {
    dispatch({
      type: 'users/patch',
      payload: { id: id || null, values }
    });
  }
  const handleCancel = () => {
    dispatch({
      type: 'users/setItem',
      payload: { record: {}, visible: false }
    });
  }
  return <div> 
    <Button type="primary" style={{margin: '14px'}} onClick={add}>新建</Button>

    <UserList loading={loading} list={list} total={Number(total)} page={Number(page)} pageSize={Number(pageSize)} 
      onChange={onChange} remove={remove} edit={edit}/> 

    { visible === true &&
      <UserItem 
        record={userItem}
        title={type === 'edit' ? '编辑' : '新增'}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}/>
    }

  </div>
}

export default connect(({ users })=> ({ 
  users
}))(Users);