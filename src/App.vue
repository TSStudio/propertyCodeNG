<template>
    <div class="input">
        <el-form :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item label="Item name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="Category">
                <el-select
                    v-model="form.category"
                    placeholder="Category Unspecified"
                >
                    <el-option label="Unspecified" value="unspecified" />
                    <el-option label="Chemical" value="chemical" />
                    <el-option label="Electronic" value="electronic" />
                    <el-option label="Mechanical" value="mechanical" />
                    <el-option label="Document" value="document" />
                    <el-option label="Other" value="other" />
                </el-select>
            </el-form-item>
            <el-form-item label="Warnings">
                <el-checkbox-group v-model="form.warnings">
                    <el-checkbox value="e-shock" name="warnings">
                        Electric Shock
                    </el-checkbox>
                    <el-checkbox value="h-temp-s" name="warnings">
                        High Temperature Surface
                    </el-checkbox>
                    <el-checkbox value="h-temp-c" name="warnings">
                        High Temperature Content
                    </el-checkbox>
                    <el-checkbox value="explosion" name="warnings">
                        Explosion
                    </el-checkbox>
                    <el-checkbox value="toxic" name="warnings">
                        Toxic
                    </el-checkbox>
                    <el-checkbox value="non-ionizing" name="warnings">
                        Non-Ionizing Radiation
                    </el-checkbox>
                    <el-checkbox value="radiation" name="warnings">
                        Radiation
                    </el-checkbox>
                    <el-checkbox value="laser" name="warnings">
                        Laser
                    </el-checkbox>
                    <el-checkbox value="magnetic" name="warnings">
                        Magnetic Field
                    </el-checkbox>
                    <el-checkbox value="biological" name="warnings">
                        Biological Hazard
                    </el-checkbox>
                    <el-checkbox value="sharp" name="warnings">
                        Sharp Implement
                    </el-checkbox>
                    <el-checkbox value="other" name="warnings">
                        Other Warning
                    </el-checkbox>
                    <el-checkbox value="tr-W901" name="warnings">
                        This Way Up
                    </el-checkbox>
                    <el-checkbox value="tr-W902" name="warnings">
                        Keep Dry
                    </el-checkbox>
                    <el-checkbox value="tr-W903" name="warnings">
                        Handle with Care
                    </el-checkbox>
                    <el-checkbox value="tr-W904" name="warnings">
                        Fragile
                    </el-checkbox>
                    <el-checkbox value="tr-W905" name="warnings">
                        Do Not Open with Knife
                    </el-checkbox>
                    <el-checkbox value="tr-W906" name="warnings">
                        Do Not Drop
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="Notes to Display">
                <el-input v-model="form.note_d" type="textarea" />
            </el-form-item>
            <el-form-item label="ID">
                <el-input v-model="form.id" />
            </el-form-item>
            <!-- <el-form-item label="Notes NOT to Display (TODO)">
                <el-input v-model="form.note_notd" type="textarea" />
            </el-form-item> -->
            <el-form-item>
                <el-button
                    type="primary"
                    @click="onSubmit"
                    :loading="requesting"
                    >Request New ID</el-button
                >
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item label="JSON">
                <el-input
                    v-model="json"
                    type="textarea"
                    :rows="1"
                    placeholder="JSON"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updateFromJSONString(json)"
                    >Update from JSON</el-button
                >
            </el-form-item>
        </el-form>
        <el-form>
            <el-form-item label="BW Mode">
                <el-switch v-model="bw" active-text="On" inactive-text="Off" />
            </el-form-item>
            <el-form-item label="SVG Mode">
                <el-switch
                    v-model="svg"
                    active-text="SVG"
                    inactive-text="PNG"
                />
            </el-form-item>
            <el-form-item label="Scale" v-show="!svg">
                <el-slider v-model="scale" :min="1" :max="10" />
            </el-form-item>
            <el-form-item label="Print Size">
                <el-slider
                    v-model="print_size"
                    :min="10"
                    :max="100"
                    :format-tooltip="formatter"
                    @change="d_pr_c(false)"
                />
            </el-form-item>
            <el-form-item label="Rotation">
                <el-slider
                    v-model="rotation"
                    :min="0"
                    :max="270"
                    :step="90"
                    @change="d_pr_c(false)"
                />
            </el-form-item>
            <el-form-item label="Border">
                <el-switch
                    v-model="border"
                    active-text="On"
                    inactive-text="Off"
                />
            </el-form-item>
        </el-form>
    </div>
    <div ref="output" class="output">
        {{ form }}<br />
        <el-button type="primary" @click="copy()">Copy</el-button>
        <el-button type="primary" @click="d_pr_c()">Print</el-button>
        <el-button type="primary" @click="download_element()"
            >Download</el-button
        >
        <br />
        <display_horizonal
            :data="form"
            :imgurl="imgurl"
            id="d1"
            @click="selected = 'd1'"
        ></display_horizonal
        ><span v-if="selected == 'd1'">[SELECTED]</span><br />
        <display :data="form" :imgurl="imgurl" id="d2" @click="selected = 'd2'">
        </display
        ><span v-if="selected == 'd2'">[SELECTED]</span><br />
        <display_reduced
            :data="form"
            :imgurl="imgurl"
            id="d3"
            @click="selected = 'd3'"
        ></display_reduced
        ><span v-if="selected == 'd3'">[SELECTED]</span><br />
        <input type="file" id="cus_im_upload" @change="upload" />
        <custom_img
            :imgurl="cus_img"
            v-if="cus_img"
            id="d4"
            @click="selected = 'd4'"
        ></custom_img
        ><span v-if="selected == 'd4'">[SELECTED]</span><br />
        <preview
            :image="prevImg"
            :start_x="im_attri.recommend_x"
            :start_y="im_attri.recommend_y"
        ></preview>
        {{ Math.round(im_attri.width_px) }}*{{ Math.round(im_attri.height_px)
        }}<br />
        Approx. {{ Math.round(im_attri.width_px / 8) }}mm*{{
            Math.round(im_attri.height_px / 8)
        }}mm
    </div>
