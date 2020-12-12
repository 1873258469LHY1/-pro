import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default {
  /*
  获取品牌数据列表
  */
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'GET',
    })
  },
  /*
  添加品牌数据
  */
  addTrademark(data) {
    return request({
      url: `${api_name}/save`,
      method: 'POST',
      data
    })
  },
  /*
  修改品牌数据
  */
 updateTrademark(data) {
    return request({
      url: `${api_name}/update`,
      method: 'PUT',
      data
    })
  },
  /*
  修改品牌数据
  */
 delTrademark(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'DELETE',
    })
  }

}
