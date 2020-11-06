
import qrcode from 'qrcode-generator'

const typeNumber = 10;
const errorCorrectionLevel = 'L';
const cellSize = 10;
const margin = 0;

const generateQrCode = (data) => {
    const qrEntry = qrcode(typeNumber, errorCorrectionLevel);
    qrEntry.addData(data);
    qrEntry.make();
    return qrEntry.createSvgTag(cellSize, margin);
}

export default generateQrCode;