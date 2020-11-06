import generateQrCode from './generateQrCode'
import generateProtoBufs from './generateProtoBufs'
import mdtoast from '@dmuy/toast'

const generateKeys = () => {
    const formData = new FormData(document.getElementById("details-form"));
    let values = {
        name: formData.get('name'),
        location: formData.get('location'),
        room: formData.get('room'),
        venueType: parseInt(formData.get('venuetype'))
    };
    if(!values.name || !values.location || !values.room || values.venueType === undefined || values.venueType === NaN) {
        mdtoast("Please fill out all fields", {type: "WARNING"});
        return;
    }

    const { trace, entry } = generateProtoBufs(values);

    if(trace === undefined || entry === undefined) {
        mdtoast("Sodium not yet loaded. Retry in a couple of seconds.", {type: "WARNING"});
        return;
    }

    document.getElementById('qrentry').innerHTML = generateQrCode(`${BASE_URL}#${entry}`);
    document.getElementById('qrtrace').innerHTML = generateQrCode(`${UPLOAD_URL}#${trace}`);

    const wrappers = document.getElementsByClassName("key-wrapper");
    for(let i=0; i < wrappers.length; i++) wrappers[i].style.display = "initial";
};

export default generateKeys;