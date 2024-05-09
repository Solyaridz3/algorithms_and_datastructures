//@ts-check
const readline = require("readline");
// Шифр вертикальної перестановки

const ALPHABET = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ!@#$%^&*()_+{}[]|;:,.<>?/`~1234567890";

function sortKey(key) {
    const indexes = [];
    for (const char of key) {
        const index = ALPHABET.indexOf(char);
        if (index === -1) {
            throw new Error("Invalid key");
        }
        indexes.push(index);
    }
    return indexes.sort((a, b) => a - b).map((index) => ALPHABET[index]);
}

function encrypt(text, key) {
    const sortedKey = sortKey(key);
    const splitArr = new Array(key.length).fill(null).map(() => new Array());

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        splitArr[i % key.length].push(ch);
    }

    const letterStringPairs = {};
    for (let i = 0; i < key.length; i++) {
        letterStringPairs[key[i]] = splitArr[i];
    }

    const finalArr = sortedKey.map((key) => letterStringPairs[key]);

    return finalArr.reduce((acc, current) => acc + current.join(""), "");
}

// Функція для вводу тексту з консолі
function inputText(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
            rl.close();
        });
    });
}

// Шифрування та дешифрування за допомогою шифру вертикальної перестановки
async function runBlockTransposeEncryption() {
    const plaintext = await inputText("Введіть текст для шифрування:");
    const key = await inputText("Введіть ключ для шифрування:");
    const result = encrypt(plaintext, key);
    console.log("Зашифрований текст (Блокова перестановка):", result);
}

runBlockTransposeEncryption();
