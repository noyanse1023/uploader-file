<template>
    <div class="vue-uploader">
        <div class="file-list">
            <section v-for="(file, index) of files" class="file-item draggable-item">
                <!-- <img :src="file.src" alt="" ondragstart="return false;"> -->
                <p class="file-name">{{file.name}}</p>
            </section>
            <canvas id="canvas" width="300" height="300"></canvas>

        </div>

        <input type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
    </div>
</template>
<script>
// let jpg = require('@/utils/jpg.js')
// console.log(jpg)
import jpg from '@/utils/jpg.js'
import resize from '@/utils/resize.js'
import FileStreamer from '@/utils/fileStreamer.js'
    export default {
        data() {
            return {
                status: 'ready',
                files: [],
                point: {},
                uploading: false,
                percent: 0
            }
        },
        methods: {
            fileChanged() {
                const list = this.$refs.file.files
                for (let i = 0; i < list.length; i++) {
                    const item = {
                        name: list[i].name,
                        size: list[i].size,
                        file: list[i]
                    }
                    this.html5Reader(list[i], item)
                    this.files.push(item)
                }
                this.$refs.file.value = ''
            },
            // 将图片文件转成BASE64格式
            html5Reader(file, item){
                // const fileStreamer = new FileStreamer(file)
                // while (!fileStreamer.isEndOfFile()) {
                //     const data = fileStreamer.readAsArrayBuffer();
                //     // this.showImage(data)
                //     console.log(data);
                // }
                // console.log('chunks', chunks)
                function concatenate(resultConstructor, ...arrays) {
                    let totalLength = 0;
                    for (let arr of arrays) {
                        totalLength += arr.length;
                    }
                    let result = new resultConstructor(totalLength);
                    let offset = 0;
                    for (let arr of arrays) {
                        result.set(arr, offset);
                        offset += arr.length;
                    }
                    return result;
                }

                let res = []
                let int8View = []
                let int16Array = []
                let int32Array = []
                let uint8Array = []
                this.parseFile(file, result => {
                    // console.log(result)
                    res.push(result)
                    // console.log(res)
                    window.res = res
                    // for(let i=0;i<res.length;i++) {
                    //     if(res[i] !== 'done') {
                    //         // let dataView = new DataView(res[i])
                    //         int8View.push(new Int8Array(res[i]))
                    //         int16Array.push(new Int16Array(res[i]))
                    //         int32Array.push(new Int32Array(res[i]))
                    //         uint8Array.push(new Uint8Array(res[i]))
                    //     }
                    // }
                    // console.log(int8View)
                    // console.log(int16Array)

                    // console.log(int32Array)
                    // console.log(uint8Array)

                    // while (result !== 'done') {
                        
                        // this.showImage(result)                     
                    // }
                })
                // const reader = new FileReader()
                // reader.onload = (e) => {
                //     this.showImage(e.target.result) 
                //     // console.log('one-peiece', e.target.result) 
                //     // console.log(e.target.result)
                //     // const c = document.getElementById('canvas')
                //     // // const ctx = c.getContext('2d')
                //     // const ctx = c.getContext('2d')
                //     // let img = new Image();
                //     // img.onload = function(){
                //     //     // alert('加载完毕')
                        
                //     //     // 将图片画到canvas上面上去！
                //     //     ctx.drawImage(img,100,100);
        
        
                //     // }
                //     // img.src = e.target.result
                //     // this.$set(item, 'src', e.target.result)
                // }
                // // reader.readAsDataURL(file)
                // reader.readAsArrayBuffer(file)       
            },

            showImage(binaryImage) {
                // console.log('array-buffer', binaryImage)
                let array = new Uint8ClampedArray(binaryImage)
                // console.log('array-uint', array)
                const this_ = this
                let j = new jpg.JpegImage()
                const c = document.getElementById('canvas')
                const ctx = c.getContext('2d')
                
                j.onload = function() {
                    c.width = j.width;
                    c.height = j.height;
                    let d = ctx.getImageData(0,0,j.width,j.height);
                    j.copyToImageData(d);
                    let resized0 = new resize.Resize(j.width, j.height, 150, 150, true, true, false, function (buffer) {
                        const data = this_.updateCanvas(ctx, ctx.createImageData(150, 150), buffer);
                        ctx.putImageData(data, 0, 0);
                    });
                    // console.log(d.data)
                    resized0.resize(d.data);
                };
                j.load(binaryImage);
            },
            updateCanvas(contextHandlePassed, imageBuffer, frameBuffer) {
				let data = imageBuffer.data;
				let length = data.length;
				for (let x = 0; x < length; ++x) {
					data[x] = frameBuffer[x] & 0xFF;
                }
                // console.log('updateCanvas', imageBuffer)
                return imageBuffer
				// contextHandlePassed.putImageData(imageBuffer, 0, 0);
			},
            parseFile(file, callback) {
                let fileSize = file.size
                let chunkSize = 64 * 1024 // bytes
                let offset = 0
                let self = this // we need a reference to the current object
                let chunkReaderBlock = null

                let readEventHandler = (evt) => {
                    if (evt.target.error == null) {
                        offset += evt.target.result.byteLength
                        callback(evt.target.result) // callback for handling read chunk
                    } else {
                        console.log("Read error: " + evt.target.error)
                        return
                    }
                    if (offset >= fileSize) {
                        callback('done')
                        console.log("Done reading file")
                        return
                    }

                    // of to the next chunk
                    chunkReaderBlock(offset, chunkSize, file);
                }

                chunkReaderBlock = (_offset, length, _file) => {
                    let r = new FileReader()
                    let blob = _file.slice(_offset, length + _offset)
                    r.onload = readEventHandler
                    r.readAsArrayBuffer(blob)
                }

                // now let's start the read with the first block
                chunkReaderBlock(offset, chunkSize, file);
            }
        }
    }
</script>
<style>
img {
    width: 200px;
    height: 200px;
}
</style>