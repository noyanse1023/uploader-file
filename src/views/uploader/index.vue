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
import jpg from '@/utils/jpg.js'
import resize from '@/utils/resize.js'
import FileStreamer from '@/utils/fileStreamer.js'
import bufferConcat from '@/utils/arrayBufferConcat.js'
import SnappyJS from 'snappyjs'
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
                let res = []
                let concatRes = null
                this.parseFile(file, result => {
                    if (result === 'done') {
                        concatRes = bufferConcat(...res)          
                        this.showImage(concatRes)
                        // console.log(concatRes)
                    } else {
                         // 在这里压缩
                        res.push(result)
                    }
                })            
            },
            showImage(binaryImage) {
                const this_ = this
                let j = new jpg.JpegImage()
                const c = document.getElementById('canvas')
                const ctx = c.getContext('2d')
                
                j.onload = function() {
                    let d = ctx.getImageData(0,0,c.width,c.height);
                    j.copyToImageData(d);
                    // console.log('showImage', d)
                    ctx.putImageData(d, 0, 0);
                    let resized = new resize.Resize(c.width, c.height, 150, 150, true, true, false, function (buffer) {
                        const data = this_.updateCanvas(ctx, ctx.createImageData(150, 150), buffer);
                        ctx.putImageData(data, 0, 0);
                    });
                    resized.resize(d.data);
                };
                j.load(binaryImage);
            },
            updateCanvas(contextHandlePassed, imageBuffer, frameBuffer) {
				let data = imageBuffer.data;
				let length = data.length;
				for (let x = 0; x < length; ++x) {
					data[x] = frameBuffer[x] & 0xFF;
                }
                return imageBuffer
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