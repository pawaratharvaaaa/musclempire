# Google Apps Script — Full Updated Code

## Steps
1. Open your Google Sheet → **Extensions** → **Apps Script**
2. Delete ALL existing code
3. Paste the full code below
4. Save → **Deploy** → **New Deployment** (Web App, Execute as Me, Anyone)
5. Copy URL → paste into `src/lib/sheets.ts` → `APPS_SCRIPT_URL`

---

## Full Script (paste this)

```javascript
const SHEET_NAME = "Assessments";

const HEADERS = [
  "ID","Date","Name","Phone","Email","Age","Gender","Weight","Height",
  "BMI","BMI Category","Wake Time","Bed Time","Sleep Duration","Workout Time",
  "Duty","Rest Time",
  "Target Weight","Weight Change","Food Pref","College Time","Work Time",
  "Medical Conditions","Allergies","Supplements","Goals","Remarks","Status",
  "Food History",
  "Early Morning","Breakfast","Mid Morning","Lunch","Evening Snack",
  "Pre Workout","Post Workout","Dinner","Before Bed","Supplements Plan","Notes"
];

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#FFD000");
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#FFD000");
  }
  return sheet;
}

function getConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Config");
  if (!sheet) {
    sheet = ss.insertSheet("Config");
    sheet.appendRow(["adminPassword", "MuscleEmpire@2026"]);
  }
  return sheet;
}

var ADMIN_TOKEN = "ME9773GYM";

function handleRequest(e) {
  var p = (e && e.parameter) ? e.parameter : {};

  // Parse POST JSON body if sent via POST
  if (e && e.postData && e.postData.contents) {
    try {
      var body = JSON.parse(e.postData.contents);
      Object.keys(body).forEach(function(k) {
        p[k] = body[k];
      });
    } catch (err) {}
  }

  var action = p.action;

  if (action === "getPassword" || action === "setPassword") {
    if (p.token !== ADMIN_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: "Unauthorized" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (action === "getPassword") {
    var cfg = getConfig();
    var val = cfg.getRange(1, 2).getValue();
    return ContentService
      .createTextOutput(JSON.stringify({ password: String(val) }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "setPassword") {
    var cfg = getConfig();
    cfg.getRange(1, 2).setValue(p.password);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "enquiry") {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var eSheet = ss.getSheetByName("Enquiries");
    if (!eSheet) {
      eSheet = ss.insertSheet("Enquiries");
      eSheet.appendRow(["Date", "Name", "Phone", "Age", "Goal", "Notes"]);
      eSheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#FFD000");
    }
    eSheet.appendRow([p.date || "", p.name || "", p.phone || "", p.age || "", p.goal || "", p.notes || ""]);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "submit") {
    var sheet = getSheet();
    var nextId = sheet.getLastRow();
    sheet.appendRow([
      p.id || String(nextId),
      p.date || new Date().toLocaleDateString(),
      p.name || "", p.phone || "", p.email || "", p.age || "", p.gender || "",
      p.weight || "", p.height || "", p.bmi || "", p.bmiCategory || "",
      p.wakeTime || "", p.bedTime || "", p.sleepDuration || "", p.workoutTime || "",
      p.duty || "", p.restTime || "",
      p.targetWeight || "", p.weightChange || "", p.foodPref || "",
      p.collegeTime || "", p.workTime || "", p.medicalConditions || "",
      p.allergies || "", p.supplements || "", p.goals || "", p.remarks || "",
      p.status || "New",
      p.foodHistory || "",
      p.earlyMorning || "", p.breakfast || "", p.midMorning || "",
      p.lunch || "", p.eveningSnack || "", p.preWorkout || "",
      p.postWorkout || "", p.dinner || "", p.beforeBed || "",
      p.supplementsPlan || "", p.notes || ""
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "list") {
    var sheet = getSheet();
    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ data: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var rows = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    var displayRows = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getDisplayValues();
    var data = rows.map(function(row, i) {
      var d = displayRows[i];
      return {
        _rowIndex: i,
        id: String(row[0]), date: String(row[1]), name: String(row[2]),
        phone: String(row[3]), email: String(row[4]), age: String(row[5]),
        gender: String(row[6]), weight: String(row[7]), height: String(row[8]),
        bmi: String(row[9]), bmiCategory: String(row[10]),
        wakeTime: String(d[11]), bedTime: String(d[12]),
        sleepDuration: String(row[13]), workoutTime: String(d[14]),
        duty: String(row[15]), restTime: String(d[16]),
        targetWeight: String(row[17]), weightChange: String(row[18]),
        foodPref: String(row[19]), collegeTime: String(row[20]),
        workTime: String(row[21]), medicalConditions: String(row[22]),
        allergies: String(row[23]), supplements: String(row[24]),
        goals: String(row[25]), remarks: String(row[26]),
        status: String(row[27]),
        foodHistory: String(row[28]),
        earlyMorning: String(row[29]), breakfast: String(row[30]),
        midMorning: String(row[31]), lunch: String(row[32]),
        eveningSnack: String(row[33]), preWorkout: String(row[34]),
        postWorkout: String(row[35]), dinner: String(row[36]),
        beforeBed: String(row[37]), supplementsPlan: String(row[38]),
        notes: String(row[39])
      };
    });
    return ContentService
      .createTextOutput(JSON.stringify({ data: data }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "update") {
    var sheet = getSheet();
    var rowNum = parseInt(p.rowIndex) + 2;
    var colMap = {
      status: 28, foodHistory: 29,
      earlyMorning: 30, breakfast: 31, midMorning: 32,
      lunch: 33, eveningSnack: 34, preWorkout: 35, postWorkout: 36,
      dinner: 37, beforeBed: 38, supplementsPlan: 39, notes: 40
    };
    Object.keys(colMap).forEach(function(key) {
      if (p[key] !== undefined && p[key] !== null) {
        sheet.getRange(rowNum, colMap[key]).setValue(p[key]);
      }
    });
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "deleteRow") {
    var sheet = getSheet();
    var rowNum = parseInt(p.rowIndex) + 2;
    if (rowNum >= 2 && rowNum <= sheet.getLastRow()) {
      sheet.deleteRow(rowNum);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "getCoupons") {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cSheet = ss.getSheetByName("Coupons");
    if (!cSheet || cSheet.getLastRow() < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({ coupons: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var rows = cSheet.getRange(2, 1, cSheet.getLastRow() - 1, 6).getValues();
    var coupons = rows.filter(function(r) { return r[0]; }).map(function(r) {
      return {
        id: String(r[0]),
        code: String(r[1]),
        discount: Number(r[2]),
        plans: r[3] ? String(r[3]).split(",").map(function(s) { return s.trim(); }).filter(Boolean) : [],
        enabled: String(r[4]).toLowerCase() === "true" || r[4] === true,
        description: String(r[5] || "")
      };
    });
    return ContentService
      .createTextOutput(JSON.stringify({ coupons: coupons }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "saveCoupons") {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var cSheet = ss.getSheetByName("Coupons");
    if (!cSheet) {
      cSheet = ss.insertSheet("Coupons");
    }
    cSheet.clearContents();
    cSheet.appendRow(["ID", "Code", "Discount %", "Plans", "Enabled", "Description"]);
    cSheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#FFD000");
    try {
      var coupons = JSON.parse(p.data || "[]");
      coupons.forEach(function(c) {
        cSheet.appendRow([
          c.id || "", c.code || "", c.discount || 0,
          Array.isArray(c.plans) ? c.plans.join(", ") : "",
          c.enabled === true ? "true" : "false",
          c.description || ""
        ]);
      });
    } catch (err) {}
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "getOffers") {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var oSheet = ss.getSheetByName("Offers");
    if (!oSheet || oSheet.getLastRow() < 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ offers: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    try {
      var val = oSheet.getRange(1, 1).getValue();
      return ContentService
        .createTextOutput(JSON.stringify({ offers: JSON.parse(String(val)) }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ offers: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  if (action === "saveOffers") {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var oSheet = ss.getSheetByName("Offers");
    if (!oSheet) oSheet = ss.insertSheet("Offers");
    oSheet.clearContents();
    oSheet.getRange(1, 1).setValue(p.data || "[]");
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "getVideos") {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var vSheet = ss.getSheetByName("Videos");
    if (!vSheet || vSheet.getLastRow() < 2) {
      return ContentService
        .createTextOutput(JSON.stringify({ videos: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var rows = vSheet.getRange(2, 1, vSheet.getLastRow() - 1, 3).getValues();
    var videos = rows.filter(function(r) { return r[0]; }).map(function(r) {
      return { id: String(r[0]), src: String(r[1]), alt: String(r[2] || "") };
    });
    return ContentService
      .createTextOutput(JSON.stringify({ videos: videos }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "saveVideos") {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var vSheet = ss.getSheetByName("Videos");
    if (!vSheet) vSheet = ss.insertSheet("Videos");
    vSheet.clearContents();
    vSheet.appendRow(["ID", "URL / Source", "Caption"]);
    vSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#FFD000");
    try {
      var videos = JSON.parse(p.data || "[]");
      videos.forEach(function(v) {
        vSheet.appendRow([v.id || "", v.src || "", v.alt || ""]);
      });
    } catch (err) {}
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ error: "Unknown action" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}