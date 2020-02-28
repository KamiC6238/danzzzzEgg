import { getUserInfo } from '@/apis/UserInfo' 

// 根据用户的uid返回用户的头像, 如果用户没有设置头像, 就返回空字符串, 此时展示默认头像

function getUserAvatar(userId) {
  return new Promise(resolve => {
    let uid
    let imageUrl
    if(userId) {
      uid = userId
    } else if(localStorage.getItem('userInfo')) {
      uid = JSON.parse(localStorage.getItem('userInfo')).uid
    }
    if(uid) {
      getUserInfo({uid}).then(res => {
        if(res && res.data.status) {
          imageUrl = res.data.userInfo.avatar
          resolve(imageUrl)
        }
      })
    } else {
      resolve('')
    }
  })
}

export default getUserAvatar