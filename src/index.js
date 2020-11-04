import './styles/main.scss'
import protobuf from 'protobufjs'
import qrcode from 'qrcode-generator'
import _sodium from 'libsodium-wrappers'
import qrMessage from './protobuf/qrMessage'

let sodiumLoaded = false;
let sodium;
(async () => {
    await _sodium.ready;
    sodiumLoaded = true;
    sodium = _sodium;
})();

const root = protobuf.Root.fromJSON(qrMessage);
const QrMessage = root.lookupType("qrpackage.QrMessage");

const qrTypeNumber = 8;
const qrErrorCorrectionLevel = 'L';

let generateKeys = () => {
    if (!sodiumLoaded) {
        console.log("not yet loaded");
        return;
    }
    const { publicKey, privateKey } = sodium.crypto_sign_keypair();

    let publicMessage = QrMessage.create({
        version: 1,
        publicKey: publicKey,
        name: document.getElementById('name').value,
        location: document.getElementById('location').value,
        room: document.getElementById('room').value,
        venueType: parseInt(document.getElementById('venuetype').value),
        notificationKey: new TextEncoder().encode("This is the notification key"),
        signature: new TextEncoder().encode("This is the signature")
    });



    let qr = qrcode(qrTypeNumber, qrErrorCorrectionLevel);
    qr.addData(`${BASE_URL}#${sodium.to_base64(privateKey)}`);
    qr.make();
    document.getElementById('qrtrace').innerHTML = qr.createSvgTag(10, 0);

    qr = qrcode(qrTypeNumber, qrErrorCorrectionLevel);

    var protoBufBytes = QrMessage.encode(publicMessage).finish();    
    var protoBufBase64 = sodium.to_base64(protoBufBytes);

    qr.addData(`${BASE_URL}#${protoBufBase64}`);
    qr.make();
    document.getElementById('qrentry').innerHTML = qr.createSvgTag(10, 0);

    const wrappers = document.getElementsByClassName("key-wrapper");
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

