const answerBox=document.getElementById("answerResult")
const stepList=document.getElementById("stepList")
const RODS=13;
const BEAD_H=24;
const BAR_TOP=52;
const FIRST_EARTH=BAR_TOP;
const EARTH_DOWN=[250-(4*BEAD_H),250-(3*BEAD_H),250-(2*BEAD_H),250-BEAD_H];

const abacus=document.getElementById("abacus");
const row=document.getElementById("rodValuesRow");
const totalBox=document.getElementById("totalValue");

const states=[];

function rodValue(s){
return (s.h?5:0)+s.e;
}   
const errorBox = document.getElementById("errorBox")

function showError(msg){
errorBox.innerText = msg
}

function clearError(){
errorBox.innerText = ""
}
function normalizeInput(input){

return input
.toLowerCase()

/* words → symbols */
.replace(/plus/g, "+")
.replace(/minus/g, "-")
.replace(/times/g, "*")
.replace(/dividedby/g, "/")
.replace(/divided\s*by/g, "/")
.replace(/div/g, "/")

/* symbols → standard */
.replace(/[x×]/g, "*")
.replace(/[÷]/g, "/")

/* remove spaces */
.replace(/\s+/g, "")

}
function updateTotal(){

let v = states.map(rodValue).join("").replace(/^0+/,"") || "0";

totalBox.innerText = v;

/* show value in answer box if it exists */

let ansBox = document.getElementById("currentAnswer");

if(ansBox){
ansBox.value = v;
}

}

function updateEarth(s){

    const rod = s.eb[0].parentElement;
    const rodHeight = rod.offsetHeight;

    const BOTTOM_START = rodHeight - (4 * BEAD_H); // full stack base
    const ACTIVE_START = BAR_TOP + 2; // just below bar

    // 1. Reset ALL beads to bottom stack (like image)
    for(let i=0;i<4;i++){
        s.eb[i].style.top = (BOTTOM_START + i * BEAD_H) + "px";
    }

    // 2. Move active beads upward (touching bar)
    for(let i=0;i<s.e;i++){
        s.eb[i].style.top = (ACTIVE_START + i * BEAD_H) + "px";
    }

}

function createRod(i){


let rod=document.createElement("div");
rod.className="rod";

let line=document.createElement("div");
line.className="rod-line";
rod.appendChild(line);

// CREATE DOT ONLY ON RODS 1,4,7,10,13
if(i%3===0){
let dot=document.createElement("div");
dot.className="unit-dot";
rod.appendChild(dot);
}

let bar=document.createElement("div");
bar.className="unit-bar";
rod.appendChild(bar);

let up=document.createElement("div");
up.className="bead upper-bead";
up.style.top="0px";
rod.appendChild(up);

let eb=[];
for(let j=0;j<4;j++){
let b=document.createElement("div");
b.className="bead earth-bead";
b.style.top=EARTH_DOWN[j]+"px";
rod.appendChild(b);
eb.push(b);
}

let box=document.createElement("div");
box.className="rod-value-box";
box.innerText="0";
row.appendChild(box);

let s={h:false,e:0,up,eb,box};

up.onclick=()=>{
s.h=!s.h;
up.style.top=s.h?(BAR_TOP-BEAD_H)+"px":"0px";
box.innerText=rodValue(s);
updateTotal();
};

eb.forEach((b,idx)=>{
b.onclick=()=>{
if(idx<s.e)s.e=idx;
else s.e=idx+1;
updateEarth(s);
box.innerText=rodValue(s);
updateTotal();
};
});

states.push(s);
abacus.appendChild(rod);

}

function getAbacusValue(){

let v = states.map(rodValue).join("").replace(/^0+/,"") || "0";

return parseInt(v);

}

function clearAbacus(){
states.forEach(s=>{
s.h=false;
s.e=0;
s.up.style.top="0px";
updateEarth(s);
s.box.innerText="0";
});
updateTotal();
}

for(let i=0;i<RODS;i++)createRod(i);
updateTotal();


/* ================================
ABACUS SOLVER ENGINE
================================ */

let steps = []
let stepIndex = 0
let isPrepared = false;  // 🔥 FLAG TO CHECK IF PREPARATION IS DONE

const techniqueBox = document.getElementById("techniqueResult")
const questionBox = document.getElementById("question_box")

/* READ QUESTION */

function parseQuestion(){

let text = normalizeInput(questionBox.value)
let tokens = text.match(/(\d+|[\+\-\*\/])/g)

if(!tokens) return null

let start = tokens.shift()

let operations=[]

while(tokens.length>=2){

let op=tokens.shift()
let num=tokens.shift()

operations.push({
op:op,
num:num
})

}

return{
start:start,
operations:operations
}

}

