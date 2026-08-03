// =================================
// 学園アイドルマスター 後イベント解析ツール
// script.js Ver1.5
// =================================


// ================================
// シナリオ設定
// ================================

const scenarios = {

    "初レジェンド":16,

    "NIAマスター":23,

    "HIF予選":17,

    "HIF本選":6

};



// ================================
// 要素取得
// ================================

const scenarioSelect =
document.getElementById(
    "scenarioSelect"
);


const totalEventsInput =
document.getElementById(
    "totalEvents"
);


const weekArea =
document.getElementById(
    "weekArea"
);


const remainingDisplay =
document.getElementById(
    "remainingDisplay"
);


const saveButton =
document.getElementById(
    "saveRunButton"
);


const analyzeButton =
document.getElementById(
    "analyzeButton"
);


const exportButton =
document.getElementById(
    "exportButton"
);


const importButton =
document.getElementById(
    "importButton"
);


const importFile =
document.getElementById(
    "importFile"
);


const clearButton =
document.getElementById(
    "clearButton"
);


const fillNoneButton =
document.getElementById(
    "fillNoneButton"
);


const runCount =
document.getElementById(
    "runCount"
);
console.log("saveButton", saveButton);
console.log("analyzeButton", analyzeButton);

const collectorName =
document.getElementById(
    "collectorName"
);


// ================================
// データ
// ================================


let runs =
JSON.parse(
    localStorage.getItem(
        "gakumasRuns"
    )
)
|| [];



let currentWeeks=[];



// ================================
// 初期設定
// ================================


scenarioSelect.value =
"HIF予選";


totalEventsInput.value =
12;



function initialize(){


    createWeekButtons();


    updateRemaining();


    updateRunCount();


}



initialize();



// ================================
// シナリオ変更
// ================================


scenarioSelect.addEventListener(

"change",

()=>{


    createWeekButtons();


});



// ================================
// 週ボタン生成
// ================================


function createWeekButtons(){


    const weeks =
    scenarios[
        scenarioSelect.value
    ];


    currentWeeks=[];


    weekArea.innerHTML="";



    for(
        let i=0;
        i<weeks;
        i++
    ){


        currentWeeks[i]=undefined;



        const row =
        document.createElement(
            "div"
        );


        row.className =
        "weekRow";



        row.innerHTML =

        `

        <p>

        ${i+1}週目


        <span class="weekStatus">

        未入力

        </span>


        <button class="hit">

        発生

        </button>


        <button class="none">

        なし

        </button>


        </p>

        `;



        const status =
        row.querySelector(
            ".weekStatus"
        );



        row.querySelector(
    ".hit"
)
.addEventListener(

"click",

()=>{


    currentWeeks[i]=1;


    status.textContent =
    "発生";


    row.style.background =
    "#d8f3dc";


    updateRemaining();


});


       

        row.querySelector(
            ".none"
        )
        .onclick = ()=>{


            currentWeeks[i]=0;


            status.textContent =
            "なし";


            row.style.background =
            "#eeeeee";


        };



        weekArea.appendChild(
            row
        );


    }


}
// ================================
// 残りイベント表示
// ================================


function updateRemaining(){


    let remain =
    Number(
        totalEventsInput.value
    );


    currentWeeks.forEach(value=>{


        if(value===1){

            remain--;

        }


    });


    if(remain < 0){

        remain=0;

    }


    if(remainingDisplay){

    remainingDisplay.textContent =
    remain;

}


}



// ================================
// 全週×
// ================================


if(fillNoneButton){


fillNoneButton.addEventListener(

"click",

()=>{


    const weeks =
    scenarios[
        scenarioSelect.value
    ];



    for(
        let i=0;
        i<weeks;
        i++
    ){

        currentWeeks[i]=0;

    }



    document
    .querySelectorAll(
        ".weekRow"
    )
    .forEach(row=>{


        const status =
        row.querySelector(
            ".weekStatus"
        );


        status.textContent =
        "なし";


        row.style.background =
        "#eeeeee";


    });



    updateRemaining();


});


}



// ================================
// 保存
// ================================

console.log("保存イベント登録地点");
if(saveButton){

    saveButton.addEventListener(

    "click",

    saveRun

    );

}



