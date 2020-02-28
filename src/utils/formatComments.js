import getDateDiff from '@/utils/getTime'

// 通过递归给每条评论和回复设置一个isReply字段，用来展开和关闭评论框
export function setIsReply(comments) {
  if(comments) {
    comments.forEach((comment, index) => {
      comments[index].isReply = false
      if(comment.comments) {
        setIsReply(comment.comments)
      }
    })
  }
}

// 通过递归转换每条评论跟回复的时间格式
export function formatTime(comments) {
  if(comments) {
    comments.forEach((comment, index) => {
      comments[index].create_time = getDateDiff(parseInt(comment.create_time))
      if(comment.comments) {
        formatTime(comment.comments)
      }
    })
  }
}