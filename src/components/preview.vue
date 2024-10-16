<template>
    <div id="preview">
        <img :src="image_r" alt="Preview" id="preview-img" />
    </div>
</template>

<script>
import Image from "image-js";
export default {
    data() {
        return {
            image_r: "",
        };
    },
    props: {
        image: {
            type: String,
            required: true,
        },
        start_x: {
            type: Number,
            required: true,
        },
        start_y: {
            type: Number,
            required: true,
        },
    },
    methods: {
        tr_img() {
            Image.load(this.image)
                .then((img) => {
                    this.image_r = img
                        .rotate(270)
                        .grey()
                        .resize({ factor: 0.5 })
                        .toDataURL();
                })
                .catch((err) => {
                    console.error(err);
                });
            this.place_img();
        },
        place_img() {
            const img = document.getElementById("preview-img");
            img.style.position = "relative";
            img.style.left = `${this.start_y * 0.5}px`;
            img.style.top = `${this.start_x * 0.5}px`;
        },
    },
    mounted() {
        this.tr_img();
    },
    watch: {
        image() {
            this.tr_img();
        },
        start_x() {
            this.place_img();
        },
        start_y() {
            this.place_img();
        },
    },
};
</script>
