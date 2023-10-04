const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'public', 'uploads');

export default class ImageUtil{
    saveB64ToLocal(b64: string) {
        const filename = this.generateFileName();
        const base64Data = b64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
        fs.writeFile(path.join(dir, filename), base64Data, 'base64', function(err: any) {
            console.log(err);
        });

        return `${process.env.BASE_URL}/uploads/${filename}`;
    }

    generateFileName() {
        const date = new Date();
        const filename = `${date.getTime()}.jpeg`;
        return filename;
    }
}