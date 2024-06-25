const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//ste strength circle color to grey


//set passwordLength
function handleSlider() {//password length ko ui pe display krvata hai
    inputSlider.value = passwordLength;//slider ko kiss no pe rkna h 
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow - HW
}

function getRndInteger(min, max) {//math.floor to approximate decimal values
    return Math.floor(Math.random() * (max - min)) + min;// RANDOM NO. BETWEEN 2 GIVEN VALUES KE LIYE
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  //parseINT for char to number '1'->1
       return String.fromCharCode(getRndInteger(97,123))//no. to character ke liye string.fromcharcode
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))//kisi no. ke corresponding symbol yaa character
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;//konsa checkbox check h uske liye .checked function hota hai
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}
//navigator.clipboard.writeText vala function clipboard pe copy krta h
//navigator.clipboard.writeText vala function promise return krta hai which is resolve or reject
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";//jo span tag banaya tha usme aajaega yeh message 
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");// copy message css class ke andar active class ki property ko daldenge

    setTimeout( () => {
        copyMsg.classList.remove("active");//copy vala message bss 2 sec ke liye hi visible h isliye yeh function use kiya h 
    },2000);

}

function shufflePassword(array) {
    //Fisher Yates Method--->>> KISI ARRAY PE APPLY KRKE USE SHUFFLE KR SKTE HAI
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {//jb bhi hum kisi check box ko tick yaa untick karenge to yeh function shuru se count krne lg jaega ki kitne tick h or kitnr untick h
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}
//check box pe event listener lagana h kyunki bina kisi tick ke password gen nhi hoga to voh count pata hona chahiye
allCheckBox.forEach( (checkbox) => {//harr check box pe event listener lagane ke liye optimised 
    checkbox.addEventListener('change', handleCheckBoxChange);
})

//jaha jaha click krne se value change ho rhi h vaha event listener lagaenge

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;//click yaa move krte time slider jiss posn pe hoga use password length me daldo
    handleSlider();
})


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }
    
    //ek array banadi jisme generateuppercase,generatesymbol...etc function daldiye taki random 
    //kisi bhi function ko call lagake ek new pass word banaske hamesa
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password// KYUNKI AGAR 2 TICK H TO HAMESA PEHLA OR DUSRA LETTER JO TICK KIYE H VOH HI HONGE 
    password = shufflePassword(Array.from(password));//Array.from() method se kisi bhi string ko array me convert kr skte hai
    //jiska naam array h
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});