</template>

<script>
import display_horizonal from "./components/display_horizonal.vue";
import display from "./components/display.vue";
import display_reduced from "./components/display_reduced.vue";
import qr_gen from "./components/qr_gen.js";
import domtoimage from "dom-to-image-more";
import image from "./components/image.js";
import preview from "./components/preview.vue";
import custom_img from "./components/custom_img.vue";

export default {
    data() {
        return {
            bw: false,
            form: {
                name: "",
                category: "unspecified",
                warnings: [],
                note_d: "",
                note_notd: "",
                id: "AAAAA",
            },
            im_attri: {
                width_px: 0,
                height_px: 0,
                recommend_x: 0,
                recommend_y: 0,
            },
            svg: false,
            json: "",
            prevId: "AAAAA",
            imgurl: "",
            requesting: false,
            border: true,
            scale: 3,
            print_size: 100,
            rotation: 0,
            selected: "d1",
            prevImg: "",
            cus_img: "",
        };
    },
    methods: {
        formatter(val) {
            return val.toString() + "%";
        },
        upload() {
            let file = document.getElementById("cus_im_upload").files[0];
            let reader = new FileReader();
            reader.onload = (e) => {
                this.cus_img = e.target.result;
                if (this.selected == "d4") {
                    this.d_pr_c(false);
                }
            };
            reader.readAsDataURL(file);
        },
        download_element() {
            let eleId = this.selected;
            let scale = this.scale;
            let ele = document.getElementById(eleId);
            const options = {
                width: ele.clientWidth * scale,
                height: ele.clientHeight * scale,
                style: {
                    transform: "scale(" + scale + ")",
                    transformOrigin: "top left",
                },
            };
            let filename =
                new Date()
                    .toISOString()
                    .replace(/:/g, "-")
                    .replace("T", "_")
                    .replace("Z", "") + (this.form.name ? this.form.name : "");
            if (this.svg) {
                domtoimage.toSvg(ele).then((svgString) => {
                    this.download(svgString, filename + ".svg");
                });
            } else {
                domtoimage.toPng(ele, options).then((dataUrl) => {
                    this.download(dataUrl, filename + ".png");
                });
            }
        },
        d_pr_c(print = true) {
            let id = this.selected;
            let scale = this.scale;
            let ele = document.getElementById(id);
            const options = {
                width: ele.clientWidth * scale,
                height: ele.clientHeight * scale,
                style: {
                    transform: "scale(" + scale + ")",
                    transformOrigin: "top left",
                },
            };
            domtoimage.toPng(ele, options).then((dataUrl) => {
                image
                    .proc1(dataUrl, this.print_size / 100, this.rotation)
                    .then((data1) => {
                        this.im_attri = data1.attributes;
                        this.prevImg = data1.data;
                        if (print)
                            image
                                .proc2(
                                    data1.data,
                                    im_attri.recommend_x,
                                    im_attri.recommend_y
                                )
                                .then((ops) => {
                                    image.send_to_printer(ops, this.form.name);
                                });
                    });
            });
        },
        switchBW(bw = false) {
            //set filter: grayscale(1) contrast(2); for output
            let output = this.$refs.output;
            if (bw) {
                output.style.filter = "grayscale(1) contrast(2)";
            } else {
                output.style.filter = "";
            }
        },
        switchBorder(border = true) {
            let outlines = document.getElementsByClassName("pc-outline");
            for (let i = 0; i < outlines.length; i++) {
                if (border) {
                    outlines[i].style.padding = "10px";
                } else {
                    outlines[i].style.padding = "0";
                }
            }
        },
        getNewCodeRemote() {
            this.requesting = true;
            let url =
                "https://www.tmysam.top/propertyCode/generateCodeAPI.php?asure";
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        ElMessage.error("Error");
                    } else {
                        this.form.id = data.code;
                        ElMessage.success("New Code Generated");
                    }
                })
                .finally(() => {
                    this.requesting = false;
                });
        },
        onSubmit() {
            this.getNewCodeRemote();
        },
        updateFromJSONString(json) {
            let data = {};
            try {
                data = JSON.parse(json);
            } catch (e) {
                ElMessage.error("Invalid JSON");
                return;
            }

            this.form = {};
            this.form.name = data.name ? data.name : "";
            this.form.category = data.category ? data.category : "unspecified";
            this.form.warnings = data.warnings ? data.warnings : [];
            this.form.note_d = data.note_d ? data.note_d : "";
            this.form.note_notd = data.note_notd ? data.note_notd : "";
            this.form.id = data.id ? data.id : "AAAAA";
        },
        copy() {
            try {
                navigator.clipboard.writeText(JSON.stringify(this.form)).then(
                    function () {
                        ElMessage.success("Copied");
                    },
                    function () {
                        throw new Error("Internal Error");
                    }
                );
            } catch (error) {
                ElMessage.error("Copy Failed: " + error);
            }
        },
        download(str, filename = "result") {
            // const blob = new Blob([str], { type: "text/plain" });
            // const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = str;
            a.download = filename;
            a.click();
            //URL.revokeObjectURL(url);
        },
    },
    components: {
        display,
        display_reduced,
        display_horizonal,
        preview,
        custom_img,
    },
    watch: {
        bw: function (val) {
            this.switchBW(val);
            this.d_pr_c(false);
        },
        border: function (val) {
            this.switchBorder(val);
            this.d_pr_c(false);
        },
        form: {
            deep: true,
            handler: function () {
                //sort warnings
                this.form.warnings.sort();
                if (this.form.id != this.prevId) {
                    this.prevId = this.form.id;
                    qr_gen.generate(this.form.id).then((url) => {
                        this.imgurl = url;
                    });
                }
            },
        },
        selected: function (val) {
            this.d_pr_c(false);
        },
    },
    mounted() {
        qr_gen.generate(this.form.id).then((url) => {
            this.imgurl = url;
        });
        this.d_pr_c(false);
    },
};
</script>
