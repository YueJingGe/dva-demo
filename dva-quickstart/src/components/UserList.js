
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Divider } from 'antd';


const UserList = ({list, total, pageSize, loading}) => {
  const columns = [{
    title: 'id',
    dataIndex: 'id',
  }, {
    title: 'name',
    dataIndex: 'name',
  }, {
    title: 'email',
    dataIndex: 'email',
  }, {
    title: 'website',
    dataIndex: 'website',
    key: 'website',
  }, {
    title: 'phone',
    dataIndex: 'phone',
  }, {
    title: 'Action',
    key: 'Action',
    render: (text, record) => (
      <span>
        <a>Edit</a>
        <Divider type="vertical" />
        <a>Delete</a>
      </span>
    ),
  }];

  return <Table columns={columns} dataSource={list} pagination={{total, pageSize}} loading={loading}/>
}

UserList.prototype = {
  list: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired
}

export default UserList;