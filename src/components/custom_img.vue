<template>
    <div class="pc-outline">
        <div class="pc-box-w">
            <img :src="imgurl" alt="custom image" class="pc-img" />
        </div>
    </div>
</template>
<script>
export default {
    props: {
        imgurl: {
            type: String,
            required: true,
        },
    },
};
</script>
