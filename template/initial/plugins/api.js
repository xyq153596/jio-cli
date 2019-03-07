/**
 * @module plugins/api
 * @description
 * ### api管理文件
 * #### 命名规范：
 * > com_{apiName} com_ 后面跟api名称表示公用的api
 *
 * > xxx_{apiName} xxx_ 表示按模块命名
 *
 * > 层级只能有一级，即
 * >（api.getUsername 正确）
 * >（api.common.getName 错误）
 *
 */
export default ({ app }, inject) => {
  /**
   * @enum
   */
  const api = {
    // /**
    //  * 公共api命名例子：
    //  */
    // com_getUsername: 'http://xxx.com/getUsername',
    //  /**
    //  * 模块api命名例子：
    //  */
    // goods_getName: 'http://xxx.com/getGoodsname'
  }
  /**
   * 注入vuex，vue,context中
   * 可以使用this.$api 调用
   */
  inject('api', api)
}
