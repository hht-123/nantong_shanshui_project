import React, { Component } from 'react';
import {setCookie} from "../../helpers/cookies";
import '../../style/login.less';
import { Form, Icon, Input, Button, Checkbox, message, Spin } from 'antd';
import { loginUrl } from '../../dataModule/UrlList';
import { Model } from '../../dataModule/testBone';


const model = new Model()
const FormItem = Form.Item;

// const users = [{
//     username:'admin',
//     password:'admin'
// }, {
//   username:'reviewer1',
//   password:'reviewer1'
// }, {
//   username:'reviewer2',
//   password:'reviewer2'
// }, {
//   username:'reviewer3',
//   password:'reviewer3'
// }, {
//   username:'rectifier1',
//   password:'rectifier1'
// }, {
//   username:'rectifier2',
//   password:'rectifier2'
// }, {
//   username:'rectifier3',
//   password:'rectifier3'
// }];

// function PatchUser(values) {  //匹配用户
//     const {username, password} = values;
//     return users.find(user => user.username === username && user.password === password);
// }

class NormalLoginForm extends Component {
    state = {
        isLoding:false,
    };
    handleSubmit = (e) => {
        e.preventDefault();
        const me = this
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of operation: ', values);
                model.fetch(
                    {account: values.username, password: values.password},
                    loginUrl,
                    'post',
                    function(response) {
                        values['username'] = response.data.username;
                        values['_id'] = response.data.user_id;
                        values['role_id'] = response.data.role_id;
                        setCookie('mspa_user',JSON.stringify(values));
                        message.success(response.msg); //成功信息
                        me.props.history.push({pathname:'/app',state:values});
                    },
                    function() {
                        message.error('login failed!'); //失败信息
                    },
                )
                // if(PatchUser(values)){
                //     this.setState({
                //         isLoding: true,
                //     });
                //     values['_id'] = values.username

                //     // console.log(values);
                //     setCookie('mspa_user',JSON.stringify(values));

                //     message.success('login successed!'); //成功信息
                //     let that = this;
                //     setTimeout(function() { //延迟进入
                //         that.props.history.push({pathname:'/app',state:values});
                //     }, 2000);

                // }else{
                //     message.error('login failed!'); //失败信息
                // }
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            this.state.isLoding?<Spin size="large" className="loading" />:
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <div className="login-name" style={{marginLeft:"30px"}}>325 实验室基础前端框架</div>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名 (admin)" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码 (admin)" />
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:'0'}}>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            <a className="login-form-forgot" href="" style={{float:'right'}}>忘记密码?</a>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                    {/* <a className="githubUrl" href={`${authorize_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}`}> </a> */}
                </div>
            </div>
        );
    }
}

const Login = Form.create()(NormalLoginForm);
export default Login;
