import { ElMessage } from "element-plus";
import Image from "image-js";

export default {
    dechex(dec) {
        return dec.toString(16);
    },
    async proc1(img_base64_datauri, print_scale = 1.0, print_orientation = 0) {
        //rotate 90 degrees, and set width to 360 px
        //check if set width to 360px, is height > 640
        let sh = await Image.load(img_base64_datauri);
        sh = sh.rotate(90 + print_orientation);
        console.log(sh.width, sh.height);
        let r_height = sh.height * (360 / sh.width) * print_scale;
        let r_width = 360 * print_scale;
        console.log(r_width, r_height);
        let recommend_x = (360 - r_width) / 2;
        let recommend_y = (640 - r_height) / 2;
        if (r_height > 640) {
            r_height = 640 * print_scale;
            r_width = sh.width * (640 / sh.height) * print_scale;
            recommend_x = (360 - r_width) / 2;
            recommend_y = 0;
        }
        if (sh.height * (360 / sh.width) > 640) {
            sh = sh.resize({ height: 640 * print_scale });
        } else {
            sh = sh.resize({ width: 360 * print_scale });
        }
        sh = sh.grey();
        return {
            data: sh.toDataURL(),
            attributes: {
                width_px: r_width,
                height_px: r_height,
                recommend_x: recommend_x,
                recommend_y: recommend_y,
            },
        };
    },
    async proc2(datauri_after_proc1, start_x = 0, start_y = 0) {
        let sh = await Image.load(datauri_after_proc1);
        start_x = Math.round(start_x);
        start_y = Math.round(start_y);
        if (start_x < 0) {
            start_x = 0;
        }
        if (start_y < 0) {
            start_y = 0;
        }
        sh = sh.mask({ threshold: 0.6 });
        let result = "1b401b370950301a5b01";
        let xywh_p = "0000000080015802"; //width :360 ->  height: 640
        let xywh_i = "";
        let x_L = start_x & 0xff;
        let x_L_H = x_L >> 4;
        let x_L_L = x_L & 0x0f;
        let x_H = (start_x >> 8) & 0xff;
        let x_H_H = x_H >> 4;
        let x_H_L = x_H & 0x0f;
        xywh_i += this.dechex(x_L_H);
        xywh_i += this.dechex(x_L_L);
        xywh_i += this.dechex(x_H_H);
        xywh_i += this.dechex(x_H_L);
        let y_L = start_y & 0xff;
        let y_L_H = y_L >> 4;
        let y_L_L = y_L & 0x0f;
        let y_H = (start_y >> 8) & 0xff;
        let y_H_H = y_H >> 4;
        let y_H_L = y_H & 0x0f;
        xywh_i += this.dechex(y_L_H);
        xywh_i += this.dechex(y_L_L);
        xywh_i += this.dechex(y_H_H);
        xywh_i += this.dechex(y_H_L);
        let width_L = sh.width & 0xff;
        let width_L_H = width_L >> 4;
        let width_L_L = width_L & 0x0f;
        let width_H = (sh.width >> 8) & 0xff;
        let width_H_H = width_H >> 4;
        let width_H_L = width_H & 0x0f;
        xywh_i += this.dechex(width_L_H);
        xywh_i += this.dechex(width_L_L);
        xywh_i += this.dechex(width_H_H);
        xywh_i += this.dechex(width_H_L);
        let height_L = sh.height & 0xff;
        let height_L_H = height_L >> 4;
        let height_L_L = height_L & 0x0f;
        let height_H = (sh.height >> 8) & 0xff;
        let height_H_H = height_H >> 4;
        let height_H_L = height_H & 0x0f;
        xywh_i += this.dechex(height_L_H);
        xywh_i += this.dechex(height_L_L);
        xywh_i += this.dechex(height_H_H);
        xywh_i += this.dechex(height_H_L);
        result += xywh_p;
        result += "00";
        result += "1a2100";
        result += xywh_i;
        for (let i = 0; i < sh.data.length; i++) {
            let highbits = (sh.data[i] >> 4) ^ 0x0f;
            result += this.dechex(highbits);
            let lowbits = (sh.data[i] & 0x0f) ^ 0x0f;
            result += this.dechex(lowbits);
        }
        result += "1a5d001a4f001b40";
        return result;
    },
    async proc(img_base64_datauri) {
        this.proc1(img_base64_datauri).then((datauri_after_proc1) => {
            this.proc2(datauri_after_proc1.data).then((data) => {
                return data;
            });
        });
    },
    // send_to_printer(data, label) {
    //     if (label == "") {
    //         label = "unnamed";
    //     }
    //     let description = "propertycode of " + label;
    //     fetch("https://www.tmysam.top/print/apis/post_print_task.php", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded",
    //         },
    //         body: "data=" + data + "&printer_id=1&description=" + description,
    //         credentials: "include",
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data.status != "success") {
    //                 ElMessage.error("Failed to print: " + data.message);
    //             } else {
    //                 ElMessage.success("Sent to task list.");
    //             }
    //         })
    //         .catch((error) => {
    //             ElMessage.error("Failed to print: " + error);
    //         });
    // },
    send_to_printer(data, label) {
        // not send to printer, just generate a file
        if (label == "") {
            label = "unnamed";
        }
        let fname = "pc_" + label + ".scmd"; //serial command
        // for each two characters, treat as a byte, generate a file
        let byte_array = [];
        for (let i = 0; i < data.length; i += 2) {
            let byte = parseInt(data.substr(i, 2), 16);
            byte_array.push(byte);
        }
        let blob = new Blob([new Uint8Array(byte_array)], {
            type: "application/octet-stream",
        });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = fname;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        ElMessage.success("Generated file: " + fname);
    },
};
