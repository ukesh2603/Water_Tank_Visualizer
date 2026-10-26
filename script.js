const heightInput = document.getElementById("heights");
const calculateButton = document.getElementById("calculateBtn");
const totalWaterElement = document.getElementById("totalWater");
const tankElement = document.getElementById("tank");
const waterDetails = document.getElementById("waterDetails");
const errorElement = document.getElementById("error");

function calculateWater(A) {
    const N=A.length;
    const psum=new Array(N);
    psum[0]=A[0];

    for(let i=1;i<N;i++) {
        psum[i]=Math.max(psum[i-1],A[i]);
    }

    const ssum=new Array(N);
    ssum[N-1]=A[N-1];

    for(let i=N-2;i>=0;i--) {
        ssum[i]=Math.max(ssum[i+1],A[i]);
    }

    let count=0;
    const waterStored=new Array(N).fill(0);

    for(let i=0;i<N;i++) {
        const water=Math.min(psum[i],ssum[i]);
        const ans=water-A[i];

        waterStored[i]=ans;
        count+=ans;
    }

    return {
        count:count,
        waterStored:waterStored
    };
}

function drawTank(A,waterStored) {
    const N=A.length;
    const blockWidth=45;
    const blockHeight=30;
    const gap=5;
    const padding=25;
    const topPadding=20;

    const tallestBlock=Math.max(1,...A);
    const columnWidth=blockWidth+gap;
    const width=padding*2+N*columnWidth-gap;
    const groundY=topPadding+tallestBlock*blockHeight;
    const height=groundY+35;

    let svg=`
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="${width}"
            height="${height}"
            viewBox="0 0 ${width} ${height}"
            role="img"
            aria-label="Visualization of blocks and trapped water"
        >
            <line
                x1="${padding}"
                y1="${groundY}"
                x2="${width-padding}"
                y2="${groundY}"
                stroke="#94a3b8"
                stroke-width="2"
            />
    `;

    for(let i=0;i<N;i++) {
        const x=padding+i*columnWidth;
        const blockTop=groundY-A[i]*blockHeight;
        const waterTop=groundY-(A[i]+waterStored[i])*blockHeight;

        if(waterStored[i]>0) {
            svg+=`
                <rect
                    x="${x}"
                    y="${waterTop}"
                    width="${blockWidth}"
                    height="${waterStored[i]*blockHeight}"
                    fill="#38bdf8"
                    stroke="#0284c7"
                />
            `;
        }

        if(A[i]>0) {
            svg+=`
                <rect
                    x="${x}"
                    y="${blockTop}"
                    width="${blockWidth}"
                    height="${A[i]*blockHeight}"
                    fill="#475569"
                    stroke="#334155"
                />
            `;
        }

        svg+=`
            <text
                x="${x+blockWidth/2}"
                y="${groundY+20}"
                text-anchor="middle"
                font-size="12"
                fill="#334155"
            >${i}</text>
        `;
    }

    svg+="</svg>";
    tankElement.innerHTML=svg;
}

function showWaterDetails(A,waterStored) {
    waterDetails.innerHTML="";

    for(let i=0;i<A.length;i++) {
        const row=document.createElement("tr");
        const indexCell=document.createElement("td");
        const heightCell=document.createElement("td");
        const waterCell=document.createElement("td");

        indexCell.textContent=i;
        heightCell.textContent=A[i];
        waterCell.textContent=waterStored[i];

        row.appendChild(indexCell);
        row.appendChild(heightCell);
        row.appendChild(waterCell);

        waterDetails.appendChild(row);
    }
}

function runCalculation() {
    errorElement.textContent="";

    const inputText=heightInput.value.trim();

    if(inputText==="") {
        errorElement.textContent="Please enter the block heights.";
        return;
    }

    const values=inputText.split(",").map(value=>value.trim());

    for(const value of values) {
        if(!/^\d+$/.test(value)||!Number.isSafeInteger(Number(value))) {
            errorElement.textContent="Enter non-negative whole numbers separated by commas.";
            return;
        }
    }

    const A=values.map(value=>Number(value));
    const result=calculateWater(A);

    totalWaterElement.textContent=result.count;
    drawTank(A,result.waterStored);
    showWaterDetails(A,result.waterStored);
}

calculateButton.addEventListener("click",runCalculation);
runCalculation();