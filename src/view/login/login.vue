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
          password: password
        }).then(res => {
          if (res.success === true) {
            this.setStore("accessToken", res.result);
            // 获取用户信息
            getUserInfo().then(res => {
              if (res.success === true) {
                // 避免超过大小限制
                delete res.result.permissions;

                // 保存7天
                Cookies.set("userInfo", JSON.stringify(res.result), {
                  expires: 7
                });

                this.setStore("userInfo", res.result);
                //头像
                this.$store.commit("setAvatarPath", res.result.avatar);
                // 加载菜单
                util.initRouter(this);
                this.$router.push({
                  name: "home"
                });
              }
            });
          } else {
            this.$Message.error(res.message || '登录失败');
          }
        })
      }
    }
  }
</script>

<style>

</style>
