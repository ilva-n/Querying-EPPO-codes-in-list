(function () {
String.prototype.capitalize1st = function() {
  return this[0].toUpperCase() + this.substring(1).toLowerCase();
};
// to take input of short list copied into text area
const submitNames = function() {
  const inputNames = document.getElementById("shortTable").value
  if (!inputNames) { 
    alert("box is empty! put bot names there!")
  } 
  else {
  areaInputNames.bot_names = inputNames.split("\n");
    let paragr = document.createElement("p");
    //paragr.setAttribute("id", "answerWait");
    paragr.textContent = "Wait for a while for answer please";
    document.body.appendChild(paragr);
    areaInputNames.bot_names = areaInputNames.bot_names.filter(Boolean);

    //options for post request with fetch
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(areaInputNames)
      };
      fetchAndHandle1stResponse(options, paragr);
  }
};

const shorten3 = function (word) {
  return word.substring(0, word.length - 4);
};

const createButton2 = () => {
  let button2 = document.createElement("button");
          button2.type = "button";
          button2.setAttribute("id", "button2");
          button2.innerHTML = "submit not found names repeatedly";
          document.body.insertBefore(button2, document.getElementById("resultTablePlace"));
          button2.addEventListener("click", reduceNotFoundNames, {once: true});
};

let contentType = 'text/csv';

const createFirstResultTableAndCSV = (response) => {
  document.getElementById("startPage").innerHTML = "";
  let tableTemplate1 = document.getElementById("resulttable1");        
  let resultsTable = tableTemplate1.content.cloneNode(true);
  let newDivTable = document.createElement("div");
  newDivTable.setAttribute("id", "mainResults");
  document.getElementById("resultTablePlace").appendChild(newDivTable);
  newDivTable.appendChild(resultsTable);
  let table1Body = newDivTable.querySelector("tbody");
 
  let table1 = newDivTable.querySelector("table");
 
  let csv_result1 = "Bot name you sent, EPPO code if found\n";     
    for (let i = 0; i < response.length; i++) {
      let name = response[i].incommingName;
      let code = response[i].eppocode;
      let tableRow = document.createElement("tr");
      table1Body.appendChild(tableRow);
      let nameForTable = document.createElement("td");
      let codeForTable = document.createElement("td");
      nameForTable.textContent = name;
      codeForTable.textContent = code;
      tableRow.appendChild(nameForTable);
      tableRow.appendChild(codeForTable);
      csv_result1 += `${name},${code}`;
      csv_result1 += "\n";
        if (code === 'not found') {
          notMatchingBotnames.push(name);
        }
    }
    //create csv download link
    window.URL = window.webkitURL || window.URL;
    let csvFile_1result = new Blob([csv_result1], {type: contentType});
    let a_rez = document.createElement('a');
    a_rez.download = 'results_csv.csv';
    a_rez.href = window.URL.createObjectURL(csvFile_1result);
    a_rez.textContent = 'Download first results as CSV';
    a_rez.dataset.downloadurl = [contentType, a_rez.download, a_rez.href].join(':');
    let p_rez1 = document.createElement("p");
    document.body.insertBefore(p_rez1, document.getElementById("resultTablePlace"));
    p_rez1.appendChild(a_rez);
};

const fetchAndHandle1stResponse = (options, anouncement) => {
  fetch('/namesFromFile', options).then(response => {
        return response.json();
        }).then((response) => {
          console.log(response);
          anouncement.remove();
          document.body.appendChild(document.createElement("p")).setAttribute("id", "resultTablePlace");
          let resultNotFoundCheck = response.filter(botName => botName.eppocode === "not found");
          if (resultNotFoundCheck.length >= 1) {
            createButton2();
          }
          // to show first search results in table on screen
          createFirstResultTableAndCSV(response);
        });
};

const showHideTable1 = () => {
  let table = document.getElementById("results1");
  if (table.style.display === "none") {
    table.style.display = "block";
  } else {
    table.style.display = "none";
  }
};

const showHideTable2 = () => {
  let table = document.getElementById("results2");
  if (table.style.display === "none") {
    table.style.display = "block";
  } else {
    table.style.display = "none";
  }
};

const showHideTable3 = () => {
  let table = document.getElementById("results3");
  if (table.style.display === "none") {
    table.style.display = "block";
  } else {
    table.style.display = "none";
  }
};
const showHideTable4 = () => {
  let table = document.getElementById("results4");
  if (table.style.display === "none") {
    table.style.display = "block";
  } else {
    table.style.display = "none";
  }
};

const show1rezultsOnscreen = () => {
  let tableTemplate1 = document.getElementById("resulttable1");        
  let resultsTable = tableTemplate1.content.cloneNode(true);
  let newDivTable = document.createElement("div");
  newDivTable.setAttribute("id", "results1");
  document.getElementById("p1").appendChild(newDivTable);
  newDivTable.appendChild(resultsTable);
  let tableHeadrow = newDivTable.querySelectorAll("th");
  tableHeadrow[0].innerHTML = "Name in your list";
  tableHeadrow[1].innerHTML = "Fragment searched for";
  newDivTable.querySelector("tr").appendChild(document.createElement("th")).textContent = "suggestions";

  let tbody = newDivTable.querySelector("tbody");

    for (let i = 0; i < firstResult.length; i++) {
      let row = document.createElement("tr");
      tbody.appendChild(row);
        row.appendChild(document.createElement("td")).textContent = firstResult[i].nameAsItIs;
        row.appendChild(document.createElement("td")).textContent = firstResult[i].shortenedName;
        for (let j = 0; j < firstResult[i].results.length; j++) {
          row.appendChild(document.createElement("td")).textContent = firstResult[i].results[j].searchedName;
          row.appendChild(document.createElement("td")).textContent = firstResult[i].results[j].eppocode;
        }

    }
  document.getElementById("button1r").addEventListener("click", showHideTable1);
};

const show2rezultsOnscreen = () => {
  let tableTemplate1 = document.getElementById("resulttable1");        
  let resultsTable = tableTemplate1.content.cloneNode(true);
  let newDivTable = document.createElement("div");
  newDivTable.setAttribute("id", "results2");
  document.getElementById("p2").appendChild(newDivTable);
  newDivTable.appendChild(resultsTable);
  let tableHeadrow = newDivTable.querySelectorAll("th");
  tableHeadrow[0].innerHTML = "Name in your list";
  tableHeadrow[1].innerHTML = "Comment";
  newDivTable.querySelector("tr").appendChild(document.createElement("th")).textContent = "suggestions";
  let tbody = newDivTable.querySelector("tbody");

    for (let i = 0; i < secondResult.length; i++) {
      let row = document.createElement("tr");
      tbody.appendChild(row);
        row.appendChild(document.createElement("td")).textContent = secondResult[i].nameAsItIs;
        row.appendChild(document.createElement("td")).textContent = secondResult[i].word2;
        for (let j = 0; j < secondResult[i].results.length; j++) {
          row.appendChild(document.createElement("td")).textContent = secondResult[i].results[j].searchedName;
          row.appendChild(document.createElement("td")).textContent = secondResult[i].results[j].eppocode;
        }

    }
  document.getElementById("button2r").addEventListener("click", showHideTable2);
};

const show3rezultsOnScreen = () => {
  let tableTemplate1 = document.getElementById("resulttable1");        
  let resultsTable = tableTemplate1.content.cloneNode(true);
  let newDivTable = document.createElement("div");
  newDivTable.setAttribute("id", "results3");
  document.getElementById("p3").appendChild(newDivTable);
  newDivTable.appendChild(resultsTable);
  let tableHeadrow = newDivTable.querySelectorAll("th");
  tableHeadrow[0].innerHTML = "Name in your list";
  tableHeadrow[1].innerHTML = "Name searched for";
  newDivTable.querySelector("tr").appendChild(document.createElement("th")).textContent = "Code, if found";
  
  let tbody = newDivTable.querySelector("tbody");
    for (let i = 0; i < thirdResult.length; i++) {
      let row = document.createElement("tr");
      tbody.appendChild(row);
      row.appendChild(document.createElement("td")).textContent = thirdResult[i].nameAsItIs;
      row.appendChild(document.createElement("td")).textContent = thirdResult[i].nameToCheck;
      row.appendChild(document.createElement("td")).textContent = thirdResult[i].result.code;

    }
  document.getElementById("button3r").addEventListener("click", showHideTable3);
};


const show4rezultsOnscreen = () => {
  let tableTemplate1 = document.getElementById("resulttable1");        
  let resultsTable = tableTemplate1.content.cloneNode(true);
  let newDivTable = document.createElement("div");
  newDivTable.setAttribute("id", "results4");
  document.getElementById("p4").appendChild(newDivTable);
  newDivTable.appendChild(resultsTable);
  let tableHeadrow = newDivTable.querySelectorAll("th");
  tableHeadrow[0].innerHTML = "Name in your list";
  tableHeadrow[1].innerHTML = "Searched name";
  newDivTable.querySelector("tr").appendChild(document.createElement("th")).textContent = "code, if found";
  newDivTable.querySelector("tr").appendChild(document.createElement("th")).textContent = "suggested genus name";
  newDivTable.querySelector("tr").appendChild(document.createElement("th")).textContent = "suggested genus code";
  newDivTable.querySelector("tr").appendChild(document.createElement("th")).textContent = "unidentified species of genus";
  newDivTable.querySelector("tr").appendChild(document.createElement("th")).textContent = "unidectified sp of genus code";

  let tbody = newDivTable.querySelector("tbody");

    for (let i = 0; i < forthResult.length; i++) {
      let row = document.createElement("tr");
      tbody.appendChild(row);
        row.appendChild(document.createElement("td")).textContent = forthResult[i].nameAsItIs;
        row.appendChild(document.createElement("td")).textContent = forthResult[i].result.name;
        row.appendChild(document.createElement("td")).textContent = forthResult[i].result.code;
        row.appendChild(document.createElement("td")).textContent = forthResult[i].result.genusName;
        row.appendChild(document.createElement("td")).textContent = forthResult[i].result.genusCode;
        row.appendChild(document.createElement("td")).textContent = forthResult[i].result.genusNameSp;
        row.appendChild(document.createElement("td")).textContent = forthResult[i].result.genusCodeSp;

    }
  document.getElementById("button4r").addEventListener("click", showHideTable4);
};

// to take input of CSV file 
function handleFiles() {
  // The files property of an input element returns a FileList
    if (!selectedFile.files[0]) {
      alert("you have not chosen a file");
    } else {
        const reader = new FileReader();
          reader.readAsText(selectedFile.files[0]);
          reader.onload = function() {
            fileInputNames.bot_names = reader.result.split("\n");
            fileInputNames.bot_names = fileInputNames.bot_names.filter(Boolean);
            //options for post request with fetch
            const options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(fileInputNames)
            };
        
            let paragr = document.createElement("p");
            //paragr.setAttribute("id", "answerWait");
            paragr.textContent = "Wait for a while for answer please";
            document.body.appendChild(paragr);
      //POST request on file load
            fetchAndHandle1stResponse(options, paragr);
          };
    }
};

