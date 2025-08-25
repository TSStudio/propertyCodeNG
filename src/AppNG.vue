<template>
    <div class="title">Batch Code Printer</div>

    <div class="property-grid">
        <el-form-item label="Rotation">
            <el-slider v-model="rotation" :min="0" :max="270" :step="90" />
        </el-form-item>
        <el-form-item label="Zoom">
            <el-slider
                v-model="zoom"
                :min="10"
                :max="200"
                :step="5"
                :format-tooltip="zoomFormat"
            />
        </el-form-item>
        <!--Open Image Files-->
        <input
            type="file"
            multiple
            accept=".tiff,.tif,.jpeg,.jpg,.png,.bmp"
            id="file_loader"
        />
        <!--<el-button @click="downloadPrintCommands()"
            >Download Print Commands</el-button
        >-->

        <el-button @click="serialPrint()" v-show="serialPort != null"
            >Print to Serial Port</el-button
        >
        <el-button @click="openSerial()" v-show="serialPort == null"
            >Open Serial Port</el-button
        >
    </div>
    <div id="container-main">
        <div
            v-for="(img, index) in processed_images"
            :key="index"
            class="preview-container"
        >
            <PreviewNG :image_r="img" />
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { Image } from "image-js";
import PreviewNG from "./components/previewNG.vue";
import { get_print_command } from "./image_proc.js";
const images = ref([]);
const processed_images = ref([]);
const zoom = ref(100);
const zoomFormat = (val) => {
    return val / 100;
};
const rotation = ref(0);
const serialPort = ref(null);
const processImage = async (imgSrc) => {
    let sh = await Image.load(imgSrc);
    sh = sh.rotate(90 + rotation.value);
    sh = sh.resize({ width: (sh.width * zoom.value) / 100 });
    sh = sh.grey();
    sh = sh.mask({ threshold: 0.6 });
    return sh.toDataURL();
};
const print_raw_serial_data = (data_p) => {
    let byte_array = [];
    for (let i = 0; i < data_p.length; i += 2) {
        let byte = parseInt(data_p.substr(i, 2), 16);
        byte_array.push(byte);
    }
    let _data = new Uint8Array(byte_array);
    if (serialPort.value) {
        let writer = serialPort.value.writable.getWriter();
        writer
            .write(_data)
            .then(() => {
                ElMessage.success("Data Sent to Serial Port");
            })
            .catch((error) => {
                ElMessage.error("Error Sending Data: " + error);
            })
            .finally(() => {
                writer.releaseLock();
            });
    } else {
        ElMessage.error("Serial Port Not Opened");
    }
};
const reProcessImages = async () => {
    processed_images.value = [];
    for (let i = 0; i < images.value.length; i++) {
        const img = images.value[i];
        const processedImg = await processImage(img);
        processed_images.value.push(processedImg);
    }
};
const serialPrint = () => {
    for (let i = 0; i < processed_images.value.length; i++) {
        const img = processed_images.value[i];
        let cmd = get_print_command(img);
        print_raw_serial_data(cmd);
    }
};
const openSerial = () => {
    if ("serial" in navigator) {
        ElMessage.success("Opening Serial Port...");
    } else {
        ElMessage.error("Serial API not supported in this browser.");
        return;
    }
    navigator.serial
        .requestPort()
        .then((port) => {
            serialPort.value = port;
            ElMessage.info("Opening Serial Port: " + serialPort.value);
            serialPort.value.open({ baudRate: 115200 });
        })
        .catch((error) => {
            ElMessage.error("Error Requesting Serial Port: " + error);
        });
};
onMounted(() => {
    const fileLoader = document.getElementById("file_loader");

    fileLoader.addEventListener("change", async (event) => {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            const result = await new Promise((resolve) => {
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
            images.value.push(result);
        }
        await reProcessImages();
    });
});
</script>
