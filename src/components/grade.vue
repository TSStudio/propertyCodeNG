<template>
    <div class="pc-outline">
        <div class="pc-box-w">
            <div class="big">Graded<br />10/10</div>
            {{ date }}
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            date: "",
        };
    },
    mounted() {
        this.date = new Date().toLocaleDateString();
    },
};
</script>
