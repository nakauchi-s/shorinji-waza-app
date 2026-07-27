// =====================================
// 少林寺拳法 技抽出アプリ Ver.2.0
// =====================================
let wazaList = [];
let punchMaster = [];
let rankMaster = [];
let categoryMaster = [];
let remainingList = [];
let historyList = [];
let currentWaza = null;
let dataLoaded = false;

// =====================================
// 起動処理
// =====================================
window.addEventListener(
    "DOMContentLoaded",
    () => {
        loadData();
    }
);

// =====================================
// JSON読込
// =====================================
async function loadData(){
    try{
        wazaList =
        await fetch(
            "./data/waza.json"
        )
        .then(
            r => r.json()
        );

        punchMaster =
        await fetch(
            "./data/punch.json"
        )
        .then(
            r => r.json()
        );

        rankMaster =
        await fetch(
            "./data/rank.json"
        )
        .then(
            r => r.json()
        );

        categoryMaster =
        await fetch(
            "./data/category.json"
        )
        .then(
            r => r.json()
        );

        dataLoaded = true;

        console.log(
            "データ読込完了",
            wazaList.length
        );

        createPunchArea();
        createRankArea();
        createCategoryArea();
        setDefaultCondition();
    }
    catch(e){
        console.error(e);
        alert(
            "データ読込エラー"
        );
    }
}

// =====================================
// 拳系チェックボックス作成
// =====================================
function createPunchArea(){
    const area =
    document.getElementById(
        "punchArea"
    );
    area.innerHTML="";
    // 全て
    let all =
    document.createElement(
        "label"
    );

    all.innerHTML =
    `
    <input 
    type="checkbox"
    id="allPunch"
    checked>
    全て
    `;
    area.appendChild(all);

    punchMaster.forEach(
        p => {
            let label =
            document.createElement(
                "label"
            );
            label.innerHTML =
            `
            <input
            type="checkbox"
            name="punch"
            value="${p.拳系CD}"
            checked>
            ${p.拳系}
            `;
            area.appendChild(
                label
            );
        }
    );
    document
    .getElementById(
        "allPunch"
    )
    .addEventListener(
        "change",
        e=>{
            document
            .querySelectorAll(
                "input[name='punch']"
            )
            .forEach(
                c=>{
                    c.checked =
                    e.target.checked;
                }
            );
        }
    );
    document
    .querySelectorAll(
        "input[name='punch']"
    )
    .forEach(
        c=>{
            c.addEventListener(
                "change",
                ()=>{
                    let all =
                    [
                        ...
                        document
                        .querySelectorAll(
                            "input[name='punch']"
                        )
                    ]
                    .every(
                        x=>x.checked
                    );
                    document
                    .getElementById(
                        "allPunch"
                    )
                    .checked =
                    all;
                }
            );
        }
    );
}

// =====================================
// 階級プルダウン作成
// =====================================
function createRankArea(){
    let start =
    document.getElementById(
        "rankStart"
    );

    let end =
    document.getElementById(
        "rankEnd"
    );

    start.innerHTML="";
    end.innerHTML="";

    rankMaster.forEach(
        r=>{
            let o1 =
            document.createElement(
                "option"
            );
            o1.value =
            r.階級CD;
            o1.text =
            r.階級;
            start.appendChild(o1);
            let o2 =
            o1.cloneNode(true);
            end.appendChild(o2);
        }
    );
}

// =====================================
// 分類作成
// =====================================
function createCategoryArea(){
    let select =
    document.getElementById(
        "categorySelect"
    );
    select.innerHTML="";
    let all =
    document.createElement(
        "option"
    );
    all.value="";
    all.text="全て";
    select.appendChild(all);
    categoryMaster.forEach(
        c=>{
            let o =
            document.createElement(
                "option"
            );
            o.value =
            c.分類CD;
            o.text =
            c.分類;
            select.appendChild(o);
        }
    );
}
// =====================================
// 初期条件設定
// =====================================
function setDefaultCondition(){
    document
    .getElementById(
        "allPunch"
    )
    .checked = true;
    document
    .querySelectorAll(
        "input[name='punch']"
    )
    .forEach(
        c=>{
            c.checked=true;
        }
    );
    document
    .getElementById(
        "rankStart"
    )
    .value = rankMaster[0].階級CD;
    document
    .getElementById(
        "rankEnd"
    )
    .value =
    rankMaster[
        rankMaster.length-1
    ].階級CD;
    document
    .getElementById(
        "categorySelect"
    )
    .value="";
}

