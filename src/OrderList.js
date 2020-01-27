import React from "react";
import { Table, Input, InputNumber, Popconfirm, Form } from "antd";
import EditableCell from "./EditableCell";
import DUMMY_ORDERS from "./orders.json";
import EditableContext from "./EditableContext";

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    let orders = localStorage.getItem("orders");
    if (orders) {
      orders = JSON.parse(orders);
    } else {
      orders = DUMMY_ORDERS.map(order => {
        return {
          ...order,
          key: order.id
        };
      });
    }
    this.state = { data: orders, editingKey: "" };

    this.columns = [
      {
        title: "Order ID",
        dataIndex: "id",
        width: "20%",
        editable: false,
        key: "id",
        dataType: "text"
      },
      {
        title: "Customer Name",
        dataIndex: "customer_name",
        width: "20%",
        editable: true,
        key: "customer_name",
        dataType: "text"
      },
      {
        title: "Customer Email",
        dataIndex: "customer_email",
        width: "20%",
        editable: true,
        key: "customer_email",
        dataType: "text"
      },
      {
        title: "Product",
        dataIndex: "product",
        width: "20%",
        editable: true,
        key: "product",
        dataType: "text"
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        width: "10%",
        editable: true,
        key: "quantity",
        dataType: "number"
      },
      {
        title: "operation",
        dataIndex: "operation",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => this.cancel(record.key)}
              >
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a
              disabled={editingKey !== ""}
              onClick={() => this.edit(record.key)}
            >
              Edit
            </a>
          );
        }
      }
    ];
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "" });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.setState({ data: newData, editingKey: "" });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
      localStorage.setItem("orders", JSON.stringify(newData));
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataType || "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(OrderList);

export default EditableFormTable;
