<template>
    <div class="main">
        <child>
            <!-- <p slot="slot1"></p> -->
            <p slot="slot2">我是父组件仍在子组件的第二个内容</p>
            <p slot="slot3" slot-scope="props">
                {{ props.text }}
            </p>
        </child>      
    </div>
</template>
<script>
import child from './childrenSlot'
export default {
    components: {
        child
    }
}
</script>
