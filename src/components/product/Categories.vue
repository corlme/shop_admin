<template>
  <div>
    <el-button type='success' plain @click="showAddDialog">添加商品</el-button>
    <el-table :data="categoryList" style="width: 100%" v-loading="loading" element-loading-text="亲，稍等，玩命加载中"
      element-loading-spinner="el-icon-loading">
      <el-table-tree-column label="分类名称" prop="cat_name" tree-key="cat_id" level-key="cat_level" parent-key="cat_pid"
        :indent-size="20">

      </el-table-tree-column>
      <el-table-column label='是否删除' prop='cat_deleted'>
        <template slot-scope="scope">
          {{scope.row.cat_deleted ? "是" : "否"}}
        </template>
      </el-table-column>
      <el-table-column label='排序' prop="cat_level"></el-table-column>
      <el-table-column label='操作'>
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="current" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 添加商品分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%">
      <!-- 表单 -->
      <el-form :model='addForm' ref="addForm" :rules='rules' label-width="80px" status-icon>
        <el-form-item label='分类名称' prop='cat_name'>
          <el-input v-model='addForm.cat_name'></el-input>
        </el-form-item>
        <el-form-item label='父级名称'>
          <el-cascader v-model='addForm.cat_pid' clearable :options="options" change-on-select :props='props'>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入element-tree-grid 插件包
var ElTreeGrid = require('element-tree-grid')
export default {
  data() {
    return {
      categoryList: [],
      current: 1,
      pageSize: 10,
      total: 0,
      loading: true,
      addDialogVisible: false,
      addForm: {
        cat_pid: [],
        cat_name: '',
        cat_levle: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getCategoryList() {
      let res = await this.axios.get('categories', {
        params: {
          type: 3, // 表示获取3层数据
          pagenum: this.current,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { result, total }
      } = res.data
      if (status === 200) {
        this.categoryList = result
        // console.log(this.categoryList)
        this.total = total
        setTimeout(() => {
          this.loading = false
        }, 500)
      }
    },
    // 修改了每页显示的条数
    handleSizeChange(val) {
      this.loading = true
      this.pageSize = val
      this.current = 1
      this.getCategoryList()
    },
    // 修改了当前页的页码
    handleCurrentChange(val) {
      this.loading = true
      this.current = val
      this.getCategoryList()
    },
    async showAddDialog() {
      this.addDialogVisible = true
      let res = await this.axios.get('categories?type=2')
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.options = data
        console.log(this.options)
      }
    },
    // 添加商品分类
    addCategory() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 发送ajax请求

        // 解决eslint报错问题 要求变量驼峰命名
        let { cat_name: catName, cat_pid: catPid } = this.addForm

        let res = await this.axios.post(`categories`, {
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        })
        console.log(res)

        let {
          meta: { status, msg }
        } = res.data
        if (status === 201) {
          this.addDialogVisible = false
          this.$refs.addForm.resetFields()
          this.getCategoryList()
          this.$message.success('添加商品分类成功了')
        } else {
          this.$message.error(msg)
        }
      })
    }
  },
  created() {
    this.getCategoryList()
  },
  components: {
    // 把 ElTreeGrid 注册为局部组件
    'el-table-tree-column': ElTreeGrid
  }
}
</script>

<style lang='less' scoped>
</style>
