import './styles/main.scss'
import qrcode from 'qrcode-generator'
import _sodium from 'libsodium-wrappers'

let sodiumLoaded = false;
let sodium;
(async () => {
    await _sodium.ready;
    sodiumLoaded = true;
    sodium = _sodium;
})();

const qrTypeNumber = 8;
const qrErrorCorrectionLevel = 'L';

let generateKeys = () => {
    if (!sodiumLoaded) {
        console.log("not yet loaded");
        return;
    }
    const { publicKey, privateKey } = sodium.crypto_sign_keypair();

    let qr = qrcode(qrTypeNumber, qrErrorCorrectionLevel);
    qr.addData(`https://ubique.ch#${sodium.to_hex(privateKey)}`);
    qr.make();
    document.getElementById('private-key').innerHTML = qr.createSvgTag(10, 0);

    qr = qrcode(qrTypeNumber, qrErrorCorrectionLevel);
    qr.addData(`https://ubique.ch#${sodium.to_hex(publicKey)}`);
    qr.make();
    document.getElementById('public-key').innerHTML = qr.createSvgTag(10, 0);

    const wrappers = document.getElementsByClassName("key-wrapper");
    console.log(wrappers.length);
    for(let i=0; i < wrappers.length; i++) wrappers[i].style.display = "initial";
};

let ready = (fn) => {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(() => {
    document.getElementById('generate-btn').onclick = () => { generateKeys() };
})

