# demo

> A Vue.js project

**/  /mock  /big**

# 1.插槽功能
- 不具名插槽
```
子组件：    
    <div class="child">
        <slot></slot>
    </div>
父组件:
    <div class="main">
        <child>
            <p>我是父组件仍在子组件插槽的内容</p>
        </child>
    </div>
```
- 具名插槽，就是为插槽提供一个名字
```
子组件：
        <slot name="slot1"></slot>
        <slot name="slot2"></slot>
父组件：
        <child>
            <p slot="slot1">我是父组件仍在子组件插槽的内容</p>
            <p slot="slot2">我是父组件仍在子组件的第二个内容</p>
        </child> 
```
- 如果父组件没传递数据，就显示slot里面默认的数据
```
子组件：
        <slot name="slot1">如果没有父组件没有传递数据，就显示我</slot>
        <slot name="slot2"></slot>
父组件：
        <child>
            <p slot="slot2">我是父组件仍在子组件的第二个内容</p>
        </child> 
```
- 作用域slot：数据是子传父
```
子组件：发送数据
        <slot name="slot3" text="我是子组件数据"></slot>
父组件：接受数据
        <child>
            <p slot="slot3" slot-scope="props">
                {{ props.text }}
            </p>
        </child> 
```

# 2.keep-alive 缓存动态组件
- 动态组件
```
子组件：small
父组件：
html:
<component :is="currentView"> 或者 {{ currentView }}

import small from './small'
components: {
    small
}
data() {
    return {
        currentView: 'small'
    }
}
```
- 组件视图切换
```
父：
<component :is="currentView"> 或者 {{ currentView }}
<button @click="changeView">切换视图</button>
import small from './small'
import small from './small2'

components: {
    small，
    small2
}
data() {
    return {
        currentView: 'small',
        flag: true
    }
}
methods: {
    changeView() {
        if(this.flag) {
            this.currentView = 'small
            this.falg = false
        }else{
            this.currentView = 'small2
            this.flag = true
        }
    }
}
```

# 3.axios拦截
- 全局的 axios 默认值
```
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```
- 拦截器
在请求或响应被then 或 catch 处理前拦截他们
先是请求，响应，然后才拿到数据
在拿数据前参数是否合理，请求是否有问题，
返回的数据如果是错的，就没必要给了
```
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
```
如果你想在稍后移除拦截器，可以这样：
```
var myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

post数据可以在发送请求之前加上qs.stringify
```
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  console.log(config)
  if(config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
```

加qs.stringify之前的数据：
"{"user_id":"iwen@qq.com","password":"iwen123","vertification_code":"crfvw"}"
加qs.stringify后的数据
"user_id=iwen%40qq.com&password=iwen123&vertification_code=crfvw"


# 4.跨域解决方案
- 如果服务器不做跨域处理，即node中不加：
```
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
```
- 前端可以在config/index.js中进行设置
```
把  proxyTable: {}, 替换 
dev: {
    proxyTable: {
      '/api': {
          target: 'http://api.douban.com/v2',//目标地址,比如豆瓣
          changeOrigin: true,
          secure: false,
          pathRewrite: {
              '^/api': ''
          }
        }
    }
}
然后在main.js中加：
Vue.prototype.HOST = '/api'//读HOST相当于读config/index.js中的地址
```
完了之后写法是：
```
var url = this.HOST + '/login
this.$axios.post(url,{

})
```
*这种跨域解决方案，只适用于测试阶段，打包的时候，不会具备服务器，不能跨域了。后端去解决*

# 5.自定义指令directive
- 全局指令
```
main.js:
Vue.directive('focus, {
    inserted: function(el) {//el表示绑定的元素，这里指的是input
        el.foucs()
    }
})
```
使用:
```
<input type="text" v-focus>
```
- 局部指令
在组件中写：
```
<input type="text" v-focus>
<p v-mycss></p>
```
```
export default {
    directives: {
        focus: {
            inserted: function(el) {
                el.focus()
            }
        },
        mycss: {
            inserted: function(el) {
                el.style.collor = 'red'
            }
        }
    }
}

```

# 6. 过滤器filter
vue可自定义过滤器
```
{{ price | moneyChange }}
{{ info | contextData }}


filters: {
    moneyChange(val) {
        if(typeof val === "number"){//判断是不是数字
            return '$' + val
        }else{
            return val
        }
    },
    contenData(val) {
        return val + '-------来自外星人' + new Date()
    }
}
```

# 7.Mock模拟数据
- 1.自己创建JSON文件，使用get请求形式访问数据
    优点：方便，快捷
    缺点：只能存在get请求
- 2.项目中集成服务器，模拟各种接口（大多数用这种情况）
    优点： 模拟真实线上环境
    缺点：增加开发成本
- 3.直接使用线上数据（适合重构的时候）
    优点： 真实
    缺点： 不一定每个项目都存在
## mock.js库
```
npm install mockjs --save-dev

在node的router中引入
var mock = require('mockjs')
router.get('/mock.js',(req,res) => {
    //数据是随机生成的
    var data = Mock.mock({
        // 随机1-10个
        'list|1-10': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 1,
            'name|min-max': value
        }]
    })
    res.json(200, data)
})
```

# 8.watch和computed
- computed 不支持异步，因为默认调用get方法，必须有return
- watch 只有值变化的时候才会触发，支持异步

```
    {{ msg }}
    <input type="text" v-model="a">

    data() {
        return {
           newsData: [],
           a: 'watch正在观察我',
           msg: 'msg'
        }
    },
    watch: {
        a(newVal,oldVal) {
            console.log(newVal,oldVal)
            if(newVal.length < 3) {
                return this.msg = '太少'
            }
            if(newVal.length > 6) {
                return this.msg = '太多'
            }
            this.msg = ' '
        }
    },
```
 # 路由参数
 ```
{
    path: '/article/:c/:a'
    name: 'pro'
}
$route.params.c
//如果用对象作为to的属性，并使用了参数，必须给理由起名，通过名字跳转
<router-link :to="{name:'pro',params:{c:1,a:2}}">
 <router-view></router-view>
 ``` 
created只走一次，那么ajax用watch来监控
路径参数发生变化，通过监控参数的变化来发送ajax
```
watch: {
    $route() {
        console.log('来个ajax)
    }
}
```
# 路由动画
beforeDestroy//会不会销毁
引入animate.css
mode="in-out"动画模式
给router-view加个定位就不会抖动了
keep-alive要缓存谁就把谁包起来

```
<router-link :to="{path:'/home'>首页</router-link>
<router-link :to="{path:'/list'>列表页</router-link>

<transition 
enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="in-out">
<keep-alive>//缓存
 <router-view></router-view>
</keep-alive>
</transition>
```
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