// =====================================
// 抽出処理
// =====================================

function extractWaza(){

    console.log(
        "★★ extractWaza実行 ★★"
    );

    if(!dataLoaded){
        alert(
            "データ読込中です"
        );
        return;
    }

    // 先に抽出対象を取得する
    let list =
    getTargetList();
    console.log(
        "抽出対象:",
        list.length
    );

    if(list.length === 0){
        alert(
            "該当する技がありません"
        );
        return;
    }

    // 未出題リスト作成
    remainingList =
    [...list];
    console.log(
        "抽出セット:",
        remainingList.length
    );
    document
    .getElementById(
        "remainingCount"
    )
    .textContent =
    remainingList.length;

    historyList = [];
    currentWaza = null;

    // 1件目表示
    nextWaza();

    // 条件エリアを閉じる
    const area =
    document.getElementById(
        "conditionArea"
    );

    if(area){
        area.open=false;
    }
}

// =====================================
// 条件判定
// =====================================
function getTargetList(){
    let selectedPunch =
    [
        ...
        document
        .querySelectorAll(
            "input[name='punch']:checked"
        )
    ]
    .map(
        x => Number(x.value)
    );

    let punchAll =
    document
    .getElementById(
        "allPunch"
    )
    .checked;

    let start =
    Number(
        document
        .getElementById(
            "rankStart"
        )
        .value
    );

    let end =
    Number(
        document
        .getElementById(
            "rankEnd"
        )
        .value
    );

    if(start > end){
        let tmp = start;
        start = end;
        end = tmp;
    }

    let category =
    document
    .getElementById(
        "categorySelect"
    )
    .value;

    // =========================
    // デバッグログ
    // =========================
    console.log(
        "===== 条件確認 ====="
    );

    console.log(
        "拳系全て:",
        punchAll
    );

    console.log(
        "選択拳系:",
        selectedPunch
    );

    console.log(
        "階級範囲:",
        start,
        "～",
        end
    );

    console.log(
        "分類:",
        category
    );

    console.log(
        "1件目データ:",
        wazaList[0]
    );

    // =========================
    // 抽出
    // =========================
    let result =
    wazaList.filter(
        waza => {
            let punchOK =
            punchAll
            ||
            selectedPunch.includes(
                Number(
                    waza.拳系CD
                )
            );

            let rankOK =
            Number(
                waza.階級CD
            )
            >=
            start
            &&
            Number(
                waza.階級CD
            )
            <=
            end;

            let categoryOK =
            (
                category === ""
                ||
                category === null
                ||
                category === undefined
            )
            ||
            (
                Number(
                    waza.分類CD
                )
                ===
                Number(
                    category
                )
            );

            // 最初の5件だけ詳細表示
            if(
                waza.ID <= 5
            ){
                console.log(
                    "判定:",
                    {
                        ID:waza.ID,
                        拳系:waza.拳系,
                        拳系CD:waza.拳系CD,
                        階級:waza.階級,
                        階級CD:waza.階級CD,
                        分類:waza.分類,
                        分類CD:waza.分類CD,
                        punchOK,
                        rankOK,
                        categoryOK
                    }
                );
            }
            return (
                punchOK
                &&
                rankOK
                &&
                categoryOK
            );
        }
    );
    console.log(
        "最終抽出件数:",
        result.length
    );
    return result;
}

// =====================================
// 次の技
// =====================================
function nextWaza(){
    console.log(
        "nextWaza実行"
    );
    console.log(
        "残り件数:",
        remainingList.length
    );
    if(remainingList.length === 0){
        alert(
            "条件内の技をすべて出題しました"
        );
        return;
    }
    let index =
    Math.floor(
        Math.random()
        *
        remainingList.length
    );
    currentWaza =
    remainingList[index];
    remainingList.splice(
        index,
        1
    );
    console.log(
        "削除後残り:",
        remainingList.length
    );
    document
    .getElementById(
        "remainingCount"
    )
    .textContent =
    remainingList.length;
    historyList.push(
        currentWaza
    );
    displayWaza();
    readWaza();
}

