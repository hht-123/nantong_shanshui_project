/*
 * @Descripttion: 
 * @version: 
 * @Author: 唐帆
 * @Date: 2020-04-29 21:16:38
 * @LastEditors: 唐帆
 * @LastEditTime: 2020-04-30 09:56:40
 */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MRoute from './routes/index';
import * as serviceWorker from './serviceWorker';
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import { LocaleProvider } from 'antd'
import 'moment/locale/zh-cn'


ReactDOM.render(
    <LocaleProvider locale={zh_CN}>
        <MRoute />
    </LocaleProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
