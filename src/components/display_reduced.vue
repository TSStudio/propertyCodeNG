<template>
    <div class="pc-outline">
        <div class="pc-box">
            <div class="pc-name">{{ data.name }}</div>
            <div><img class="pc-qr" :src="imgurl" /></div>
            <div class="pc-id">{{ data.id }}</div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {};
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
        imgurl: {
            type: String,
            required: true,
        },
    },
};
</script>
