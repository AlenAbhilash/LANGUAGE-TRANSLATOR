const langSelects = document.querySelectorAll(".lang");
const translateButton = document.querySelector("#translate-btn");
const fromText = document.querySelector("#toform");
const toText = document.querySelector("#formto");
const exchange = document.querySelector(".excahnge");
const copyIcons = document.querySelectorAll(".copy");
const speakIcons = document.querySelectorAll(".speak");


for (let select of langSelects) {
    for (let currCode in countries) {
        let newOption = document.createElement("option");
        newOption.innerText = countries[currCode];
        newOption.value = currCode;

        if (select.name === "from" && currCode === "en-GB") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "hi-IN") {
            newOption.selected = true;
        }

        select.appendChild(newOption);
    }
}

exchange.addEventListener('click', () => {
    let tempText = fromText.value;
    fromText.value = toText.value;
    toText.value = tempText;
    let fromSelect = document.querySelector('select[name="from"]');
    let toSelect = document.querySelector('select[name="to"]');
    let tempSelectValue = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = tempSelectValue;
});

translateButton.addEventListener("click", () => {
    let text = fromText.value;
    let translateFrom = document.querySelector('select[name="from"]').value;
    let translateTo = document.querySelector('select[name="to"]').value;
    console.log(text, translateFrom, translateTo);
    let url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            toText.innerText = data.responseData.translatedText;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});


copyIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        const textArea = icon.closest(".datafrom, .datato").querySelector("textarea");
        if (textArea) {
            navigator.clipboard.writeText(textArea.value)
                .then(() => alert("Text copied to clipboard"))
                .catch(err => console.error('Error copying text: ', err));
        } else {
            console.error("Textarea not found");
        }
    });
});
speakIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        let utterance;
        if (icon.closest('.datafrom')) {
            utterance = new SpeechSynthesisUtterance(fromText.value);
            utterance.lang = document.querySelector('select[name="from"]').value;
        } else if (icon.closest('.datato')) {
            utterance = new SpeechSynthesisUtterance(toText.value);
            utterance.lang = document.querySelector('select[name="to"]').value;
        }
        speechSynthesis.speak(utterance);
    });
});
const startVoiceInput = (textArea) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        textArea.value = speechResult;
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onerror = (event) => {
        console.error('Error occurred in recognition: ', event.error);
    };
};
const startVoiceFromBtn = document.querySelector('#start-voice-from');

startVoiceFromBtn.addEventListener('click', () => {
    startVoiceInput(fromText);
});
