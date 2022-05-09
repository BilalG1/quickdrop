<template>
    <div class="receive-wrapper">
        <div class="header">
            {{displayNumPhotos()}}
            <button class="clear-btn" @click="clearAll" v-if="imgDataArray.length">
                Clear
            </button>
            <button class="clear-btn" @click="makePDF" v-if="imgDataArray.length">
                Make PDF
            </button>
        </div>
        <TransitionGroup name="img-list">
            <div v-for="(imgData, index) of imgDataArray" class="img-data-wrap" :key="imgData.substring(100,150)">
                <div>
                    <img :src="imgData" :ref="imgData.substring(100,150)"/>
                </div>
                <div>
                    <a download="image.png" :href="imgData" class="img-btn">
                        Download
                    </a>
                    <button class="img-btn" @click="() => removeImg(index)">
                        Remove
                    </button>
                    <button class="img-btn" :class="{'is-copied': (copyKey === imgData.substring(100,150))}" @click="() => copyImgToClipboard(index)">
                        {{(copyKey === imgData.substring(100,150)) ? 'Copied!' : 'Copy'}}
                    </button>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script>
import jsPDF from "jspdf";
const A4_PAPER = {
  width: 210,
  height: 297,
}

export default {
    data() {
        return {
            imgDataArray: [],
            copyKey: '',
        }
    },
    methods: {
        displayNumPhotos() {
            if (this.imgDataArray.length === 0)
                return 'Waiting for photo...'
            if (this.imgDataArray.length === 1)
                return '1 Photo'
            else
                return this.imgDataArray.length + ' Photos'
        },
        clearAll() {
            this.imgDataArray = []
        },
        removeImg(ind) {
            this.imgDataArray.splice(ind,1)
        },
        handleReceiveImage(imgDataSrc) {
            this.imgDataArray.push(imgDataSrc)
        },
        copyImgToClipboard(index) {
            this.copyKey = this.imgDataArray[index].substring(100,150)
            fetch(this.imgDataArray[index])
            .then(res => res.blob())
            .then(blob => {
                navigator.clipboard.write([
                    new window.ClipboardItem({
                        'image/png': blob
                    })
                ]);
            })
        },
        imageDimsOnA4(width, height) {
            if ((width / height) > (A4_PAPER.width / A4_PAPER.height))
                return [A4_PAPER.width, (height / width) * A4_PAPER.width]
            else
                return [(width / height) * A4_PAPER.height, A4_PAPER.height]
        },
        makePDF() {
            const doc = new jsPDF()
            doc.deletePage(1);
            console.log(A4_PAPER)

            this.imgDataArray.forEach((img) => {
                const type = img.substring(img.indexOf('/')+1, img.indexOf(';'))
                const imgW = this.$refs[img.substring(100,150)][0].width
                const imgH = this.$refs[img.substring(100,150)][0].height
                const [imgWidthScaled, imgHeightScaled] = this.imageDimsOnA4(imgW, imgH)

                doc.addPage()
                doc.addImage(
                    img,
                    type,
                    (A4_PAPER.width - imgWidthScaled) / 2,
                    (A4_PAPER.height - imgHeightScaled) / 2,
                    imgWidthScaled,
                    imgHeightScaled
                )    
            })
            const pdfURL = doc.output("bloburl");
            window.open(pdfURL)
            // window.open(pdfURL as any, "_blank");
        }
    }
}
</script>

<style scoped>
.receive-wrapper{
    margin-top: 20px;
}
.header{
    font-size: 24px;
    font-weight: 600;
    margin-top: 40px;
}
.img-data-wrap{
    margin-top: 20px;
}
.clear-btn{
    margin-left: 20px;
}
.img-btn{
  color: black;
  border-radius: 8px;
  border: 1px solid black;
  background: white;
  padding: 5px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: .25s all;
  text-decoration: none;
  font-size: 15px;
}
.img-btn:hover{
  background: lightgray;
}

.img-list-move,
.img-list-enter-active,
.img-list-leave-active {
    transition: .5s all;
}

.img-list-enter-from,
.img-list-leave-to {
    opacity: 0;
    transform: scale(0,0);
}

.img-list-leave-active{
    position: absolute;
    width: 100%;
}

.is-copied{
    padding: 5px 10px;
    background: orange;
    color: white;
}
.is-copied:hover{
    background: orange;
}
</style>