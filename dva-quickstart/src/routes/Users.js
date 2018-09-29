import React from 'react';
import { connect } from 'dva';
import  UserList from '../components/UserList';

function Users ({ dispatch, users}) {
  const {list, total, pageSize} = users;
  return <div> 
    <UserList list={list} total={Number(total)} pageSize={Number(pageSize)}/> 
  </div>
}

export default connect(({ users })=> ({ 
  users
}))(Users);