/* TECHNIQUE DETECTION */

function detectTechnique(a,b,op){

a = Number(a)
b = Number(b)

/* ================= ADDITION ================= */

if(op === "+"){

/* 5's COMPLEMENT */
if(
(b===1 && a===4) ||
(b===2 && [3,4].includes(a)) ||
(b===3 && [2,3,4].includes(a)) ||
(b===4 && [1,2,3,4].includes(a))
){
return "5's Complement"
}

/* MIXED COMPLEMENT */
if(
(b===6 && [5,6,7,8].includes(a)) ||
(b===7 && [5,6,7].includes(a)) ||
(b===8 && [5,6].includes(a)) ||
(b===9 && [5].includes(a))
){
return "Mixed Complement"
}

/* 10's COMPLEMENT */
if(
(b===1 && a===9) ||
(b===2 && [8,9].includes(a)) ||
(b===3 && [7,8,9].includes(a)) ||
(b===4 && [6,7,8,9].includes(a)) ||
(b===5 && [5,6,7,8,9].includes(a)) ||
(b===6 && [4,9].includes(a)) ||
(b===7 && [3,4,8,9].includes(a)) ||
(b===8 && [2,3,4,7,8,9].includes(a)) ||
(b===9 && [1,2,3,4,5,6,7,8,9].includes(a))
){
return "10's Complement"
}

/* DIRECT */
return "Direct Addition"

}

/* ================= SUBTRACTION ================= */

if(op === "-"){

/* 5's COMPLEMENT */
if(
(b===1 && [5].includes(a)) ||
(b===2 && [5,6].includes(a)) ||
(b===3 && [5,6,7].includes(a)) ||
(b===4 && [5,6,7,8].includes(a))
){
return "5's Complement"
}

/* MIXED COMPLEMENT */
if(
(b===6 && [1,2,3,4].includes(a)) ||
(b===7 && [2,3,4].includes(a)) ||
(b===8 && [3,4].includes(a)) ||
(b===9 && [4].includes(a))
){
return "Mixed Complement"
}

/* 10's COMPLEMENT */
if(a < b){
return "10's Complement"
}

/* DIRECT */
return "Direct Subtraction"

}

return "Direct"
}

/* ROD HIGHLIGHT */

function highlightRod(r){

document.querySelectorAll(".rod").forEach(x=>x.style.background="")

let rods=document.querySelectorAll(".rod")

if(rods[r])
rods[r].style.background="#ffeaa7"

}

/* READ ROD VALUE */

function getRodValue(index){

let s=states[index]

return (s.h?5:0)+s.e

}

/* SET ROD VALUE */

function setRodValue(index,val){

if(val<0) val=0
if(val>9) val=9

let s=states[index]

if(val>=5){

s.h=true
s.e=val-5

}else{

s.h=false
s.e=val

}

s.up.style.top=s.h?(BAR_TOP-BEAD_H)+"px":"0px"

updateEarth(s)

s.box.innerText=rodValue(s)

updateTotal()

}

function getPlaceName(index){

let place = RODS-1-index

if(place===0) return "Ones"
if(place===1) return "Tens"
if(place===2) return "Hundreds"
if(place===3) return "Thousands"

return `10^${place}`

}

/* EXECUTE STEP */

function nextStep(){

    // 🔥 IF FINISHED → NEXT CLICK CLEARS EVERYTHING
if(stepIndex === steps.length && steps.length > 0){

    techniqueBox.innerText = "Finished"

    let ans = calculateExpression()
    if(ans !== null){
        answerBox.innerText = ans
    }

    stepIndex++  // prevent repeat
    return
}

// 🔥 PREPARE ONLY ONCE
if (!isPrepared) {
    startSolve(false);  // 🔥 pass flag
    isPrepared = true;
}

if(stepIndex>=steps.length) return

let step=steps[stepIndex]
let div=document.createElement("div")
div.className="step"
div.innerText=step.text
stepList.appendChild(div)


highlightRod(step.rod)

techniqueBox.innerText =
`Technique : ${step.tech}
Step : ${step.type==="add" ? "+" : "-"} ${step.value}`

let current=getRodValue(step.rod)

let result=current

if(step.type==="add")
result=current+step.value

if(step.type==="sub")
result=current-step.value

/* HANDLE CARRY */

if(result>9){

setRodValue(step.rod,result-10)

let left=Math.max(0,step.rod-1)

if(left>=0)
setRodValue(left,getRodValue(left)+1)

}

else if(result<0){

let left=Math.max(0,step.rod-1)

while(left>=0 && getRodValue(left)===0){
setRodValue(left,9)
left--
}

if(left>=0){
setRodValue(left,getRodValue(left)-1)
}

setRodValue(step.rod,result+10)

}

else{

setRodValue(step.rod,result)

}

stepIndex++
if(stepIndex > steps.length){
    clearQuestion()
    return
}

}


