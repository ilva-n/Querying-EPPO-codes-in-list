const sqlite3 = require('sqlite3').verbose();

String.prototype.capitalize1st = function() {
    return this[0].toUpperCase() + this.substring(1).toLowerCase();
 };
 //function for bot names first search in sqlite database
 const getExactWords = (database, word, resultArray, incommingNamesArray, response) => {
     database.get("SELECT * FROM t_names JOIN t_codes ON t_names.codeid = t_codes.codeid WHERE codelang = 'la' AND fullname = $b_name COLLATE NOCASE",
      {
      $b_name: word
      },
      (err, row) => {
          if (err) {
              console.error;
          }
          const name1 = {};
          name1.incommingName = word;
          if (row === undefined) {
              name1.eppocode = 'not found';
          } else {
          name1.eppocode = row.eppocode;
          }
          resultArray.push(name1);
          if (resultArray.length === incommingNamesArray.length) {
             response.results = resultArray;
             database.close();
             response.send(response.results);
         };
      });
  };
 
 // function for preparing words for exact names search in database
 const exactNameFind = (request, response) => {
     let resultExactNames = [];
     let db = new sqlite3.Database('./eppocodes.sqlite');
     let namesArray = request.body.bot_names;
     for (let i = 0; i < namesArray.length; i++) { 
         let nameEach = namesArray[i];
         nameEach = nameEach.replace(/;|"|'/g, ' '); //removes quotes and semicolons if such come from csv file
         nameEach = nameEach.trim(); //removes extra spaces
         getExactWords(db, nameEach, resultExactNames, namesArray, response);  
     };
 }; 
 
 const shorten1 = function (word) {
     return word.substring(0, word.length - 2);
 };
 
 const shorten3 = function (word) {
     return word.substring(0, word.length - 4);
 };
 
 // following are for 2nd search
 // function for searching 3 variations of each given word
 const possible3wordsSearch = (database, word, eachWordResultArray, wholeSearchResultArray, searchWordObj, searchArray, response, resultArrayName, next) => {
     database.all("SELECT * FROM t_names JOIN t_codes ON t_names.codeid = t_codes.codeid WHERE codelang = 'la' AND fullname LIKE $b_name LIMIT 3",
         {
            $b_name: word
        }, 
        (err, rows) => {
             let resultObj = {};
             if (rows.length === 0) {
                 resultObj.eppocode = "not found";
                 resultObj.searchedName = "not found";
                 eachWordResultArray.push(resultObj);
                 wholeSearchResultArray.push(searchWordObj);
 
             } else {
                 rows.forEach((row) => {
                     let resultObj2 = {};
                     resultObj2.eppocode = row.eppocode;
                     resultObj2.searchedName = row.fullname;
                     eachWordResultArray.push(resultObj2); 
                     if (eachWordResultArray.length === rows.length) {
                         wholeSearchResultArray.push(searchWordObj);
                     } 
                 });
             };
             if (searchArray.length === wholeSearchResultArray.length) {
                 
                 //response.results = {};
                 response.results[resultArrayName] = wholeSearchResultArray;
                 database.close();
                 next();
             }
         });
 };
 
 //when given botanic name consisted of just 1 word and was not found among botanic names of genera in fullnames table, 
 //possible that name has a type error. Name is shortened and prepared for searching 3 similar names form db
 const oneShortenedWordSearch = (request, response, next) => {
     let resultArray1 = [];
     let db = new sqlite3.Database('./eppocodes.sqlite');
     let incommingObjects = request.body.shortened1word;
     if (incommingObjects && incommingObjects.length > 0) {
         for (let i = 0; i < incommingObjects.length; i++) {
         let eachWord = incommingObjects[i].shortenedName + "%";
         incommingObjects[i].results = [];
         possible3wordsSearch (db, eachWord, incommingObjects[i].results, resultArray1, incommingObjects[i], incommingObjects, response, "result1", next);
         };
     } else {
         db.close();
         next();
     }
 };
 
 
 // if given bot name consisted of 2 words but was not found in first search, possibly that 2nd word is authors description
 // authorChecking function prepares for checking each set of two words for genus name and author
 
 const authorChecking = (request, response, next) => {
     let resultArray2 = [];
     let db = new sqlite3.Database('./eppocodes.sqlite');
     let incommingObjects = request.body.twoWordsToCheckAuthors;
     if (incommingObjects && incommingObjects.length > 0) {
         for (let i = 0; i < incommingObjects.length; i++) {
             searchAuthor(incommingObjects[i].word2, db, incommingObjects[i], incommingObjects, resultArray2, response, next);
         };
     } else {
     db.close();
     next();
     }
 }; 
 
 //function searches with LIKE method 2nd word of given 2 word set if it could be authors description
 const searchAuthor = (word, database, incommingObject, incommingObjectsArray, resultArray, response, next) => {
     if (word.length > 4) {
         word = shorten1(word);
     };
     word = word + "%";
     database.get('SELECT * FROM t_authorities JOIN t_codes ON t_names.codeid = t_codes.codeid WHERE authdesc LIKE $author',
         {
             $author: word
         },
         (err, row) => {
             incommingObject.results = [];
             // if word is not found with LIKE among authors AND does not contain capital letters or dot, it is considered not to be authors descriotion
             if (row === undefined && /[A-Z(.)]/.test(word) === false) {
                 incommingObject.word2 = "2nd word not found as author";
                 resultArray.push(incommingObject);
                 console.log(resultArray.length);
                 if (resultArray.length === incommingObjectsArray.length) {
                     response.results.result2 = resultArray;
                     database.close();
                     next();
                 }
             } else {
                 incommingObject.word2 = "2nd word is rather author s description";
                 //if 2nd word is rather author's description, we look for first word only - for genus code and first word + sp. for "unidentified species from genus" code
                 database.get("SELECT * FROM t_names JOIN t_codes ON t_names.codeid = t_codes.codeid WHERE codelang = 'la' AND fullname = $b_name",
                     {
                         $b_name: incommingObject.word1
                     },
                     (err, row) => {
                         if(row === undefined) {
                             incommingObject.word1 = "genus name not found";
                             incommingObject.results[0] = {};
                             incommingObject.results[0].searchedName = "not found";
                             incommingObject.results[0].eppocode = "not found";
                             resultArray.push(incommingObject);
                             if (resultArray.length === incommingObjectsArray.length) {
                                 response.results.result2 = resultArray;
                                 database.close();
                                 next();
                             }
                         } else {
                             incommingObject.results[0] = {};
                             incommingObject.results[0].searchedName = row.fullname;
                             incommingObject.results[0].eppocode = row.eppocode;
                             const genusSp = incommingObject.word1 + " " + "sp.";
                             database.get("SELECT * FROM t_names JOIN t_codes ON t_names.codeid = t_codes.codeid WHERE codelang = 'la' AND fullname = $b_name", 
                                 {
                                     $b_name: genusSp
                                 }, (err, row)=>{
                                     if(row === undefined) {
                                         incommingObject.results[1] = {};
                                         incommingObject.results[1].searchedName = "not found";
                                         incommingObject.results[1].eppocode = "not found";
                                         resultArray.push(incommingObject);
                                         if (resultArray.length === incommingObjectsArray.length) {
                                             response.results.result2 = resultArray;
                                             database.close();
                                             next();
                                         }
                                     } else {
                                         incommingObject.results[1] = {};
                                         incommingObject.results[1].searchedName = row.fullname;
                                         incommingObject.results[1].eppocode = row.eppocode;
                                         resultArray.push(incommingObject);
                                         if (resultArray.length === incommingObjectsArray.length) {
                                             response.results.result2 = resultArray;
                                             database.close();
                                             next();
                                         }
                                     }
                             });
                         
                         }
                 });
                 
             }
     });
 };
 
 // if there were bot names containing subsp., ssp. var. it is called infraspecific taxon. There are EPPO codes for such taxons.
 // here preparing words for searching for them (punkts vai rakstība varēja atšķirties, tāpēc tās neatrada pirmajā meklējumā)
 const infraSpecNameCheck = (request, response, next) => {
     let resultArray2 = [];
     let db = new sqlite3.Database('./eppocodes.sqlite');
     let incommingObjects = request.body.threeWordsToCheckInfraspec;
     if (incommingObjects && incommingObjects.length > 0) {
         for (let i = 0; i < incommingObjects.length; i++) {
             searchOneExactName(incommingObjects[i].nameToCheck, db, incommingObjects[i], incommingObjects, resultArray2, response, "result3", next);
         };
     } else {
     db.close();
     next();
     }
 };
 
 //this is for searching one exact name (for example - infraspec taxon or genus+species combination) and get answer - found or not found
 const searchOneExactName = (word, database, incommingObject, incommingObjectsArray, resultArray, response, resultArrayName, next) => {
     database.get("SELECT * FROM t_names JOIN t_codes ON t_names.codeid = t_codes.codeid WHERE codelang = 'la' AND fullname = $b_name",
      {
      $b_name: word
      },
      (err, row) => {
          if (err) {
              console.error;
          }
          incommingObject.result = {};
          
          if (row === undefined) {
             incommingObject.result.name = 'not found';
             incommingObject.result.code = 'not found';
          } else {
             incommingObject.result.name = row.fullname;
             incommingObject.result.code = row.eppocode;
          }
          resultArray.push(incommingObject);
          if (resultArray.length === incommingObjectsArray.length) {
             response.results[resultArrayName] = resultArray;
             database.close();
             next();
         };
      });
  };
 
 //if given bot name consisted of more than two words, not containing infraspecific taxon indicators then probably it just has extra information
 // e.g. authors description at the end. Here we have just first two words of given name, preparing these to make exactName search
 const genusSpeciesNameSearch = (request, response, next) => {
     let resultArray2 = [];
     let db = new sqlite3.Database('./eppocodes.sqlite');
     let incommingObjects = request.body.twoWordsGenusSpecies;
     if (incommingObjects && incommingObjects.length > 0) {
         for (let i = 0; i < incommingObjects.length; i++) {
             searchOneExactName(incommingObjects[i].words12, db, incommingObjects[i], incommingObjects, resultArray2, response, "result4", next);
         };
     } else {
     db.close();
     next();
     }
 };
 
 // if given bot name was of 2 words and 2nd word did not indicate in any way that it is authors description then it is rather a typo or '
 // at the moment does not have an EPPO code. Let try to shorten the second word and search for some similar bot names (because sometimes endings are imprecise)
 // this function goes through response.results.result2 one more time, finds items that have "2nd word not found as author" and applies the above mentioned
 const authorsNotFound = (request, response, next) => {
     let resultArray2 = [];
     let db = new sqlite3.Database('./eppocodes.sqlite');
     let incommingObjects = response.results.result2;
     if (incommingObjects && incommingObjects.length > 0) {
         for (let i = 0; i < incommingObjects.length; i++) {
             if (incommingObjects[i].word2 === "2nd word is rather author s description") {
                 resultArray2.push(incommingObjects[i]);
                 if (resultArray2.length === incommingObjects.length) {
                     response.results.result2 = resultArray2;
                     db.close();
                     next();
                 }
             } else if (incommingObjects[i].word2 === "2nd word not found as author") {
                 let eachWord = incommingObjects[i].nameAsItIs;
                 eachWord = eachWord.capitalize1st();
                 eachWord = shorten3(eachWord);
                 eachWord = eachWord + "%";   
                 incommingObjects[i].results = [];
                 possible3wordsSearch (db, eachWord, incommingObjects[i].results, resultArray2, incommingObjects[i], incommingObjects, response, "result2", next);
             
             }
         };
     } else {
     db.close();
     next();
     }
 };
 
 //here wo go through response.results.result4 again (given names, consisting of more that 2 words for which 1st+2nd word genusSspecies search was applied)
 //if search was not successful, here we look for genus code and genus+sp. code
 const genusSpeciesNotFound = (request, response, next) => {
     let resultArray2 = [];
     let db = new sqlite3.Database('./eppocodes.sqlite');
     let incommingObjects = response.results.result4;
     if (incommingObjects && incommingObjects.length > 0) {
         for (let i = 0; i < incommingObjects.length; i++) {
             if (incommingObjects[i].result.name !== "not found") {
                 resultArray2.push(incommingObjects[i]);
                 if (resultArray2.length === incommingObjects.length) {
                     response.results.result4 = resultArray2;
                     db.close();
                     next();
                 }
             } else {
                 let eachWord = incommingObjects[i].word1;
                 eachWord = eachWord.capitalize1st();
                 db.get("SELECT * FROM t_names JOIN t_codes ON t_names.codeid = t_codes.codeid WHERE codelang = 'la' AND fullname = $b_name",
                     {
                         $b_name: eachWord
                     },
                     (err, row) => {
                         if(row === undefined) {
                             incommingObjects[i].result.name = incommingObjects[i].words12;
                             incommingObjects[i].result.genusName = eachWord;
                             incommingObjects[i].result.genusCode = "not found";
                             incommingObjects[i].result.genusNameSp = "not found";
                             incommingObjects[i].result.genusCodeSp = "not found";
                             resultArray2.push(incommingObjects[i]);
                             if (resultArray2.length === incommingObjects.length) {
                                 response.results.result4 = resultArray2;
                                 db.close();
                                 next();
                             }
                         } else {
                             incommingObjects[i].result.name = incommingObjects[i].words12;
                             incommingObjects[i].result.genusName = row.fullname;
                             incommingObjects[i].result.genusCode = row.eppocode;
                             
                             const genusSp = eachWord + " " + "sp.";
                             db.get("SELECT * FROM t_names JOIN t_codes ON t_names.codeid = t_codes.codeid WHERE codelang = 'la' AND fullname = $b_name", 
                                 {
                                     $b_name: genusSp
                                 }, (err, row) => {
                                     if(row === undefined) {
                                         incommingObjects[i].result.name = incommingObjects[i].words12;
                                         incommingObjects[i].result.genusName = eachWord;
                                         incommingObjects[i].result.genusNameSp = "not found";
                                         incommingObjects[i].result.genusCodeSp = "not found";
                                         resultArray2.push(incommingObjects[i]);
                                         if (resultArray2.length === incommingObjects.length) {
                                             response.results.result4 = resultArray2;
                                             db.close();
                                             next();
                                         }
                                     } else {
                                         incommingObjects[i].result.name = incommingObjects[i].words12;
                                         incommingObjects[i].result.genusNameSp = row.fullname;
                                         incommingObjects[i].result.genusCodeSp = row.eppocode;
                                         resultArray2.push(incommingObjects[i]);
                                         if (resultArray2.length === incommingObjects.length) {
                                             response.results.result4 = resultArray2;
                                             db.close();
                                             next();
                                         }
                                     }
                             });
                         
                         }
                 });
             }
         };
     } else {
     db.close();
     next();
     }
 };

 module.exports = {
    oneShortenedWordSearch: oneShortenedWordSearch,
    authorChecking: authorChecking,
    authorsNotFound: authorsNotFound,
    infraSpecNameCheck: infraSpecNameCheck,
    genusSpeciesNameSearch: genusSpeciesNameSearch,
    genusSpeciesNotFound: genusSpeciesNotFound,
    exactNameFind: exactNameFind
 };