function saveRun(){



    const weeks =
    currentWeeks.filter(
        x=>x!==undefined
    );



    if(
        weeks.length===0
    ){

        alert(
            "週データを入力してください"
        );

        return;

    }



    const totalWeeks =
    scenarios[
        scenarioSelect.value
    ];



    if(
        weeks.length < totalWeeks
    ){


        const answer =
        confirm(

        "未入力の週があります。\n" +

        weeks.length +
        "/" +
        totalWeeks +
        "週入力済みです。\n\n" +

        "このまま保存しますか？"

        );



        if(!answer){

            return;

        }


    }




    runs.push({

    collector:
    collectorName.value || "未入力",


    scenario:
    scenarioSelect.value,


    totalEvents:
    Number(
        totalEventsInput.value
    ),


    weeks:
    currentWeeks.slice()

});



    localStorage.setItem(

        "gakumasRuns",

        JSON.stringify(
            runs
        )

    );



    updateRunCount();



    alert(
        "保存しました"
    );


}



// ================================
// 保存数表示
// ================================


function updateRunCount(){



    if(runCount){


        runCount.textContent =
        runs.length;


    }


}



// ================================
// バックアップ書き出し
// ================================


if(exportButton){


exportButton.addEventListener(

"click",

()=>{


    if(
        runs.length===0
    ){

        alert(
            "保存データがありません"
        );

        return;

    }



    const blob =
    new Blob(

        [

        JSON.stringify(
            runs,
            null,
            2
        )

        ],

        {
            type:
            "application/json"
        }

    );



    const url =
    URL.createObjectURL(
        blob
    );



    const a =
    document.createElement(
        "a"
    );


    a.href=url;


    a.download =
    "gakumas_event_backup.json";


    a.click();


    URL.revokeObjectURL(
        url
    );


});


}



// ================================
// バックアップ復元
// ================================


if(importButton){


importButton.addEventListener(

"click",

()=>{


    if(
        !importFile.files.length
    ){

        alert(
            "ファイルを選択してください"
        );

        return;

    }



    const reader =
    new FileReader();



    reader.onload =
    function(e){


        try{


            const data =
            JSON.parse(
                e.target.result
            );



            if(
                !Array.isArray(data)
            ){

                throw new Error();

            }



            runs =
            runs.concat(
                data
            );



            localStorage.setItem(

                "gakumasRuns",

                JSON.stringify(
                    runs
                )

            );



            updateRunCount();



            alert(
                data.length +
                "件追加しました"
            );



        }

        catch{


            alert(
                "読み込み失敗"
            );


        }


    };



    reader.readAsText(
        importFile.files[0]
    );


});


}



// ================================
// データ削除
// ================================


if(clearButton){


clearButton.addEventListener(

"click",

()=>{


    if(
        confirm(
        "保存データを削除しますか？"
        )
    ){


        runs=[];


        localStorage.removeItem(
            "gakumasRuns"
        );


        updateRunCount();


    }


});


}
// ================================
// 解析
// ================================


if(analyzeButton){


analyzeButton.addEventListener(

"click",

analyze

);


}



function analyze(){



    let remainResult={};

    let weekResult={};

    let matrixResult={};



    runs.forEach(run=>{


        const name =
        run.scenario;
        if(
    !matrixResult[name]
){

    matrixResult[name]=[];

}



        if(
            !remainResult[name]
        ){

            remainResult[name]={

                count:0

            };


        }



        if(
            !weekResult[name]
        ){

            weekResult[name]={

                weeks:[]

            };


            const maxWeeks =
            scenarios[name];



            for(
                let i=0;
                i<maxWeeks;
                i++
            ){


                weekResult[name]
                .weeks[i]={

                    total:0,

                    hit:0

                };


            }
            


        }




        remainResult[name]
        .count++;



        let remain =
        run.totalEvents;



        run.weeks.forEach(

        (value,index)=>{


            // 週別集計

            if(
                weekResult[name]
                .weeks[index]
            ){


                weekResult[name]
                .weeks[index]
                .total++;



                if(value===1){


                    weekResult[name]
                    .weeks[index]
                    .hit++;


                }


            }




            // 残りイベント数別集計

            if(
                !remainResult[name]
                [remain]
            ){


                remainResult[name]
                [remain]={

                    total:0,

                    hit:0

                };


            }



            remainResult[name]
            [remain]
            .total++;



            if(value===1){


                remainResult[name]
                [remain]
                .hit++;


                remain--;


            }



        });



    });



    displaySummary(
        remainResult
    );


    displayRemainResult(
        remainResult
    );


    displayWeekResult(
        weekResult
    );
    analyzeMatrix();

}






