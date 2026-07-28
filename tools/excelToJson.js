const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// ==============================
// 設定
// ==============================
const excelFile =
    path.join(
        __dirname,
        "../excel/技リスト.xlsx"
    );

const outputDir =
    path.join(
        __dirname,
        "../data"
    );

// dataフォルダ作成
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// ==============================
// Excel読込
// ==============================
const workbook =
    XLSX.readFile(excelFile);

// シート読込関数
function readSheet(sheetName){
    const sheet =
        workbook.Sheets[sheetName];
    if(!sheet){
        console.error(
            `${sheetName} がありません`
        );
        return [];
    }

    return XLSX.utils.sheet_to_json(
        sheet,
        {
            defval:""
        }
    );
}

// ==============================
// JSON保存
// ==============================
function saveJson(
    fileName,
    data
){
    const filePath =
        path.join(
            outputDir,
            fileName
        );

    fs.writeFileSync(
        filePath,
        JSON.stringify(
            data,
            null,
            2
        ),
        "utf-8"
    );

    console.log(
        `${fileName} : ${data.length}件`
    );
}

// ==============================
// 各データ生成
// ==============================
// 技リスト
const wazaList =
    readSheet("技リスト");

// 拳系マスタ
const punchList =
    readSheet("拳系マスタ");

// 階級マスタ
const rankList =
    readSheet("階級マスタ");

// 分類マスタ
const categoryList =
    readSheet("分類マスタ");

// 参考資料マスタ
const referenceList =
    readSheet("参考資料マスタ");

// ==============================
// JSON出力
// ==============================
saveJson(
    "waza.json",
    wazaList
);

saveJson(
    "punch.json",
    punchList
);

saveJson(
    "rank.json",
    rankList
);

saveJson(
    "category.json",
    categoryList
);

saveJson(
    "reference.json",
    referenceList
);

console.log(
    "Excel → JSON変換完了"
);