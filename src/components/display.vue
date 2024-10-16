<template>
    <div class="pc-outline">
        <div class="pc-box">
            <div class="pc-title">TPropCode</div>
            <div class="pc-name">{{ data.name }}</div>
            <div class="pc-category">
                {{ data.category }}
            </div>
            <div><img class="pc-qr" :src="imgurl" /></div>
            <div class="pc-id">{{ data.id }}</div>
            <symbols :data="data" />
            <div class="pc-note">{{ data.note_d }}</div>
        </div>
    </div>
</template>
<script>
import symbols from "./symbols.vue";
export default {
    data() {
        return {};
    },
    components: {
        symbols,
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