// ================================
// 解析人数表示
// ================================


function displaySummary(data){



    let html="";



    Object.keys(data)
    .forEach(name=>{


        html +=

        `<h3>${name}</h3>`;


        html +=

        "解析育成数：" +

        data[name].count +

        "回<br>";



    });



    const area =
    document.getElementById(
        "analysisSummary"
    );


    if(area){

        area.innerHTML =
        html;

    }


}





// ================================
// 残りイベント数別表示
// ================================


function displayRemainResult(data){



    let html="";



    Object.keys(data)
    .forEach(name=>{


        html +=

        `<h3>${name} 残りイベント別</h3>`;


        html +=

        `

        <table border="1">

        <tr>

        <th>残り</th>

        <th>試行</th>

        <th>発生</th>

        <th>確率</th>

        </tr>

        `;



        Object.keys(data[name])

        .filter(
            key=>key!=="count"
        )

        .sort(
            (a,b)=>b-a
        )


        .forEach(key=>{


            const r =
            data[name][key];



            const rate =
            (
                r.hit /
                r.total *
                100

            ).toFixed(2);



            html +=

            `

            <tr>

            <td>${key}</td>

            <td>${r.total}</td>

            <td>${r.hit}</td>

            <td>${rate}%</td>

            </tr>

            `;


        });



        html +=

        "</table>";



    });



    const area =
    document.getElementById(
        "result"
    );


    if(area){

        area.innerHTML =
        html;

    }


}





// ================================
// 週別発生率表示
// ================================


function displayWeekResult(data){



    let html="";



    Object.keys(data)
    .forEach(name=>{


        html +=

        `<h3>${name} 週別発生率</h3>`;



        html +=

        `

        <table border="1">

        <tr>

        <th>週</th>

        <th>試行</th>

        <th>発生</th>

        <th>確率</th>

        </tr>

        `;



        data[name]
        .weeks
        .forEach(

        (week,index)=>{


            if(
                week.total===0
            ){

                return;

            }



            const rate =

            (

            week.hit /

            week.total *

            100

            )

            .toFixed(2);



            html +=

            `

            <tr>

            <td>${index+1}週</td>

            <td>${week.total}</td>

            <td>${week.hit}</td>

            <td>${rate}%</td>

            </tr>

            `;


        });



        html +=

        "</table>";



    });



    const area =
    document.getElementById(
        "weekResult"
    );


    if(area){

        area.innerHTML =
        html;

    }


}
// =================================
// Ver1.6 残りイベント数×週解析
// =================================


function analyzeMatrix(){


    let data={};



    runs.forEach(run=>{


        const name =
        run.scenario;



        if(!data[name]){


            data[name]={};


        }



        let remain =
        run.totalEvents;



        run.weeks.forEach(

        (value,index)=>{


            if(!data[name][remain]){


                data[name][remain]={};


            }



            if(!data[name][remain][index]){


                data[name][remain][index]={

                    total:0,

                    hit:0

                };


            }



            data[name][remain][index]
            .total++;



            if(value===1){


                data[name][remain][index]
                .hit++;


                remain--;


            }


        });



    });



    displayMatrixResult(
        data
    );


}
function displayMatrixResult(data){


    let html="";


    Object.keys(data)
    .forEach(name=>{


        html +=

        `<h3>${name} 残りイベント数×週</h3>`;


        const maxWeeks =
        scenarios[name];



        html +=

        `<table border="1">

        <tr>

        <th>残り＼週</th>`;


        for(
            let w=0;
            w<maxWeeks;
            w++
        ){

            html +=

            `<th>${w+1}</th>`;

        }


        html += "</tr>";



        Object.keys(data[name])

        .sort(
            (a,b)=>b-a
        )

        .forEach(remain=>{


            html +=

            `<tr><td>${remain}</td>`;


            for(
                let w=0;
                w<maxWeeks;
                w++
            ){


                const cell =
                data[name][remain][w];



                if(
                    !cell ||
                    cell.total===0
                ){

                    html +=

                    "<td>-</td>";

                    continue;

                }



                const rate =
                (
                    cell.hit /
                    cell.total *
                    100

                ).toFixed(1);



                html +=

                `<td>${rate}%</td>`;


            }


            html += "</tr>";


        });



        html += "</table>";


    });



    const area =
    document.getElementById(
        "matrixResult"
    );


    if(area){

        area.innerHTML =
        html;

    }


}