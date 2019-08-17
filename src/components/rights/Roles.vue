<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click='showAddDialog'>添加角色</el-button>
    <el-table :data='roleList' style="width: 100%;">
      <el-table-column type='expand'>
        <template slot-scope='scope'>
          <el-row v-if="scope.row.children.length === 0">
            <span style="color: lime">当前角色没有权限数据</span>
          </el-row>
          <!-- 一级权限 -->
          <el-row class="level1" v-for="level1 in scope.row.children" :key="level1.id">
            <el-col :span='4'>
              <el-tag closable @close="delRight(scope.row, level1.id)">
                {{level1.authName}}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 2级权限 -->
              <el-row class="level2" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag type="success" closable @close="delRight(scope.row, level2.id)">
                    {{level2.authName}}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 3级权限 -->
                <el-col :span="20">
                  <el-tag closable class="level3" type="danger" v-for="level3 in level2.children" :key="level3.id"
                    @close="delRight(scope.row, level3.id)">
                    {{level3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop='roleName' label='角色名称'></el-table-column>
      <el-table-column prop='roleDesc' label='描述'></el-table-column>
      <el-table-column label='操作'>
        <!-- 自定义操作模块 -->
        <template slot-scope='scope'>
          <el-button type="primary" icon="el-icon-edit" size="mini" plain @click="showEditDialog(scope.row)">
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain @click="delRole(scope.row)">
          </el-button>
          <el-button type="success" size="mini" plain @click="showAssignDialog(scope.row)">
            <i class="el-icon-check"></i>
            分配权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="40%">
      <!-- 表单 -->
      <el-form :model='addForm' ref="addForm" :rules='rules' label-width="80px" status-icon>
        <el-form-item label='角色名称' prop='roleName'>
          <el-input v-model='addForm.roleName'></el-input>
        </el-form-item>
        <el-form-item label='角色描述' prop='roleDesc'>
          <el-input v-model='addForm.roleDesc'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="40%">
      <!-- 表单 -->
      <el-form :model='editForm' ref="editForm" :rules='rules' label-width="80px" status-icon>
        <el-form-item label='角色名称' prop='roleName'>
          <el-input v-model='editForm.roleName'></el-input>
        </el-form-item>
        <el-form-item label='角色描述' prop='roleDesc'>
          <el-input v-model='editForm.roleDesc'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="assignDialogVisible" width="40%" @close="closeRight">
      <!-- 树形控件 -->
      <el-tree :data="rightList" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current
        :props="defaultProps">
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      roleId: '',
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      assignDialogVisible: false,
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'change' }
        ]
      },
      rightList: [],
      // 树形控件默认配置
      defaultProps: {
        // 指定如何查找子节点
        children: 'children',
        // 指定标签显示哪个属性
        label: 'authName'
      }
    }
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get('roles')
      console.log(res.data)
      let {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.roleList = data
      }
    },
    // 显示添加角色对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 添加角色
    async addRole() {
      let res = await this.axios.post('roles', this.addForm)
      let { meta } = res.data
      if (meta.status === 201) {
        // 添加成功 关闭对话框 重置表单数据 重新渲染页面
        this.$message.success('添加角色成功了')
        this.addDialogVisible = false
        this.$refs.addForm.resetFields()
        this.getRoleList()
      } else {
        this.$message.error('添加角色失败了')
      }
    },
    showEditDialog(row) {
      this.editDialogVisible = true
      this.editForm = row
    },
    async editRole() {
      let res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
      let {
        meta: { status }
      } = res.data
      if (status === 200) {
        this.$message.success('修改角色成功')
        this.editDialogVisible = false
        this.getRoleList()
      } else {
        this.$message.error('修改角色失败')
      }
    },
    // 删除角色
    async delRole(row) {
      try {
        await this.$confirm('您确定删除该角色吗？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${row.id}`)
        let {
          meta: { status }
        } = res.data
        if (status === 200) {
          this.$message.success('删除角色成功')
          this.getRoleList()
        } else {
          this.$message.error('删除角色失败')
        }
      } catch (e) {
        this.$message.info('取消删除了')
      }
    },
    // 删除角色的权限
    async delRight(row, rightId) {
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`)
      let { meta, data } = res.data
      if (meta.status === 200) {
        this.$message.success('删除权限成功')
        // 只重新渲染权限部分
        row.children = data
      } else {
        this.$message.error('删除失败了')
      }
    },
    async showAssignDialog(row) {
      this.assignDialogVisible = true
      // 存储角色id
      this.roleId = row.id

      let res = await this.axios.get(`rights/tree`)
      let { meta, data } = res.data
      if (meta.status === 200) {
        this.rightList = data
      }
      // 获取到当前角色拥有的所有权限的id
      // 定义一个空数据接收
      let temp = []
      row.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            // 使用一个空数组，把当前角色拥有的所有权限存储起来
            temp.push(level3.id)
          })
        })
      })

      // 让树形结构选中
      this.$refs.tree.setCheckedKeys(temp)
    },

    closeRight() {
      this.$refs.tree.setCheckedKeys([])
    },
    // 点击确定添加权限
    async assignRight() {
      console.log('点击了')

      // 获取角色id 权限列表
      let keys = this.$refs.tree.getCheckedKeys()
      let halfkeys = this.$refs.tree.getHalfCheckedKeys()
      let rids = keys.concat(halfkeys).join()
      let res = await this.axios.post(`roles/${this.roleId}/rights`, {
        rids
      })
      console.log('修改权限', res)

      let { meta } = res.data
      if (meta.status === 200) {
        this.$message.success('修改权限成功了')
        this.assignDialogVisible = false
        this.getRoleList()
      }
    }
  },

  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.level1 {
  margin-bottom: 10px;
}
.level2 {
  margin-bottom: 10px;
}
.level3 {
  margin-right: 5px;
}
</style>
