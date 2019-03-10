<template>
    <div>
        {{ msg }}
        <input type="text" v-model="a">
        <input type="text" v-model="name">{{ fullName }}
        
    </div>
</template>
<script>
// import qs from 'qs'
export default {
    data() {
        return {
           newsData: [],
           a: 'watch正在观察我',
           msg: 'msg',
           name: 'hello',
           firstName: '第一个',
           lastName: '最后一个',
        }
    },
    computed: {
        fullName() {
            return this.firstName + this.name + this.lastName
        }
    },
    watch: {
        //报错
        // name(newVal) {
        //     this.fullName = this.firstName + newVal + this.lastName
        // },
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
    created() {
    /*
        this.$axios.get('/sxtstu/news/juhenews.php',{
            params: {
                type: 'junshi',
                count: 30
            }
        })
        .then(res => {
            this.newsData = res.data
            console.log(res.data)
        })
        .catch(err => {
            console.log(error)
        })


        this.$axios.post('/sxtstu/blueberrypai/login.php',{
            user_id: 'iwen@qq.com',
            password: 'iwen123',
            vertification_code: 'crfvw'
        })
        .then(res => {
            this.newsData = res.data
            console.log(res.data)
        })
        .catch(err => {
            console.log(error)
        })
    */
        const url = this.HOST + '/movie/top250'
        this.$axios.post(url)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.log(error)
        })
    }
}
</script>

