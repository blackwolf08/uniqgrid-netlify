/*

Make use of this component while test, you can console log certain things while testing app without rendering 

this component can be found at /dashboard/check

*/

// import React, { Component } from "react";
// import axios from "axios";

// export default class Check extends Component {
//   render() {
//     const URL =
//       "https://cors-anywhere.herokuapp.com/https://api.hubapi.com/contacts/v1/contact/email/demo@uniqgrid.com/profile?hapikey=bdcec428-e806-47ec-b7fd-ece8b03a870b";

//     axios.get(URL).then(res => {
//       const properties = res.data.properties;
//       let arrayOfStrings = [];
//       Object.keys(properties).forEach(key => {
//         arrayOfStrings.push(key);
//       });
//       let id = 2;
//       let result = [];
//       let resultObject = {};
//       arrayOfStrings.forEach(subString => {
//         if (subString.includes(id)) {
//           result.push(subString);
//         }
//       });
//       let temp;
//       result.forEach(key => {
//         temp = key.split("_");
//         temp = temp.join(" ");
//         resultObject[temp] = properties[key];
//       });
//       console.log(resultObject);
//     }).catch(res=>{
//       if (res.status === 401) {
//         localStorage.clear();
//         window.location.href = "/login";
//       }
//     });
//     return <div />;
//   }
// }
