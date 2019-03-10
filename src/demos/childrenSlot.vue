<template>
    <div class="child">
        <slot name="slot1">
            <p>{{ msg }}</p>
        </slot>
        <slot name="slot2"></slot>
        <!-- 作用域slot,数据是子传父,父组件用slot-scope接受 -->
        <slot name="slot3" text="我是子组件数据"></slot>
    </div>
</template>
<script>
export default {
    data() {
        return {
            msg: '如果没有父组件没有传递数据，就显示我'
        }
    }
}
</script>
<style lang="scss" scoped>
.child{
    p{
        color: #aaa;
    }
}

</style>
