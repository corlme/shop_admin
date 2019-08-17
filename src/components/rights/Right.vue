<template>
  <div class="right">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightList" style="width: 100%">
      <el-table-column type="index" :index='indexMethod'>
      </el-table-column>
      <el-table-column prop="authName" label="权限名称">
      </el-table-column>
      <el-table-column prop="path" label="路径">
      </el-table-column>
      <el-table-column prop='level' label="层级">
        <!-- 自定义层级列模板 -->
        <template slot-scope='scope'>
          <span v-if="scope.row.level == 0">一级</span>
          <span v-else-if="scope.row.level == 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightList: []
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1
    }
  },
  // 钩子函数
  async created() {
    let res = await this.axios.get(`rights/list`)
    let {
      data,
      meta: { status }
    } = res.data
    if (status === 200) {
      this.rightList = data
    }
  }
}
</script>

<style lang='less' scoped>
</style>
