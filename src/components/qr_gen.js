import QRCode from "qrcode";
export default {
    generate(id) {
        return new Promise((resolve, reject) => {
            QRCode.toString("https://a.cl15.top/" + id, {
                margin: 0,
                width: 600,
                type: "svg",
            }).then((str) => {
                let url = "data:image/svg+xml;base64," + btoa(str);
                resolve(url);
            });
        });
        // return QRCode.toDataURL("https://a.cl15.top/" + id, {
        //     margin: 0,
        //     width: 600,
        // });
    },
};
