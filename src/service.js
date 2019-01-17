import _ from "lodash";
import tableify from "tableify";

export function bindMethods(component, names) {
  if (_.isString(names)) {
    names = [names];
  }
  names.forEach(name => (component[name] = component[name].bind(component)));
}

export function exportToCsv(filename, rows) {
  var processRow = function(row) {
    var finalVal = "";
    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? "" : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
      if (j > 0) finalVal += ",";
      finalVal += result;
    }
    return finalVal + "\n";
  };

  var csvFile = "";
  console.log(rows);
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
export function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
  var CSV = "";
  //Set Report title in first row or line

  CSV += ReportTitle + "\r\n\n";

  //This condition will generate the Label/Header
  if (ShowLabel) {
    var row = "";

    //This loop will extract the label from 1st index of on array
    for (var index in arrData[0]) {
      //Now convert each value to string and comma-seprated
      row += index + ",";
    }

    row = row.slice(0, -1);

    //append Label row with line break
    CSV += row + "\r\n";
  }

  //1st loop is to extract each row
  for (var i = 0; i < arrData.length; i++) {
    var row = "";

    //2nd loop will extract each column and convert it in string comma-seprated
    for (var index in arrData[i]) {
      row += arrData[i][index] + ",";
    }

    row.slice(0, row.length - 1);

    //add a line break after each row
    CSV += row + "\r\n";
  }

  if (CSV == "") {
    alert("Invalid data");
    return;
  }
  return CSV;
  //Generate a file name
  var fileName = "ECWID_COUPONS_";
  //this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g, "_");

  //Initialize file format you want csv or xls
  var uri = "data:text/csv;charset=utf-8," + CSV;
  var uri2 = "data:text/json;charset=utf-8," + JSON.stringify(JSONData);

  // Now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension

  //this trick will generate a temp <a /> tag
  var link = document.createElement("a");
  link.href = uri2;

  //set the visibility hidden so it will not effect on your web-layout
  link.style = "visibility:hidden";
  link.download = fileName + ".json";

  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  var url =
    "data:text/json;charset=utf8," +
    encodeURIComponent(JSON.stringify(JSONData));
  window.open(url, "_blank");
  window.focus();
}

var _table_ = document.createElement("table"),
  _tr_ = document.createElement("tr"),
  _th_ = document.createElement("th"),
  _td_ = document.createElement("td");

// Builds the HTML Table out of myList json data from Ivy restful service.
function buildHtmlTable(arr) {
  var table = _table_.cloneNode(false),
    columns = addAllColumnHeaders(arr, table);
  for (var i = 0, maxi = arr.length; i < maxi; ++i) {
    var tr = _tr_.cloneNode(false);
    for (var j = 0, maxj = columns.length; j < maxj; ++j) {
      var td = _td_.cloneNode(false);
      td.appendChild(document.createTextNode(arr[i][columns[j]] || ""));
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records
function addAllColumnHeaders(arr, table) {
  var columnSet = [],
    tr = _tr_.cloneNode(false);
  for (var i = 0, l = arr.length; i < l; i++) {
    for (var key in arr[i]) {
      if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
        columnSet.push(key);
        var th = _th_.cloneNode(false);
        th.appendChild(document.createTextNode(key));
        tr.appendChild(th);
      }
    }
  }
  table.appendChild(tr);
  return columnSet;
}

export function openDataPage(json, title) {
  const container = function(title, data) {
    return `<div>
        <h1>${title}</h1>
          <div style="padding: 20px;
                      background: rgba(0,0,0,.1);
                      border-radius: 8px;
                      margin-bottom: 40px;"
          >
            ${data}
          </div>
      </div>
      `;
  };
  const _JSON_ = container(`JSON: ${title}`, JSON.stringify(json));
  const _CSV_ = container(`CSV: ${title}`, JSONToCSVConvertor(json, title));
  const _TABLE_ = container(`TABLE: ${title}`, tableify(json));

  const html = `<html>
      <head>
        <style>
          table{
            border-collapse: collapse;
          }
          td,th{
            border: 1px solid gray;
            padding: 5px;
          }
        </style>
      </head>
      <body>
        ${_JSON_}
        ${_CSV_}
        ${_TABLE_}
      </body>
    </html>`;

  var uri = "data:text/html;charset=utf8," + encodeURIComponent(html);
  var newWindow = window.open(uri);
}
