<template>
    <div class="container-fluid">
        <nav class="navbar navbar-default">
                <div class="navbar-header">
                    <a class="navbar-brand" href="#">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-notebook"></use>
                        </svg>
                        <span>LIST控</span>
                    </a>
                </div>    
        </nav>
        <div class="row">
            <div class="col-md-6 col-md-offset-3 text-left">
                <div class="panel panel-warning">
                    <div class="panel-heading"> 
                      <h3>亲，你还有 {{ count }} 件事要完成</h3>
                      <input type="text" class="form-control" placeholder="写下你要做的事情" @keyup.13="insert" v-model="title">
                    </div>
                    
                    <div class="panel-body">
                        
                        <ul class="list-group" v-for="item in filterTodos" :key="item.title">
                            <li class="list-group-item" @dblclick="edit(item)">
                              <span :class="{cur: item.isSelected}" v-show="currentIndex != item">
                                <input type="checkbox" v-model="item.isSelected">
                                {{ item.title }}
                              </span>
                              <input class="form-control edit-input" type="text" v-model="item.title" v-show="currentIndex == item" @blur="cancel" @keyup.enter="cancel" v-focus="currentIndex==item">                             
                                <button class="pull-right btn-xs btn btn-danger" @click="del(item)">&ltimes;</button>                              
                            </li>
                        </ul>
                    </div>
                    <div class="panel-footer">
                      <ul class="nav nav-pills">
                        <!-- 如果hash等于all,说明当前点击的就是all -->
                        <li role="presentation" :class="{active: hash === 'all'}"><a href="#/all">全部任务</a></li>
                        <li role="presentation" :class="{active: hash === 'done'}"><a href="#/done">已完成</a></li>
                        <li role="presentation" :class="{active: hash === 'unfinish'}"><a href="#/undone">未完成</a></li>
                      </ul>
                    </div>
                </div>
            </div>
        </div>

        
    </div>
</template>
<script>
export default {
    data() {
        return {
            todolist: [
                {isSelected: true,title: '吃饭'},
                {isSelected: false,title: '睡觉'},
                {isSelected: false,title: '打豆豆'}                               
           ],
           title: '',
           currentIndex: '',
           hash: ''
        }
    },
    created() {
      //取出localStorage中的数据
      this.todolist = JSON.parse(localStorage.getItem('data')) || this.todolist
      //如果没存过，就是null ，就不能JSON.parse,所以如果没存，就走this.todolist
      //如果有数据就用存的，没有就用默认的


      //如果有hash就存起来，如果没有就用默认的
      this.hash = window.location.hash.slice(2) || 'all' //把hash存起来,去掉前面的#/
      window.addEventListener('hashchange', () => {
        //监控hash值变化，如果页面已经有hash了，重新刷新页面也要获取hash值
        // console.log(window.location)
        //把hash值得变化映射到数据内,当hash变化，重新操作数据
        this.hash = window.location.hash.slice(2)
      },false)

    },    
    computed: {
      count() {
        //需要带false的总和
        return this.todolist.filter(item => !item.isSelected).length;
      },
      filterTodos() {
        if(this.hash === 'all') return this.todolist
        if(this.hash === 'done') return this.todolist.filter(item => item.isSelected)
        if(this.hash === 'undone') return this.todolist.filter(item => !item.isSelected)
        return this.todolist
      }
    },
    watch: {//监控数组，保存到本地
    //watch默认只监控一层数据变化,深度监控
      // todolist() {
      //   alert('s')
      // }
      todolist: {//深度监控
        handler() {//默认写成函数，就相当于默认写了hander
        //setItem默认存字符串,会把后面的value转换ISON.stringify
        //getIntem JSON.parse
        //存进localStorage
          localStorage.setItem('data',JSON.stringify(this.todolist))
        },deep: true
      }
    },
    methods: {
      insert() {
        this.todolist.push({
          isSelected: false,
          title: this.title
        })
      },
      del(index) {
        // this.todolist.splice(index,1)
        this.todolist = this.todolist.filter(item => item !== index)
      },
      edit(index) {
        this.currentIndex = index;
        // console.log(this.currentIndex)
      },
      cancel() {
        //cur为空
        this.currentIndex = ''
      }
    },
    directives: {
      focus(el,bindings){ 
          //但currentIndex等于item时，即当点击当前li时，让内部的输入框获取焦点
          if(bindings.value) {
            el.focus()
          }     
      }
    }
}
</script>
<style>
    .container-fluid{
        padding: 0;
        margin: 0;
    }
    .icon {
       width: 1em; height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
       font-size: 2em;
    }
    .navbar-brand{
        height: auto;
    }
    .cur{
      text-decoration: line-through;
      color: rgb(143, 143, 138);
    }
    .edit-input{
      width: 60%;
    }
</style>

