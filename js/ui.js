
function checkAnswers(){

let inputs=document.querySelectorAll(".answer");
let results=document.querySelectorAll(".result");

inputs.forEach((i,index)=>{

let v=i.value.trim();

if(v===""){
results[index].innerHTML="";
return;
}

if(parseInt(v)===answers[index]){
results[index].innerHTML="✔";
results[index].className="result correct";
}else{
results[index].innerHTML="✘";
results[index].className="result wrong";
}

});

}

function resetAnswers(){
document.querySelectorAll(".answer").forEach(i=>i.value="");
document.querySelectorAll(".result").forEach(i=>i.innerHTML="");
}

function updateLevels(){

let category = document.getElementById("category").value;
let level = document.getElementById("level");

level.innerHTML = "<option value=''>Level</option>";

let levels = [];

if(category === "star"){
    levels = [
        "Level 1 (Direct Addition)",
        "Level 2 (Direct Add & Sub)",
        "Level 3 (5's complement Addition)",
        "Level 4 (5's complement Add & Sub)"
    ];
}
else if(category === "junior"){
    levels = [
        "Level 1 (Direct, 5's complement Add & Sub)",
        "Level 2 (10's complement Add & Sub)",
        "Level 3 (Mixed complement Add & Sub)",
        "Level 4 (Mastering up to 4 Rows)"
    ];
}
else if(category === "senior"){
    levels = [
        "Level 1 (Direct, 5's & 10's complement)",
        "Level 2 (Mixed complement)",
        "Level 3 (Mastering)",
        "Level 4 (Mastering + Multiplication)",
        "Level 5 (Division)",
        "Level 6 (Decimal)",
        "Level 7 (Decimal Multiplication)",
        "Level 8 (BODMAS)",
        "Level 9 (Square Roots & Percent)",
        "Level 10 (Final level)",
    ];
}

/* add options */
levels.forEach((text, index)=>{
    let op = document.createElement("option");
    op.value = index + 1;   // IMPORTANT: keeps your generator working
    op.text = text;
    level.appendChild(op);
});

}

function saveCategory(){
  let cat = document.getElementById("category").value;
  localStorage.setItem("category", cat);
}

function saveLevel(){
  let lvl = document.getElementById("level").value;
  localStorage.setItem("level", lvl);
}