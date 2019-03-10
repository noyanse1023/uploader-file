<template>
    <div>
        <input type="text" value="hello" v-focus>
        <input type="text" value="hello" v-mycss>
        
    </div>
</template>
<script>
export default {
    name: 'hello',
    data() {
        return {

        }
    },
    directives: {//自定义指令
        focus: {
            inserted: function(el) {
                el.focus()
            }
        },
        mycss: {
            inserted: function(el) {
                el.style.color = 'red'
            }
        }
    }
}
</script>
