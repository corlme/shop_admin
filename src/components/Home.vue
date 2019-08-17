<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="logout">
        <span>欢迎光临</span>
        <a href="javascript:;" @click='logout'>退出</a>
      </div>
      <div class="title">电商后台管理系统</div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- default-active="$route.path.slice(1)" 让当前菜单项高亮 -->
        <el-menu :default-active="$route.path.slice(1).split('-')[0]" background-color="blue" text-color="#fff"
          active-text-color="#ffd04b" unique-opened router>
          <el-submenu v-for="menu in menuList" :key="menu.id" :index="menu.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item v-for="item in menu.children" :key="item.id" :index="item.path">
              <i class="el-icon-menu"></i>
              <span>{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    logout() {
      this.$confirm('您确定退出吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('token')
          this.$router.push('/login')
          this.$message.success('退出成功')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '退出取消'
          })
        })
    }
  },
  // 动态获取左侧菜单列表数据(每个角色展示的菜单是不一样的)
  async created() {
    let res = await this.axios.get('menus')
    let {
      meta: { status },
      data
    } = res.data
    if (status === 200) {
      this.menuList = data
      // console.log(this.menuList)
    }
  }
}
</script>

<style lang='less' scoped>
.home {
  height: 100%;
  .el-header {
    background-color: skyblue;
    .logo {
      width: 180px;
      height: 60px;
      float: left;
      background: url('../assets/logo.png') no-repeat center center;
      // cover:覆盖背景，多的部分会溢出  contain：宽高最大，可能会平铺
      background-size: contain;
    }
    .logout {
      width: 180px;
      height: 60px;
      line-height: 60px;
      text-align: right;
      float: right;
      font-weight: bold;
      a {
        color: rgb(243, 206, 137);
        text-decoration: none;
      }
    }
    .title {
      overflow: hidden;
      line-height: 60px;
      text-align: center;
      color: #fff;
      font-size: 28px;
      font-weight: bold;
    }
  }
  .el-aside {
    background-color: blue;
    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #eee;
  }
}
</style>
