const dechex = (dec) => {
    return dec.toString(16);
};
import { Image } from "image-js";
export const get_print_command = async (image_uri, printcount = 1) => {
    let sh = await Image.load(image_uri);
    sh = sh.grey();
    sh = sh.mask({ threshold: 0.6 });

    let wh = "";
    let width_L = sh.width & 0xff;
    let width_L_H = width_L >> 4;
    let width_L_L = width_L & 0x0f;
    let width_H = (sh.width >> 8) & 0xff;
    let width_H_H = width_H >> 4;
    let width_H_L = width_H & 0x0f;
    wh += dechex(width_L_H);
    wh += dechex(width_L_L);
    wh += dechex(width_H_H);
    wh += dechex(width_H_L);
    let height_L = sh.height & 0xff;
    let height_L_H = height_L >> 4;
    let height_L_L = height_L & 0x0f;
    let height_H = (sh.height >> 8) & 0xff;
    let height_H_H = height_H >> 4;
    let height_H_L = height_H & 0x0f;
    wh += dechex(height_L_H);
    wh += dechex(height_L_L);
    wh += dechex(height_H_H);
    wh += dechex(height_H_L);

    let result = "1b401b370950301a5b01";

    let xywh_p = "00000000" + wh;
    result += xywh_p;
    result += "00"; //rotate 0
    result += "1a2100";
    let xywh_i = "00000000" + wh;
    result += xywh_i;

    for (let i = 0; i < sh.data.length; i++) {
        let highbits = (sh.data[i] >> 4) ^ 0x0f;
        result += dechex(highbits);
        let lowbits = (sh.data[i] & 0x0f) ^ 0x0f;
        result += dechex(lowbits);
    }
    result += "1a5d001a4f";
    if (printcount == 1) {
        result += "00";
    } else {
        result += "01";
        let pc_L = printcount & 0x0f;
        let pc_H = (printcount >> 4) & 0x0f;
        result += dechex(pc_H);
        result += dechex(pc_L);
    }
    result += "1b40";
    return result;
};
