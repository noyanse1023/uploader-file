<template>
    <div class="contact">
        1223e23
    </div>
</template>
<script>
export default {
    data() {
        return {
            list: []
        }
    },
    created() {
        this.$axios.get('/api/contact',res => {
            // console.log(res.data.data)
            // this.list = res.data
            // console.log(this.list)
        })
    }
}
</script>

