
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
    const rodHeight = rod.clientHeight;
    const bar = rod.querySelector(".unit-bar");

    const BEAD = s.eb[0].offsetHeight || BEAD_H;

    const BOTTOM_START = rodHeight - (4 * BEAD);
    const ACTIVE_START = bar.offsetTop + bar.offsetHeight;

    for(let i=0;i<4;i++){
        s.eb[i].style.top = (BOTTOM_START + i * BEAD) + "px";
    }

    for(let i=0;i<s.e;i++){
        s.eb[i].style.top = (ACTIVE_START + i * BEAD) + "px";
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
    b.style.top = "0px";
    rod.appendChild(b);
    eb.push(b);
}

let box=document.createElement("div");
box.className="rod-value-box";
box.innerText="0";
row.appendChild(box);

// ✅ NOW create state
let s={h:false,e:0,up,eb,box};

// ✅ NOW it's safe
updateEarth(s);

up.onclick = () => {
    s.h = !s.h;

    const rod = up.parentElement;
    const bar = rod.querySelector(".unit-bar");
    const BEAD = up.offsetHeight;

    up.style.top = s.h
        ? (bar.offsetTop - BEAD) + "px"
        : "0px";

    box.innerText = rodValue(s);
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

updateEarth(s); // 🔥 REQUIRED

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
