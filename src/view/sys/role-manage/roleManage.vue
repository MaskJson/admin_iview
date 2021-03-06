<style lang="less">
  @import "./roleManage.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row class="operation">
            <Button @click="addRole" type="primary" icon="md-add">添加角色</Button>
            <Button @click="delAll" icon="md-trash">批量删除</Button>
            <Button @click="init" icon="md-refresh">刷新</Button>
            <circleLoading v-if="operationLoading"/>
          </Row>
          <Row>
            <Alert show-icon>
              已选择 <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row>
            <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom"
                   @on-sort-change="changeSort" @on-selection-change="changeSelect"></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page :current="pageNumber" :total="total" :page-size="pageSize" @on-change="changePage"
                  @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total
                  show-elevator show-sizer></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal :title="modalTitle" v-model="roleModalVisible" :mask-closable='false' :width="500">
      <Form ref="roleForm" :model="roleForm" :label-width="80" :rules="roleFormValidate">
        <FormItem label="角色名称" prop="roleName">
          <Input v-model="roleForm.roleName" placeholder="按照Spring Security约定建议以‘ROLE_’开头"/>
        </FormItem>
        <FormItem label="备注" prop="description">
          <Input v-model="roleForm.description"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelRole">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitRole">提交</Button>
      </div>
    </Modal>
    <Modal title="分配权限(点击选择)" v-model="permModalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}"
           class="permModal">
      <Tree ref="tree" :data="permData" multiple></Tree>
      <Spin size="large" v-if="treeLoading"></Spin>
      <div slot="footer">
        <Button type="text" @click="cancelPermEdit">取消</Button>
        <Button @click="selectTreeAll">全选/反选</Button>
        <Button type="primary" :loading="submitPermLoading" @click="submitPermEdit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    addRole,
    deleteRole,
    editRole,
    editRolePerm,
    getAllPermissionList,
    getRoleByPage,
    setDefaultRole
  } from '@/api/index'
  import moment from 'moment'
  import circleLoading from '../../my-components/circle-loading.vue'

  export default {
    name: 'role-manage',
    components: {
      circleLoading
    },
    data () {
      return {
        loading: true,
        treeLoading: true,
        operationLoading: false,
        submitPermLoading: false,
        sortColumn: 'createTime',
        sortType: 'desc',
        modalType: 0,
        roleModalVisible: false,
        permModalVisible: false,
        modalTitle: '',
        roleForm: {
          description: ''
        },
        roleFormValidate: {
          roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
        },
        submitLoading: false,
        selectList: [],
        selectCount: 0,
        columns: [
          {
            type: 'selection',
            // width: 60,
            align: 'center'
          },
          {
            title: 'id',
            // width: 60,
            key: 'id',
            align: 'center'
          },
          {
            title: '角色名称',
            key: 'roleName',
            // width: 190,
            sortable: true
          },
          {
            title: '备注',
            key: 'description',
            // width: 190,
            sortable: true
          },
          {
            title: '创建时间',
            key: 'createTime',
            // width: 160,
            sortable: true,
            sortType: 'desc',
            render: (h, params) => {
              if (params.row.createTime) {
                return h('div', moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss'))
              }
            }
          },
          {
            title: '更新时间',
            key: 'updateTime',
            // width: 160,
            sortable: true,
            render: (h, params) => {
              if (params.row.updateTime) {
                return h('div', moment(params.row.updateTime).format('YYYY-MM-DD HH:mm:ss'))
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            // width: 300,
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editPerm(params.row)
                      }
                    }
                  },
                  '分配权限'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.edit(params.row)
                      }
                    }
                  },
                  '编辑'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.remove(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        ],
        data: [],
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        permData: [],
        editRolePermId: '',
        selectPermList: [],
        selectAllFlag: false
      }
    },
    methods: {
      init () {
        this.getRoleList();
        // 获取所有菜单权限树
        this.getPermList();
      },
      changePage (v) {
        this.pageNumber = v;
        this.getRoleList();
        this.clearSelectAll();
      },
      changePageSize (v) {
        this.pageSize = v;
        this.getRoleList();
      },
      changeSort (e) {
        this.sortColumn = e.key;
        this.sortType = e.order;
        if (e.order === 'normal') {
          this.sortType = ''
        }
        this.getRoleList()
      },
      getRoleList () {
        this.loading = true;
        let params = {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          sort: this.sortColumn,
          order: this.sort
        };
        getRoleByPage(params).then(data => {
          this.loading = false;
          this.data = data.content;
          this.total = data.totalElements;
        }).catch(data => {
          this.loading = false;
        })
      },
      getPermList () {
        this.treeLoading = true;
        getAllPermissionList().then(data => {
          this.treeLoading = false;
          this.deleteDisableNode(data);
          this.permData = data;
        }).catch(data => {
          this.treeLoading = false;
        })
      },
      // 递归标记禁用节点
      deleteDisableNode (permData) {
        let that = this;
        permData.forEach(function (e) {
          if (e.status === -1) {
            e.title = '[已禁用] ' + e.title;
            e.disabled = true;
          }
          if (e.children && e.children.length > 0) {
            that.deleteDisableNode(e.children);
          }
        })
      },
      cancelRole () {
        this.roleModalVisible = false
      },
      submitRole () {
        this.$refs.roleForm.validate(valid => {
          if (valid) {
            let handler;
            handler = this.modalType === 0 ? addRole : editRole;
            const params = {
              roleName: this.roleForm.roleName,
              description: this.roleForm.description
            };
            if (this.modalType !==0) {
              params.id = this.roleForm.id;
            }
            this.submitLoading = true;
            handler(params).then(data => {
              this.submitLoading = false;
              this.$Message.success('操作成功');
              this.getRoleList();
              this.roleModalVisible = false;
            }).catch(data => {
              this.submitLoading = false;
            })
          }
        })
      },
      addRole () {
        this.modalType = 0;
        this.modalTitle = '添加角色';
        this.$refs.roleForm.resetFields();
        delete this.roleForm.id;
        this.roleModalVisible = true;
      },
      edit (v) {
        this.modalType = 1;
        this.modalTitle = '编辑角色';
        // 转换null为""
        for (let attr in v) {
          if (v[attr] === null) {
            v[attr] = '';
          }
        }
        let str = JSON.stringify(v);
        let roleInfo = JSON.parse(str);
        this.roleForm = roleInfo;
        this.roleModalVisible = true;
      },
      remove (v) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '您确认要删除角色 ' + v.roleName + ' ?',
          onOk: () => {
            this.operationLoading = true;
            deleteRole(v.id).then(data => {
              this.operationLoading = false;
              this.$Message.success('删除成功');
              this.getRoleList();
            }).catch(data => {
              this.operationLoading = false;
            })
          }
        })
      },
      clearSelectAll () {
        this.$refs.table.selectAll(false);
      },
      changeSelect (e) {
        this.selectList = e;
        this.selectCount = e.length;
      },
      delAll () {
        if (this.selectCount <= 0) {
          this.$Message.warning('您还未选择要删除的数据');
          return;
        }
        this.$Modal.confirm({
          title: '确认删除',
          content: '您确认要删除所选的 ' + this.selectCount + ' 条数据?',
          onOk: () => {
            let ids = '';
            this.selectList.forEach(function (e) {
              ids += e.id + ','
            });
            ids = ids.substring(0, ids.length - 1);
            this.operationLoading = true;
            deleteRole(ids).then(res => {
              this.operationLoading = false;
              this.$Message.success('删除成功');
              this.clearSelectAll();
              this.getRoleList();
            }).catch(data => {
              this.operationLoading = false;
            })
          }
        })
      },
      editPerm (v) {
        this.editRolePermId = v.id;
        // 匹配勾选
        let rolePerms = v.permissions;
        // 递归判断子节点
        this.checkPermTree(this.permData, rolePerms);
        this.permModalVisible = true;
      },
      // 递归判断子节点
      checkPermTree (permData, rolePerms) {
        let that = this;
        permData.forEach(function (p) {
          if (that.hasPerm(p, rolePerms)) {
            p.selected = true;
          } else {
            p.selected = false;
          }
          if (p.children && p.children.length > 0) {
            that.checkPermTree(p.children, rolePerms);
          }
        })
      },
      // 判断角色拥有的权限节点勾选
      hasPerm (p, rolePerms) {
        let flag = false;
        if (!rolePerms) {
          return false;
        }
        for (let i = 0; i < rolePerms.length; i++) {
          if (p.id === rolePerms[i].id) {
            flag = true;
            break;
          }
        }
        if (flag) {
          return true;
        }
        return false;
      },
      // 全选反选
      selectTreeAll () {
        this.selectAllFlag = !this.selectAllFlag;
        let select = this.selectAllFlag;
        this.selectedTreeAll(this.permData, select)
      },
      // 递归全选节点
      selectedTreeAll (permData, select) {
        let that = this;
        permData.forEach(function (e) {
          e.selected = select;
          if (e.children && e.children.length > 0) {
            that.selectedTreeAll(e.children, select);
          }
        })
      },
      submitPermEdit () {
        this.submitPermLoading = true;
        let permIds = [];
        let selectedNodes = this.$refs.tree.getSelectedNodes();
        selectedNodes.forEach(function (e) {
          permIds.push(e.id);
        });
        editRolePerm({
          roleId: this.editRolePermId,
          permIds: permIds.join(',')
        }).then(data => {
          this.submitPermLoading = false;
          this.$Message.success('操作成功');
          this.getRoleList();
          this.permModalVisible = false;
        }).catch(data => {
          this.submitPermLoading = false;
        })
      },
      cancelPermEdit () {
        this.permModalVisible = false;
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
