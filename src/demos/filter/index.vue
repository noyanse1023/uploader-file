<template>
    <div>
        {{ price | moneyChange }}
        <!-- |管道符号就可过滤 --><br>
        {{ info | contextData }}
    </div>
</template>
<script>
export default {
    data() {
        return {
            price: 20,
            info: 'I am text'
        }
    },
    filters: {
        moneyChange(val) {
            if(typeof val === "number") {//判断是不是数字
                return "$" + val
            }else{
                return val
            }
        },
        contextData(val) {
            return val + '-----来自黑人' + new Date()
        }
    }
}
</script>

