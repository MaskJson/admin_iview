<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :userNameRules="userNameRules"
                      :passwordRules="passwordRules"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5'
  import LoginForm from '_c/login-form'
  import {getJWT, getUserInfo, login} from "@/api/index";
  import Cookies from "js-cookie"
  import util from "@/libs/util.js"

  export default {
    data() {
      return {
        userNameRules: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        passwordRules: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      }
    },
    components: {
      LoginForm
    },
    methods: {
      handleSubmit({userName, password}) {
        login({
          username: userName,
          password: md5(password)
        }).then(data => {
          this.setStore("accessToken", data.token);
          // 保存7天
          Cookies.set("userInfo", JSON.stringify(data.user), {
            expires: 7
          });

          this.setStore("userInfo", data.user);
          //头像
          this.$store.commit("setAvatarPath", data.user.avatar);
          // 加载菜单
          util.initRouter(this);
          this.$router.push({
            name: "home"
          });
        }).catch(data => {})
      }
    }
  }
</script>

<style>

</style>
