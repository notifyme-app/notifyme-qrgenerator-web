import '@dmuy/toast/dist/mdtoast.css'
import './styles/main.scss'
import generateKeys from './js/generateKeys'

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
