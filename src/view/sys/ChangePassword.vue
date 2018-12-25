<template>
  <Card>
    <Form :label-width="100" :model="model" :rules="rules" ref="form">
      <FormItem label="原密码：" prop="old">
        <Input class="w300" type="password" v-model="model.old"/>
      </FormItem>
      <FormItem label="新密码：" prop="password">
        <Input class="w300" type="password" v-model="model.password"/>
      </FormItem>
      <FormItem label="确认密码：" prop="password2">
        <Input class="w300" type="password" v-model="model.password2"/>
      </FormItem>
      <FormItem>
        <Button type="primary" :loading="loading" @click="submit">确认修改</Button>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
  import {changePassword} from "../../api";
  import {getUserId} from "../../libs/tools";

  export default {
    name: "ChangePassword",
    data() {
      return {
        loading: false,
        model: {
          old: null,
          password: null,
          password2: null
        },
        rules: {
          old: [
            { required: true, message: '请输入原密码', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
          password2: [
            { required: true, message: '请确认新密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.model.password === this.model.password2) {
              const params = {
                id: getUserId(),
                oldPassword: this.model.old,
                newPassword: this.model.password
              }
              this.loading = true;
              changePassword(params).then(res => {
                this.loading = false;
                if (res.code == 200) {
                  this.$Message.success('修改成功');
                  // 退出登录
                  this.$store.commit("logout", this);
                  this.$store.commit("clearOpenedSubmenu");
                  // 强制刷新页面 重新加载router
                  location.reload();
                }
              }).catch(res => {
                this.loading = false;
              })
            } else {
              this.$Message.warning('确认密码不一致');
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