function clearQuestion(){

    // 🧹 clear input + UI
    questionBox.value = ""
    errorBox.innerText = ""
    stepList.innerHTML = ""

    // 🔄 reset logic
    steps = []
    stepIndex = 0
    isPrepared = false

    // 🧮 reset abacus
    clearAbacus()

    // 🧾 reset display
    techniqueBox.innerText = "Ready"
    answerBox.innerText = "0"

}   

/* START */
clearError()


function startSolve(showAnswer = true){

    steps = []
    stepIndex = 0
    stepList.innerHTML = ""

    let rawText = normalizeInput(questionBox.value)

    // ❌ REMOVE auto-answer from here

    if(showAnswer){
        let ans = calculateExpression()
        if(ans !== null){
            answerBox.innerText = ans
        }
    }

    clearAbacus()

    let q = parseQuestion()
    if(!q){
        alert("Invalid Question")
        return
    }

    let tempStates = new Array(RODS).fill(0)

    generateLoadSteps(q.start, tempStates)

    let runningValue = parseInt(q.start)

    q.operations.forEach(opObj => {

        let temp = {
            a: runningValue.toString(),
            b: opObj.num,
            op: opObj.op
        }

        generateStepsForPair(temp, tempStates)

        if(opObj.op=="+")
            runningValue += parseInt(opObj.num)
        else
            runningValue -= parseInt(opObj.num)

    })

    techniqueBox.innerText = "Ready"
}

techniqueBox.innerText="Ready"



function techniqueExplanation(tech,a,b){

if(tech==="5's Complement")
return `+ ${b} = +5 - ${5-b}`

if(tech==="10's Complement")
return `+ ${b} = -${10-b} + 10`

if(tech==="Mixed Complement")
return `+ ${b} = +${b-5} - 5 + 10`

return "Direct move beads"

}

function loadNumberOnAbacus(num){

let digits = num.split("").reverse()

for(let i=0;i<digits.length;i++){

let rodIndex = RODS - 1 - i
if(rodIndex < 0) continue

setRodValue(rodIndex, parseInt(digits[i]))

}

}

function calculateExpression(){

let text = normalizeInput(questionBox.value);

// supports decimals
let tokens = text.match(/(\d+(\.\d+)?|[\+\-\*\/])/g);

if(!tokens) return null;

let result = parseFloat(tokens.shift());

while(tokens.length >= 2){

let op = tokens.shift();
let num = parseFloat(tokens.shift());

if(op == "+") result += num;
else if(op == "-") result -= num;

}

return result;

}

function generateStepsForPair(temp, tempStates){

let B=temp.b.split("")
let max=B.length

for(let i=max-1;i>=0;i--){

let rodIndex = RODS-1-i
let d2=parseInt(B[max-1-i])

/* ✅ USE TEMP STATE */
let current = tempStates[rodIndex]

let tech = detectTechnique(current,d2,temp.op)

/* simulate */

let result = temp.op==="+" 
? current + d2 
: current - d2

if(result > 9){

tempStates[rodIndex] = result - 10

let left = rodIndex - 1
if(left >= 0) tempStates[left] += 1

}
else if(result < 0){

let left = rodIndex - 1

while(left >= 0 && tempStates[left] === 0){
tempStates[left] = 9
left--
}

if(left >= 0){
tempStates[left] -= 1
}

tempStates[rodIndex] = result + 10

}
else{

tempStates[rodIndex] = result

}

/* push step */

steps.push({
rod:rodIndex,
type:(temp.op=="+")?"add":"sub",
value:d2,
tech,
text:`${getPlaceName(rodIndex)} : ${current} ${temp.op} ${d2}
Technique : ${tech}`
})

}
}

function generateLoadSteps(num, tempStates){

let digits = num.split("")
let max = digits.length

for(let i=max-1;i>=0;i--){

let rodIndex = RODS-1-i
let value = parseInt(digits[max-1-i])

/* ✅ ADD THIS LINE HERE */
tempStates[rodIndex] = value

steps.push({
rod:rodIndex,
type:"add",
value:value,
tech:"Load Number",
text:`${getPlaceName(rodIndex)} : set ${value}`
})

}
}

