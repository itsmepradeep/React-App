import React from "react";
import {Form, Icon, Input, InputNumber, Button, Modal, message} from 'antd';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const FIELDS = [{
    id: 'customer_name',
    placeholder: 'Customer Name',
    rules: [{ required: true, message: 'Please input customer name!' }]
}, {
    id: 'customer_email',
    placeholder: 'Customer Email',
    rules: [{ required: true, message: 'Please input customer email!' }]
}, {
    id: 'product',
    placeholder: 'Product',
    rules: [{ required: true, message: 'Please product name!' }]
}, {
    id: 'quantity',
    placeholder: 'Quantity',
    type: 'number',
    rules: [{ required: true, message: 'Please input quantity!' }]
}];

class AddOrderForm extends React.Component {
    componentDidMount() {
        // To disable submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.onAdd(values);
            } else {
                message.error('Please fill the required fields')
            }
        });
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        return (
            <Modal
                title="Add Order"
                onOk={this.handleSubmit}
                okText="Add"
                onCancel={this.props.onClose}
                visible={this.props.visible}
            >
                <Form onSubmit={this.handleSubmit}>
                    { FIELDS.map(field => {
                        console.log(getFieldError(field.id), isFieldTouched(field.id))
                        const error = isFieldTouched(field.id) && getFieldError(field.id);
                        return (
                            <Form.Item label={field.placeholder} key={field.id} validateStatus={error ? 'error' : ''} help={error || ''}>
                                {getFieldDecorator(field.id, {
                                    rules: field.rules
                                })(field.type === 'number' ? (
                                    <InputNumber style={{width: '100%'}}
                                        placeholder={field.placeholder}
                                    />
                                ): (
                                    <Input
                                        placeholder={field.placeholder}
                                    />
                                ))}
                            </Form.Item>
                        )
                    })}
                </Form>
            </Modal>
        );
    }
}

const WrappedAddOrderForm = Form.create({ name: 'add_order_form' })(AddOrderForm);

export default WrappedAddOrderForm;