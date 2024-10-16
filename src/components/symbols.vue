<template>
    <div>
        <div v-if="data.warnings.includes('other')" class="pc-ha W001"></div>
        <div
            v-if="data.warnings.includes('explosion')"
            class="pc-ha W002"
        ></div>
        <div
            v-if="data.warnings.includes('non-ionizing')"
            class="pc-ha W005"
        ></div>
        <div
            v-if="data.warnings.includes('radiation')"
            class="pc-ha W003"
        ></div>
        <div v-if="data.warnings.includes('magnetic')" class="pc-ha W006"></div>
        <div v-if="data.warnings.includes('laser')" class="pc-ha W004"></div>
        <div
            v-if="data.warnings.includes('biological')"
            class="pc-ha W009"
        ></div>
        <div v-if="data.warnings.includes('e-shock')" class="pc-ha W012"></div>
        <div v-if="data.warnings.includes('toxic')" class="pc-ha W016"></div>
        <div v-if="data.warnings.includes('h-temp-s')" class="pc-ha W017"></div>
        <div v-if="data.warnings.includes('sharp')" class="pc-ha W022"></div>
        <div v-if="data.warnings.includes('h-temp-c')" class="pc-ha W079"></div>
        <div v-if="data.warnings.includes('tr-W901')" class="pc-ha W901"></div>
        <div v-if="data.warnings.includes('tr-W902')" class="pc-ha W902"></div>
        <div v-if="data.warnings.includes('tr-W903')" class="pc-ha W903"></div>
        <div v-if="data.warnings.includes('tr-W904')" class="pc-ha W904"></div>
        <div v-if="data.warnings.includes('tr-W905')" class="pc-ha W905"></div>
        <div v-if="data.warnings.includes('tr-W906')" class="pc-ha W906"></div>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
};
</script>
