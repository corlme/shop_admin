<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="active">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tabs组件 -->
    <el-tabs tab-position="left" @tab-click='change' v-model='activeName'>
      <el-tab-pane name='basic' label="基本信息">
        <el-form :model='form' label-width='80px'>
          <el-form-item label='商品名称'>
            <el-input v-model='form.goods_name'></el-input>
          </el-form-item>

          <el-form-item label='商品价格'>
            <el-input v-model='form.goods_price'></el-input>
          </el-form-item>
          <el-form-item label='商品重量'>
            <el-input v-model='form.goods_weight'></el-input>
          </el-form-item>
          <el-form-item label='商品数量'>
            <el-input v-model='form.goods_number'></el-input>
          </el-form-item>
          <el-form-item label='商品分类'>
            <el-cascader :options="options" v-model="form.goods_cat" :props='props'>
            </el-cascader>
          </el-form-item>
          <el-form-item label='是否促销'>
            <el-radio v-model="form.is_promote" :label="true">是</el-radio>
            <el-radio v-model="form.is_promote" :label="false">否</el-radio>
          </el-form-item>
          <el-button type='primary' @click="next(1, 'pic')">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name='pic' label="商品图片">
        <el-upload :headers='headers' class="upload-demo" action="http://localhost:8888/api/private/v1/upload"
          list-type="picture" :on-success='handleSuccess' :on-remove='handleRemove'>
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type='primary' @click="next(2,'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane name='content' label="商品内容">
        <quill-editor v-model='form.goods_introduce'></quill-editor>
        <el-button type='primary' @click="addGood">添加</el-button>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: false,
        // 用于存放上传的图片地址
        pics: [],
        goods_introduce: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      activeName: 'basic',
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    change(tab) {
      // 修改active的值
      this.active = tab.index - 0
    },
    // 下一步
    next(actvie, activeName) {
      this.active = actvie
      this.activeName = activeName
    },
    // 图片上传成功后
    handleSuccess(response, file, fileList) {
      // console.log(response)
      this.form.pics.push({
        pic: response.data.tmp_path
      })
    },
    // 删除图片 (找到对应图片的下标，根据下标删除)
    handleRemove(file) {
      console.log(file)
      let tmpPath = file.response.data.tmp_path
      // 找对应项的下标
      let idx = this.form.pics.findIndex(item => item.pic === tmpPath)
      this.form.pics.splice(idx, 1)
    },
    // 添加商品
    async addGood() {
      let res = await this.axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      let {
        meta: { status }
      } = res.data
      if (status === 201) {
        // 成功之后跳转到商品列表页
        this.$router.push('/goods')
        // this.getGoodsList()
      }
    }
  },
  async created() {
    let res = await this.axios.get('categories?type=3')
    console.log(res.data)

    let {
      meta: { status },
      data
    } = res.data
    if (status === 200) {
      this.options = data
    }
  }
}
</script>

<style lang='less' scoped>
.quill-editor {
  background-color: #fff;
  /deep/ .ql-editor {
    height: 300px;
  }
}
</style>


