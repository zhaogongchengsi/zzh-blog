
# Vue 动态路由

在项目中，路由一般会根据后端返回的路由信息而动态生成路由

## 后端路由数据
首先准备后端路由数据，一般后端会根据权限生成动态路由信息的json数据，
动态的路由数据一般和 vue-router的options一样 只是component 存储的是
字符串。后端不能存储前端的组件
```js
// 假装动态路由数据
const menus = [
  {
    path: "/",
    name: "home",
    component: "views/Home.vue",
    label: "Home",
    children: [
      {
        path: "page",
        name: "page",
        component: "views/page/index.vue",
        label: "Page",
      },
    ],
  },
  {
    path: "/user",
    name: "user",
    component: "views/User.vue",
    label: "User",
    redirect: "/user/list",
    children: [
      {
        path: "list",
        name: "list",
        component: "views/user/index.vue",
        label: "List",
      },
    ],
  },
]

// 假装在请求
export async function GetMnues () {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(menus)
    },500)
  })
}

```

## 全局状态管理 pinia
路由数据一般需要存储起来需要用来生成menu按钮用以路由跳转
一般会本地存储和store中存储各一份，这里就存一份在store中
```js
import { defineStore } from "pinia"
import { GetMnues } from "../api"

export const routerStore = defineStore("router", {
  state: () => ({
    menus: [],
  }),
  getters: {
    getMnues: () => {
      return this.menus
    }
  },
  actions: {
    async actionsMenus( ) {
      // 发起路由数据请求
      let menus = await GetMnues()
      this.menus = menus
    }
  },
})

```

## 注册vue-router和pinia
pinia注册使用很简单，稍微麻烦一点的就是路由使用
```js
// main.js

import { createApp } from 'vue'
import App from './App.vue'
import { useRouter } from "./routers"
import { createPinia } from "pinia"
const pinia = createPinia()

async function Bootstrap () {
  const app = createApp(App)
  // 注册路由
  app.use(pinia)
  await useRouter(app)
  app.mount('#app')
}

Bootstrap()
```

## 动态路由实现
首先需要通过vite中的 [import.meta.glob](https://cn.vitejs.dev/guide/features.html#glob-import)将views中的```.vue```文件全部获取
会得到一个对象，每个value都是一个组件，key就是路径，然后需要得到store。然后发起请求获取路由数据。
```js
import {
  createRouter,
  createWebHistory,
} from "vue-router"
import { routerStore } from "../store"
const components = import.meta.glob("../views/**/*.vue")

export async function setupRouter(app) {
  const _router =  routerStore()
  await _router.actionsMenus() // 发请求一般是异步的 所以这里需要await

  const routers = []

  const router = createRouter({
    history: createWebHistory(),
    routes: routers,
  })

  
  app.use(router)
}
```

## 格式化文件模块
获取的文件模块的key，在前面一般会有 ```../```的字符串和路由数据中的 ```views```还有所区别
所以首先将前面多余的路径字符串删除掉，然后用一个map存储对应的组件，处理后的key就是map的key
```js
// 优化路由组件列表
function getRouters () {
  const routerMap = new Map()
  for (let key in components) {
    let _key = key.replace(/^\..\//, "")
    routerMap.set(_key, components[key])
  }
  return routerMap
}

```

## 替换真实的组件
```routers```为请求回来的路由数据，```components``` 为处理后的组件模块
需要使用递归处理，因为路由可能会有子路由
```js
// 替换组件
function getAsyncComponents (routers, components) {
  return routers.map(item => {
    if (item.component) {
      // 获取组件
      let _component = components.get(item.component)
      if (_component) {
        // 组件存在 则 替换
        item.component = _component
      } else {
        // 不存在则替换成 报错组件 或者直接删除掉当前路由
        item.component = () => import('../views/NotFon.vue')
      }
    }
    if (item.children) {
      // 当子路由存在时，递归处理
      item.children = getAsyncComponents(item.children, components)
    }
    return item
  })
}
```

## 生成真实路由数据
```getAsyncComponents(_router.menus, getRouters())```唯一多的这行 用来生成真实的路由数据
```js
export async function useRouter(app) {
  const _router =  routerStore()
  await _router.actionsMenus()

  // 替换后的组件
  const routers = getAsyncComponents(_router.menus, getRouters())

  const router = createRouter({
    history: createWebHistory(),
    routes: routers,
  })

  
  app.use(router)
}
```

## 递归组件 Menu

>1. **menus** 菜单数据
2. **activeClass** 激活的类名
递归组件必须有一个组件名
```js
<script>
export default {
  name: "Menu"
}
</script>
<script setup>
const props = defineProps({
    activeClass: {
        type: String,
        default: "active",
    },
    menus: {
        type: Array,
        default: () => []
    }
})
</script>
```


> 利用递归组件生成子路由下的menu按钮
```html
<template>
  <div class="menu-container">
    <nav class="menu-nav">
      <ul class="menu-ul">
        <li
          v-for="(menu, index) of props.menus"
          :key="index"
          class="menu-li"
        >
          <router-link 
            :to="menu.path" class="menu-link" 
            :active-class="props.activeClass" >{{menu.label}}</router-link>
            <!-- 当子路由存在则 开始递归 -->
          <Menu v-if="menu.children && menu.children.length > 0" :menus="menu.children"></Menu>
        </li>
      </ul>
    </nav>
  </div>
</template>
```


> 简单处理下样式 可以忽略
```scss
.menu-nav {
  width: 250px;
  .menu-ul {
    list-style: none;
    .menu-li {
      .menu-link {
        display: inline-block;
        padding: 0.5rem 1rem;
        color: #333;
        text-decoration: none;
        &.active {
          color: #fff;
          background-color: #333;
        }
      }
    }
  }
}
```

### 效果图
效果没有啥问题

![效果图](/exampleImg/router1.png)