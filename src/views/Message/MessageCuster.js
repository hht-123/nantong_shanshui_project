import React, { Component } from 'react';
import { Input,Button } from 'antd';
import '../../style/wrapper.less';
import '../Message/Message.less';

const { Search } = Input;


class MessageCuster extends Component{
    render(){
        return(
            <div>
                <div className="name">客户信息</div>
                <div  className="wrapper">
                        <div className="style">
                            <div className="text">客户单位：</div>
                            <div className="div">
                                <div className="left">
                                    <Search 
                                        style={{width:"200px"}} 
                                        onSearch={value => console.log(value)} 
                                        enterButton 
                                    />
                                </div>
                                <div className="right">
                                    <span className="span">
                                        <Button type="primary">搜索</Button>
                                    </span>
                                    <span className="span">
                                        <Button type="primary">重置</Button>
                                    </span>
                                    <span className="span">
                                        <Button type="primary">创建客户信息</Button>
                                    </span>
                                </div>
                            </div>
                        </div>   
                </div> 
           </div>
                
                
            
        )
    }
}
export default MessageCuster;