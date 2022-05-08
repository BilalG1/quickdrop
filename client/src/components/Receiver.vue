<template>
    <div class="receive-wrapper">
        <div class="header">
            {{displayNumPhotos()}}
        </div>

        <div v-for="imgData of imgDataArray" class="img-data-wrap" :key="imgData.substring(100,150)">
            <div>
                <img :src="imgData" />
            </div>
            <div v-if="imgData">
                <a download="image.png" :href="imgData">
                    Download
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['imgDataArray'],
    methods: {
        displayNumPhotos(){
            if (this.imgDataArray.length === 0)
                return 'Waiting for photo...'
            if (this.imgDataArray.length === 1)
                return '1 Photo'
            else
                return this.imgDataArray.length + ' Photos'
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
</style>