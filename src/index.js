import './styles/main.css'
import qrcode from 'qrcode-generator'

var typeNumber = 4;
var errorCorrectionLevel = 'L';
var qr = qrcode(typeNumber, errorCorrectionLevel);
qr.addData('https://ubique.ch');
qr.make();
document.getElementById('qrcode').innerHTML = qr.createImgTag(8, 16);
