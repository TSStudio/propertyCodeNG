<template>
    <div id="preview">
        <img
            :srcset="image"
            class="previewImage"
            :width="width"
            alt="Preview"
        />
    </div>
</template>
<script setup>
import { defineProps, ref, watch, onMounted } from "vue";
import { Image } from "image-js";
const props = defineProps({
    image_r: {
        type: String,
        required: true,
    },
});
const image = ref("");
const width = ref(0);
watch(
    () => props.image_r,
    (newVal) => {
        refreshImage();
    }
);
const refreshImage = async () => {
    let sh = await Image.load(props.image_r);
    sh = sh.rotate(270);
    image.value = sh.toDataURL();
    width.value = sh.width / 2;
};

onMounted(() => {
    refreshImage();
});
</script>
