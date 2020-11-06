import './styles/main.scss'
import protobuf from 'protobufjs'
import qrcode from 'qrcode-generator'
import _sodium from 'libsodium-wrappers-sumo'
import qrMessage from './protobuf/qrMessage'
import seedMessage from './protobuf/seedMessage'

let sodiumLoaded = false;
let sodium;
(async () => {
    await _sodium.ready;
    sodiumLoaded = true;
    sodium = _sodium;
})();

const rootQr = protobuf.Root.fromJSON(qrMessage);
const QRCodeContent = rootQr.lookupType("qrpackage.QRCodeContent");
const QRCodeWrapper = rootQr.lookupType("qrpackage.QRCodeWrapper");

const rootSeed = protobuf.Root.fromJSON(seedMessage);
const SeedMessage = rootSeed.lookupType("seedpackage.SeedMessage");

const qrTypeNumber = 10;
const qrErrorCorrectionLevel = 'L';

let generateKeys = () => {
    if (!sodiumLoaded) {
        console.log("not yet loaded");
        return;
    }

    const authorityPublicKey = sodium.from_hex(`${PUBLIC_KEY}`);

    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    const room = document.getElementById('room').value;
    const venueType = parseInt(document.getElementById('venuetype').value);

    const salt = sodium.randombytes_buf(32);
    const notificationKey = sodium.crypto_secretbox_keygen();

    let seedMessage = SeedMessage.create({
        salt: salt,
        notificationKey: notificationKey,
        name: name,
        location: location,
        room: room
    });
    const seed = SeedMessage.encode(seedMessage).finish();

    const { publicKey, privateKey } = sodium.crypto_sign_seed_keypair(sodium.crypto_hash_sha256(seed));

    let qrCodeContent = QRCodeContent.create({
        version: 1,
        publicKey: publicKey,
        name: name,
        location: location,
        room: room,
        venueType: venueType,
        notificationKey: notificationKey,
    });

    const qrCodeContentProtoBufBytes = QRCodeContent.encode(qrCodeContent).finish();
    const qrCodeContentSignature = sodium.crypto_sign_detached(qrCodeContentProtoBufBytes, privateKey);

    let qrCodeWrapper = QRCodeWrapper.create({
        version: 1,
        content: qrCodeContent,
        signature: qrCodeContentSignature
    });

    const ctx = sodium.crypto_box_seal(seed, authorityPublicKey);

    /// QR ENTRY ////
    const qrEntry = qrcode(qrTypeNumber, qrErrorCorrectionLevel);
    const qrCodeWrapperProtoBufBytes = QRCodeWrapper.encode(qrCodeWrapper).finish();
    const protoBufBase64 = sodium.to_base64(qrCodeWrapperProtoBufBytes);
    qrEntry.addData(`${BASE_URL}#${protoBufBase64}`);
    qrEntry.make();
    document.getElementById('qrentry').innerHTML = qrEntry.createSvgTag(10, 0);

    /// QR TRACE ////
    const qrTrace = qrcode(qrTypeNumber, qrErrorCorrectionLevel);
    qrTrace.addData(`${UPLOAD_URL}#` + sodium.to_base64(ctx));
    qrTrace.make();
    document.getElementById('qrtrace').innerHTML = qrTrace.createSvgTag(10, 0);

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
    const commit = `${GIT_INFO}`;
    if (commit) {
        document.getElementById("revision").textContent = `Commit: ` + commit;
    }
    document.getElementById('generate-btn').onclick = () => { generateKeys() };
})
