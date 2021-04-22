import * as constants from './constants';
// import { Model } from '../../../dataModule/testBone';
// import { message } from 'antd';
// import { pumpPowerAccountUrl } from '../../../dataModule/UrlList';
// import {getUserId, getRoleId}  from '../../../publicFunction/index';

export const changeInputDisabled = (value) => ({
    type: constants.CHANGE_INPUT_DISABLED,
    disabled: value
})


//拿到用户对应有权限的泵
// const storePumpRolesType = (result) => ({
//     type: constants.PUMP_ROLES,
//     pumpRoles: result
// })

// export const getPumpRoles = () => {
//     const model = new Model();
//     return (dispatch) => {
//         model.fetch(
//             {'user_id': getUserId()},
//             pumpPowerAccountUrl,
//             'get',
//             function(response) {
//                 const result = response.data.data;
//                 dispatch(storePumpRolesType(result));
//             },
//             function() {
//                 message.warning('发送数据失败，请重试')
//             },
//             false,
//         )
//     }
// }


