
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Divider, Popconfirm } from 'antd';


const UserList = ({list, total, page: current, pageSize, loading, onChange, remove, edit}) => {
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
        <a onClick={() => edit(record)}>Edit</a>
        <Divider type="vertical" />
        <Popconfirm title="你确定要删除么?" okText="确定" cancelText="取消" onConfirm={() => remove(record.id)}>
          <a>Delete</a>
        </Popconfirm>
      </span>
    ),
  }];

  return <Table columns={columns} dataSource={list} pagination={{current, total, pageSize, onChange}} loading={loading}/>
}

UserList.prototype = {
  list: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired
}

export default UserList;