// =====================================
// 技表示
// =====================================
function displayWaza(){
    let w=currentWaza;
    document
    .getElementById(
        "wazaName"
    )
    .textContent =
    w.技名;
    document
    .getElementById(
        "yomi"
    )
    .textContent =
    w.読み;
    document
    .getElementById(
        "punch"
    )
    .textContent =
    w.拳系;
    document
    .getElementById(
        "rank"
    )
    .textContent =
    w.階級;
    document
    .getElementById(
        "category"
    )
    .textContent =
    w.分類;
    document
    .getElementById(
        "kamae"
    )
    .textContent =
    w.構え;
    document
    .getElementById(
        "attacker"
    )
    .textContent =
    w.攻者構え;
    document
    .getElementById(
        "attack"
    )
    .textContent =
    w.攻撃方法;
    document
    .getElementById(
        "defender"
    )
    .textContent =
    w.守者構え;
    document
    .getElementById(
        "method"
    )
    .textContent =
    w.守法;
    document
    .getElementById(
        "page"
    )
    .textContent =
    w.教範頁;
}

// =====================================
// リセット
// 抽出履歴・表示内容を完全クリア
// =====================================

function resetWaza(){

    // 抽出管理を完全初期化
    remainingList = [];
    historyList = [];
    currentWaza = null;

    // 音声停止
    speechSynthesis.cancel();

    // 表示クリア
    const clearIds = [
        "wazaName",
        "yomi",
        "punch",
        "rank",
        "category",
        "kamae",
        "attacker",
        "attack",
        "defender",
        "method",
        "page"
    ];
    clearIds.forEach(
        id => {
            document
            .getElementById(id)
            .textContent =
            "";
        }
    );

    document
    .getElementById(
        "wazaName"
    )
    .textContent =
    "技名";

    document
    .getElementById(
        "remainingCount"
    )
    .textContent =
    "0";
}

// =====================================
// 条件クリア
// =====================================
function clearCondition(){
    setDefaultCondition();
    document
    .getElementById(
        "categorySelect"
    )
    .value="";
    // 条件編集できるよう開く
    document
    .getElementById(
        "conditionArea"
    )
    .open = true;
}

// =====================================
// 音声
// =====================================
function readWaza(){
    if(!currentWaza){
        return;
    }
    let mode =
    document
    .getElementById(
        "voiceSelect"
    )
    .value;
    if(mode!=="on"){
        return;
    }
    speechSynthesis.cancel();
    let utter =
    new SpeechSynthesisUtterance(
        currentWaza.読み
    );
    utter.lang="ja-JP";
    utter.rate=0.85;
    speechSynthesis.speak(
        utter
    );
}

// =====================================
// PDF表示
// =====================================
function openPDF(){
    if(!currentWaza){
        return;
    }
    window.open(
        "./pdf/"
        +
        currentWaza["PDFファイル"]
    );
}

// =====================================
// 再読み上げ
// =====================================
function reread(){
    readWaza();
}

// =====================================
// イベント登録
// =====================================
document.addEventListener(
    "DOMContentLoaded",
()=>{
        document
        .getElementById(
        "extractBtn"
        )
        .addEventListener(
        "click",
        extractWaza
        );

        document
        .getElementById(
        "nextBtn"
        )
        .addEventListener(
        "click",
        nextWaza
        );

        document
        .getElementById(
        "resetBtn"
        )
        .addEventListener(
        "click",
        resetWaza
        );

        document
        .getElementById(
        "clearBtn"
        )
        .addEventListener(
        "click",
        clearCondition
        );

        document
        .getElementById(
        "readBtn"
        )
        .addEventListener(
        "click",
        reread
        );

        document
        .getElementById(
        "pdfBtn"
        )
        .addEventListener(
        "click",
        openPDF
        );
    }
);
