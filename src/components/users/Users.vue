<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click='queryList'></el-button>
    </el-input>
    <el-button type='success' class="primary" plain @click='showAddDialog'>
      添加用户
    </el-button>
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column prop="mobile" label="电话">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch @change="changeState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain @click='showEditDialog(scope.row)'>
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain @click='delUser(scope.row)'>
          </el-button>
          <el-button type="success" size="mini" plain @click="showAssignDialog(scope.row)">
            <i class="el-icon-check"></i>
            分配角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <!-- page-size: 每页显示多少条 -->
    <el-pagination background layout="total,sizes,prev, pager, next,jumper" :total="total" :page-size="pageSize"
      :page-sizes="[2, 4, 6, 10]" :current-page="current" @size-change="handleSizeChange"
      @current-change='handleCurrentChange'>
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <!-- 表单 -->
      <el-form :model='addForm' ref="addForm" :rules='rules' label-width="70px" status-icon>
        <el-form-item label='用户名' prop='username'>
          <el-input v-model='addForm.username'></el-input>
        </el-form-item>
        <el-form-item label='密码' prop='password'>
          <el-input v-model='addForm.password'></el-input>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model='addForm.email'></el-input>
        </el-form-item>
        <el-form-item label='电话' prop='mobile'>
          <el-input v-model='addForm.mobile'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='addUser'>确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
      <!-- 表单 -->
      <el-form :model='editForm' ref="editForm" :rules='rules' label-width="70px" status-icon>
        <el-form-item label='用户名'>
          <!-- <el-input disabled v-model='editForm.username'></el-input> -->
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model='editForm.email'></el-input>
        </el-form-item>
        <el-form-item label='电话' prop='mobile'>
          <el-input v-model='editForm.mobile'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='editUser'>确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="assignDialogVisible" width="40%">
      <!-- 表单 -->
      <el-form :model='assignForm' ref="assignForm" label-width="70px" status-icon>
        <el-form-item label='用户名'>
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='assignRole'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      current: 1,
      pageSize: 2,
      total: 0,
      userList: [],
      addDialogVisible: false, // 添加用户对话框
      editDialogVisible: false, // 修改用户对话框
      addForm: {
        // 添加用户表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      // 是否显示分配角色对话框
      assignDialogVisible: false,
      options: [],
      assignForm: {
        id: '', // 当前用户的id
        username: '', // 用户名
        rid: '' // 当前用户的角色id
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱', trigger: 'change' }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 获取用户列表数据
    getUserList() {
      this.axios({
        url: '/users',
        method: 'get',
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      }).then(res => {
        let {
          data: { users, total },
          meta: { status }
        } = res.data
        if (status === 200) {
          this.userList = users
          this.total = total
        }
      })
    },
    // 修改每天显示条数方法
    handleSizeChange(val) {
      this.pageSize = val
      this.current = 1
      this.getUserList()
    },
    // 更改当前页方法
    handleCurrentChange(val) {
      console.log(val)
      // 点击切换对应页面数据 重新渲染页面
      this.current = val
      this.getUserList()
    },
    // 查询方法
    queryList() {
      // 查询只需要重新渲染页面就行了
      this.getUserList()
    },
    // 修改用户状态
    changeState(row) {
      this.axios({
        url: `/users/${row.id}/state/${row.mg_state}`,
        method: 'put'
      }).then(res => {
        const { meta } = res.data
        if (meta.status === 200) {
          this.$message.success('修改状态成功了')
        } else {
          this.$message.error('修改状态失败了')
        }
      })
    },
    // 删除用户
    // 1、弹出确认框
    // 2、点击确定按钮后发送axios请求后台删除
    // 3、判断删除后的页面是否为最后一条数据 如果是让当前页 this.current--
    delUser(row) {
      this.$confirm('您确定删除此用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击确定的时候 发送axios请求后台删除数据
          let res = await this.axios.delete(`/users/${row.id}`)
          let {
            meta: { status }
          } = res.data
          if (status === 200) {
            this.$message.success('删除用户成功了')
            // 重新渲染页面
            if (this.userList.length === 1 && this.current > 1) {
              this.current--
            }
            this.getUserList()
          } else {
            this.$message.error('删除用户失败了')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 显示添加用户对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 添加用户
    addUser() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 校验通过 发送ajax请求
          let res = await this.axios.post('users', this.addForm)
          let {
            meta: { status }
          } = res.data
          if (status === 201) {
            // 添加用户成功
            this.$message.success('添加用户成功了')(
              // 关闭对话框
              (this.addDialogVisible = false)
            )
            // 重置表单数据
            this.$refs.addForm.resetFields()

            // 求最大的页面
            this.total++
            this.current = Math.ceil(this.total / this.pageSize)
            // 从新渲染页面
            this.getUserList()
          }
        } else {
          this.$message({
            type: 'error',
            message: '添加用户失败了'
          })
        }
      })
    },
    // 显示修改用户对话框  数据回显
    showEditDialog(row) {
      this.editDialogVisible = true
      // this.editForm.username = row.username
      // this.editForm.email = row.email
      // this.editForm.mobile = row.mobile
      // this.editForm.id = row.id
      this.editForm = row
    },
    // 修改用户
    editUser() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          //  验证通过 发送ajax请求
          let res = await this.axios.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          let { meta } = res.data
          if (meta.status === 200) {
            // 修改用户成功 关闭对话框 重置表单 从新渲染页面
            this.$message.success('用户修改成功')
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.getUserList()
          } else {
            this.$message({
              type: 'error',
              message: meta.msg
            })
          }
        } else {
          return false
        }
      })
    },
    async showAssignDialog(row) {
      this.assignDialogVisible = true
      this.assignForm.id = row.id
      this.assignForm.username = row.username

      // 回显rid
      // 发生ajax请求 获取用户的角色id(rid)
      let res = await this.axios.get(`users/${row.id}`)
      let { meta, data } = res.data
      if (meta.status === 200) {
        if (data.rid === -1) {
          this.assignForm.rid = ''
        } else {
          this.assignForm.rid = data.rid
        }
      }

      // 发生ajax请求 获取角色列表
      this.getRoleList()
    },
    async getRoleList() {
      let res = await this.axios.get('roles')
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.options = data
      }
    },
    // 分配用户的角色
    async assignRole() {
      // 校验 非空
      if (!this.assignForm.rid) {
        this.$message.error('请选择角色名称')
        return
      }
      let res = await this.axios.put(`users/${this.assignForm.id}/role`, {
        rid: this.assignForm.rid
      })
      let { meta } = res.data
      if (meta.status === 200) {
        this.assignDialogVisible = false
        this.getUserList()
        this.$message.success('分配角色成功了')
      }
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang='less' scoped>
.input-with-select {
  width: 300px;
  margin-bottom: 10px;
}
</style>
