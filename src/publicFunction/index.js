import {getCookie} from "../helpers/cookies";
import createBrowserHistory from '../components/common/history'
import {message} from "antd";

export function nowTime() {
  const date = new Date();
  const seperator1 = "-";
  const seperator2 = ":";
  const month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
  const strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
  const strHours = date.getHours()<10?'0' + date.getHours():date.getHours();
  const strMinutes = date.getMinutes()<10?'0' + date.getMinutes():date.getMinutes();
  return date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + strHours + seperator2 + strMinutes
}

export function nowTimeBigInt() {
  const date = new Date();
  const month = date.getMonth() + 1<10? "0"+(date.getMonth() + 1):date.getMonth() + 1;
  const strDate = date.getDate()<10? "0" + date.getDate():date.getDate();
  const strHours = date.getHours()<10?'0' + date.getHours():date.getHours();
  const strMinutes = date.getMinutes()<10?'0' + date.getMinutes():date.getMinutes();
  // eslint-disable-next-line radix
  return parseInt(date.getFullYear() + month + strDate + strHours + strMinutes)
}

export function getUserName() {
  if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
    return createBrowserHistory.push('/login')
  } else {
    return JSON.parse(getCookie("mspa_user")).username
  }
}

export function getUserId() {
  if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
    return createBrowserHistory.push('/login')
  } else {
    return JSON.parse(getCookie("mspa_user"))._id
  }
}

//后加的
export function getRoleId() {
  if (!getCookie("mspa_user") || getCookie("mspa_user") === "undefined") {
    return createBrowserHistory.push('/login')
  } else {
    return JSON.parse(getCookie("mspa_user")).role_id
  }
}

export function handleChange(value, type, me){
  if (value === '' || value === undefined) value = null;
  const form = me.state;
  form[type] = value;
  me.setState(form)
}

export function ejectMessage (text, type) {
  if (type === 'success') {
    message.success(text)
  } else if (type === 'error') {
    message.error(text)
  } else if (type === 'warning') {
    message.warning(text)
  } else {
    message.info(text)
  }
}