const selectedFile = document.getElementById("fileInput");
let fileInputNames = {};
let areaInputNames = {};
document.getElementById("shortTableInput").addEventListener("click", submitNames, {once: true});

document.getElementById("fileInputButton").addEventListener("click", handleFiles, {once: true});


let notMatchingBotnames = [];
let firstResult = [];
let secondResult = [];
let thirdResult = [];
let forthResult = [];

const reduceNotFoundNames = function() {
  document.getElementById("startPage").innerHTML = "WAIT!";
  let shortenedNamesToCheck = [];
  let toCheckAuthors = [];
  let toCheckInfraspecNames = [];
  let genusSpeciesNames = [];
  document.getElementById("mainResults").style.display = "none";
  document.getElementById("button2").style.display = "none";
  
  for (let i = 0; i < notMatchingBotnames.length; i++) {
    name = notMatchingBotnames[i];
    let splitName = name.split(/\s/);
    // if non matching botanic name consists of one word
    if (splitName.length === 1) {
      // create an object with one property - given bot name and other property - this name shortened by 3 letters from the end
      let newCheckObj1 = {};
      newCheckObj1.nameAsItIs = splitName[0];
      splitName[0] = splitName[0].capitalize1st();
      newCheckObj1.shortenedName = shorten3(splitName[0]); 
      shortenedNamesToCheck.push(newCheckObj1);
    //if given bot name consists of 2 words (and has not been found in first step), first - to check if 2nd word is Author
    } else if (splitName.length === 2) {
      // here is object with properties - given bot name, first word, 2nd word
      let newCheckObj2 = {};
      newCheckObj2.nameAsItIs = name;
      newCheckObj2.word1 = splitName[0];
      newCheckObj2.word2 = splitName[1];
      toCheckAuthors.push(newCheckObj2);
      //if given name consists of more than 2 words and third word is subsp or var or ssp
    } else if (splitName.length > 2 && (/subsp.*/i.test(splitName[2]) || /var\./i.test(splitName[2]) || /ssp.*/i.test(splitName[2]))) {
      let newCheckObj3 = {};
      newCheckObj3.nameAsItIs = name;
        let infraWord;
        if (/subsp.*/i.test(splitName[2]) || /ssp.*/i.test(splitName[2])) {
          infraWord = 'subsp.';
        } else if (/var\./i.test(splitName[2])) {
          infraWord = "var."
        }
      splitName[0] = splitName[0].capitalize1st();
      splitName[1] = splitName[1].toLowerCase();
      splitName[3] = splitName[3].toLowerCase();
      newCheckObj3.nameToCheck = splitName[0] + " " + splitName[1] + " " + infraWord + " " + splitName[3];
      toCheckInfraspecNames.push(newCheckObj3);
    } else {
      let newCheckObj4 = {};
      newCheckObj4.nameAsItIs = name;
      newCheckObj4.word1 = splitName[0].capitalize1st();
      newCheckObj4.word2 = splitName[1].toLowerCase();
      newCheckObj4.words12 = newCheckObj4.word1 + " " + newCheckObj4.word2;
      genusSpeciesNames.push(newCheckObj4);

    };
  }; 
    
  let secondTry = {};
  secondTry.shortened1word = shortenedNamesToCheck;
  secondTry.twoWordsToCheckAuthors = toCheckAuthors;
  secondTry.threeWordsToCheckInfraspec = toCheckInfraspecNames;
  secondTry.twoWordsGenusSpecies = genusSpeciesNames;
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(secondTry)
  };
  fetch('/secondTry', options).then(response => {
    return response.json();
    }).then((response) => {
      
      console.log(response);
      
      document.getElementById("startPage").innerHTML = "";
      let reloadButton = document.createElement("button");
      document.getElementById("startPage").appendChild(reloadButton);
      reloadButton.setAttribute("id", "refresh");
      document.getElementById("refresh").innerHTML = "START AGAIN!";
      reloadButton.addEventListener("click", () => {location.reload();});
      
      if (response.result1) {
        firstResult = response.result1;
      let csv1 = "received name,shortened name,found name1,found code1,found name2,found code2,found name3,found code3\n";
        response.result1.forEach(function(obj) {
        if(obj.results.length < 3) {
          for (let i = 0; i < (4 - obj.results.length); i++) {
            obj.results.push({eppocode: "none", searchedName: "none"});
          };
        }
        obj.nameAsItIs = obj.nameAsItIs.replace(/,/g, ' ');
        obj.shortenedName = obj.shortenedName.replace(/,/g, ' ');
        
        
        csv1 += `${obj.nameAsItIs},${obj.shortenedName},${obj.results[0].searchedName},${obj.results[0].eppocode},${obj.results[1].searchedName},${obj.results[1].eppocode},${obj.results[2].searchedName},${obj.results[2].eppocode}`;
        csv1 += "\n";
      });
      
      window.URL = window.webkitURL || window.URL;
      
      let csvFile1 = new Blob([csv1], {type: contentType});
      let a = document.createElement('a');
      a.download = '1word.csv';
      a.href = window.URL.createObjectURL(csvFile1);
      a.textContent = 'Download CSV1';
      a.dataset.downloadurl = [contentType, a.download, a.href].join(':');
      document.body.appendChild(document.createElement("div")).setAttribute("id", "p1");
      document.getElementById("p1").textContent = `There were ${response.result1.length} bot names consisting of one word which were not found among bot names in EPPO database. See links for suggestions about similar bot names`;
      let button1rez = document.createElement("button");
      button1rez.setAttribute("id", "button1r");
      button1rez.innerHTML = "Show/hide on screen results of group 1";
      button1rez.addEventListener("click", show1rezultsOnscreen, {once: true});
      document.getElementById("p1").appendChild(document.createElement("p")).appendChild(a);
      document.getElementById("p1").querySelector("p").appendChild(button1rez);
      
      }
      if (response.result2) {
        secondResult = response.result2;
      let csv2 = "received name,comment,found name1,found code1,found name2,found code2,found name3,found code3\n";
      response.result2.forEach(function(obj) {
        if(obj.results.length < 3) {
          for (let i = 0; i < (4 - obj.results.length); i++) {
            obj.results.push({searchedName: "none", eppocode: "none"});
          };
        }
        obj.nameAsItIs = obj.nameAsItIs.replace(/,/g, ' ');
        obj.word2 = obj.word2.replace(/,/g, ' ');

        csv2 += `${obj.nameAsItIs},${obj.word2},${obj.results[0].searchedName},${obj.results[0].eppocode},${obj.results[1].searchedName},${obj.results[1].eppocode},${obj.results[2].searchedName},${obj.results[2].eppocode}`;
        csv2 += "\n";
      });
      let csvFile2 = new Blob([csv2], {type: contentType});
      let a2 = document.createElement('a');
      a2.download = '2word.csv';
      a2.href = window.URL.createObjectURL(csvFile2);
      a2.textContent = 'Download CSV2';
      a2.dataset.downloadurl = [contentType, a2.download, a2.href].join(':');
      document.body.appendChild(document.createElement("div")).setAttribute("id", "p2");
      document.getElementById("p2").textContent = `There were ${response.result2.length} bot names consisting of two words which were not found among bot names in EPPO database. Perhaps 2nd words were authors descriptions. See links for what we suggest as similar names`;
      let button2rez = document.createElement("button");
      button2rez.setAttribute("id", "button2r");
      button2rez.innerHTML = "Show/hide on screen results of group 2";
      button2rez.addEventListener("click", show2rezultsOnscreen, {once: true});
      document.getElementById("p2").appendChild(document.createElement("p")).appendChild(a2);
      document.getElementById("p2").querySelector("p").appendChild(button2rez);
      }
      if (response.result3) {
        thirdResult = response.result3;
      let csv3 = "received name,searched name for infraspec taxon, code if found\n";
      
      response.result3.forEach(function(obj) {
        obj.nameAsItIs = obj.nameAsItIs.replace(/,/g, ' ');
        obj.nameToCheck = obj.nameToCheck.replace(/,/g, ' ');
        csv3 += `${obj.nameAsItIs},${obj.nameToCheck},${obj.result.code}`;
        csv3 += "\n";
      });
      let csvFile3 = new Blob([csv3], {type: contentType});
      let a3 = document.createElement('a');
      a3.download = 'infraspec.csv';
      a3.href = window.URL.createObjectURL(csvFile3);
      a3.textContent = 'Download CSV3';
      a3.dataset.downloadurl = [contentType, a3.download, a3.href].join(':');
      document.body.appendChild(document.createElement("div")).setAttribute("id", "p3");
      document.getElementById("p3").textContent = `There were ${response.result3.length} bot names which seemed to have infraspecific taxon. See links if codes were found for them`;
      let button3rez = document.createElement("button");
      button3rez.setAttribute("id", "button3r");
      button3rez.innerHTML = "Show/hide on screen results of group 3";
      button3rez.addEventListener("click", show3rezultsOnScreen, {once: true});
      document.getElementById("p3").appendChild(document.createElement("p")).appendChild(a3);
      document.getElementById("p3").querySelector("p").appendChild(button3rez);
    }
    if (response.result4) {
      forthResult = response.result4;
      let csv4 = "received name,searched name,code if found,genus name,genus code,genus sp. name,genus sp. code\n";
      response.result4.forEach(function(obj) {
        if(!obj.result.genusName) {
          obj.result.genusName = "not relevant";
          obj.result.genusCode = "not relevant";
          obj.result.genusNameSp = "not relevant";
          obj.result.genusCodeSp = "not relevant";
        } 
        
        obj.nameAsItIs = obj.nameAsItIs.replace(/,/g, ' ');
        obj.result.name = obj.result.name.replace(/,/g, ' ');
        csv4 += `${obj.nameAsItIs},${obj.result.name},${obj.result.code},${obj.result.genusName},${obj.result.genusCode},${obj.result.genusNameSp},${obj.result.genusCodeSp}`;
        csv4 += "\n";
      });

      let csvFile4 = new Blob([csv4], {type: contentType});
      let a4 = document.createElement('a');
      a4.download = 'genusSpec.csv';
      a4.href = window.URL.createObjectURL(csvFile4);
      a4.textContent = 'Download CSV4';
      a4.dataset.downloadurl = [contentType, a4.download, a4.href].join(':');
      document.body.appendChild(document.createElement("div")).setAttribute("id", "p4");
      document.getElementById("p4").textContent = `There were ${response.result4.length} bot names consisting of more than two words and were not found among bot names in EPPO database in first search. See links for what we suggest as similar names`;
      let button4rez = document.createElement("button");
      button4rez.setAttribute("id", "button4r");
      button4rez.innerHTML = "Show/hide on screen results of group 4";
      button4rez.addEventListener("click", show4rezultsOnscreen, {once: true});
      document.getElementById("p4").appendChild(document.createElement("p")).appendChild(a4);
      document.getElementById("p4").querySelector("p").appendChild(button4rez);
    }
    });
  
};
}());

