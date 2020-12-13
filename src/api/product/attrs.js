import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  /*
  获取Category1数据列表
  */
  getCategory1List() {
    return request({
      url: `${api_name}/getCategory1`,
      method: 'GET',
    })
  },
  /*
  获取Category2数据列表
  */
  getCategory2List(category1Id) {
    return request({
      url: `${api_name}/getCategory2/${category1Id}`,
      method: 'GET',
    })
  },
  /*
  获取Category3数据列表
  */
  getCategory3List(category2Id) {
    return request({
      url: `${api_name}/getCategory3/${category2Id}`,
      method: 'GET',
    })
  },
  /*
  获取Category数据列表
  */

  getAttrsList({category1Id,category2Id,category3Id}) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: 'GET',
    })
  },
  

}
