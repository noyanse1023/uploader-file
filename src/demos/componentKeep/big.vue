<template>
    <div class="big">
    big
    <!-- {{ currentView }} -->
     <keep-alive>
        <component :is="currentView"></component>  
     </keep-alive>
    
    <!-- 视图切换 -->
    <button @click="changeView">切换组件</button>
    <!-- <small1></small1>
    <small2></small2> -->
    </div>
</template>
<script>
import small1 from './small1'
import small2 from './small2'

export default {
    name: 'big',
    data() {
        return {
            currentView: 'small1',
            flag: true
        }
    },
    components: {
        small1,
        small2
    },
    methods: {
        changeView() {
            if(this.flag) {
                this.currentView = 'small1'
                this.flag = false
            }else{
                this.currentView = 'small2'
                this.flag = true
            }
            
        }
    }
}
</script>
