const transactions = [
  {
      "id": 1,
      "sellerId": 22,
      "buyerId": 2,
      "status": "SUBMITTED",
      "note": "",
      "photo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwthBTSQMKJ9BcaZxoUQ-sBlPCTIQzggPciQ&s",
      "weight": 250,
      "pricePerKilogram": 2000,
      "plasticId": 1,
      "handover": "SELFDELIVERY",
      "handoverFee": 15000,
      "transactionTime": null,
      "createdAt": "2024-06-18T15:17:40.019Z",
      "updatedAt": "2024-06-18T15:17:40.019Z"
  },
  {
      "id": 2,
      "sellerId": 23,
      "buyerId": 3,
      "status": "FINISHED",
      "note": "",
      "photo": "https://lh4.googleusercontent.com/proxy/7B2iJ5-r0AOoRyUiLS9X27F0E5_HGaUrLYdeivO-LPU6vWI-2OLK4QnAn63UYTxGslV32EzQxYOaVzO4K32ZzXvfpDtYK1nDsmvtdw1f8aqdoC8fBXUMyOUhroajONSOLCmJKUHcQzoCAAz5KecFBjxLCEv_LCYppXWpbSDkUYCUgoE",
      "weight": 421,
      "pricePerKilogram": 3000,
      "plasticId": 2,
      "handover": "PICKUP",
      "handoverFee": 15000,
      "transactionTime": "2024-06-10T10:30:00.477Z",
      "createdAt": "2024-06-18T15:17:40.019Z",
      "updatedAt": "2024-06-18T15:17:40.019Z"
  },
  {
      "id": 3,
      "sellerId": 23,
      "buyerId": 3,
      "status": "PROCESSED",
      "note": "",
      "photo": "https://lh4.googleusercontent.com/proxy/7B2iJ5-r0AOoRyUiLS9X27F0E5_HGaUrLYdeivO-LPU6vWI-2OLK4QnAn63UYTxGslV32EzQxYOaVzO4K32ZzXvfpDtYK1nDsmvtdw1f8aqdoC8fBXUMyOUhroajONSOLCmJKUHcQzoCAAz5KecFBjxLCEv_LCYppXWpbSDkUYCUgoE",
      "weight": 150,
      "pricePerKilogram": 2500,
      "plasticId": 3,
      "handover": "SELFDELIVERY",
      "handoverFee": 15000,
      "transactionTime": "2024-06-12T10:00:00.477Z",
      "createdAt": "2024-06-18T15:17:40.019Z",
      "updatedAt": "2024-06-18T15:17:40.019Z"
  },
  {
      "id": 4,
      "sellerId": 24,
      "buyerId": 4,
      "status": "REJECTED_BY_PARTNER",
      "note": "Tidak memenuhi berat minimum penerimaan plastik",
      "photo": "https://waste4change.com/blog/wp-content/uploads/plastic-bags-1.jpg",
      "weight": 1,
      "pricePerKilogram": 2500,
      "plasticId": 3,
      "handover": "SELFDELIVERY",
      "handoverFee": 0,
      "transactionTime": null,
      "createdAt": "2024-06-18T15:17:40.019Z",
      "updatedAt": "2024-06-18T15:17:40.019Z"
  },
  {
      "id": 5,
      "sellerId": 24,
      "buyerId": 2,
      "status": "SUBMITTED",
      "note": null,
      "photo": null,
      "weight": 200,
      "pricePerKilogram": 2000,
      "plasticId": 2,
      "handover": "SELFDELIVERY",
      "handoverFee": 0,
      "transactionTime": null,
      "createdAt": "2024-06-18T15:17:47.071Z",
      "updatedAt": "2024-06-18T15:17:47.071Z"
  },
  {
      "id": 6,
      "sellerId": 24,
      "buyerId": 2,
      "status": "SUBMITTED",
      "note": null,
      "photo": null,
      "weight": 200,
      "pricePerKilogram": 2000,
      "plasticId": 2,
      "handover": "SELFDELIVERY",
      "handoverFee": 0,
      "transactionTime": null,
      "createdAt": "2024-06-18T15:18:17.327Z",
      "updatedAt": "2024-06-18T15:18:17.327Z"
  },
  {
      "id": 7,
      "sellerId": 24,
      "buyerId": 2,
      "status": "SUBMITTED",
      "note": null,
      "photo": "https://ucarecdn.com/db2cac21-11eb-4d43-9678-cd59a517597a/-/preview/512x512/",
      "weight": 200,
      "pricePerKilogram": 2000,
      "plasticId": 2,
      "handover": "SELFDELIVERY",
      "handoverFee": 0,
      "transactionTime": null,
      "createdAt": "2024-06-18T15:24:48.105Z",
      "updatedAt": "2024-06-18T15:24:48.105Z"
  },
  {
      "id": 8,
      "sellerId": 24,
      "buyerId": 2,
      "status": "SUBMITTED",
      "note": null,
      "photo": "https://ucarecdn.com/7cad1593-98ff-425f-ab23-dbbc56905ff2/-/preview/512x512/",
      "weight": 200,
      "pricePerKilogram": 2000,
      "plasticId": 2,
      "handover": "SELFDELIVERY",
      "handoverFee": 0,
      "transactionTime": null,
      "createdAt": "2024-06-18T15:25:04.741Z",
      "updatedAt": "2024-06-18T15:25:04.741Z"
  },
  {
      "id": 9,
      "sellerId": 24,
      "buyerId": 2,
      "status": "SUBMITTED",
      "note": null,
      "photo": "https://ucarecdn.com/c722d2be-d90d-48df-aa95-2f07cc68d947/-/preview/512x512/",
      "weight": 200,
      "pricePerKilogram": 2000,
      "plasticId": 2,
      "handover": "SELFDELIVERY",
      "handoverFee": 0,
      "transactionTime": null,
      "createdAt": "2024-06-18T15:25:10.824Z",
      "updatedAt": "2024-06-18T15:25:10.824Z"
  }
];
// const output = {
//   "January": 0,
//   "February": 0,
//   "March": 0,
//   "April": 0,
//   "May": 0,
//   "June": 0,
//   "July": 0,
//   "August": 0,
//   "September": 0,
//   "October": 0,
//   "November": 0,
//   "December": 0
// };

// transactions.forEach(transaction => {
//   const createdAt = new Date(transaction.createdAt);
//   const month = createdAt.getMonth(); // Mendapatkan index bulan (0 - 11)

//   switch (month) {
//       case 0:
//           output["January"] += transaction.weight;
//           break;
//       case 1:
//           output["February"] += transaction.weight;
//           break;
//       case 2:
//           output["March"] += transaction.weight;
//           break;
//       case 3:
//           output["April"] += transaction.weight;
//           break;
//       case 4:
//           output["May"] += transaction.weight;
//           break;
//       case 5:
//           output["June"] += transaction.weight;
//           break;
//       case 6:
//           output["July"] += transaction.weight;
//           break;
//       case 7:
//           output["August"] += transaction.weight;
//           break;
//       case 8:
//           output["September"] += transaction.weight;
//           break;
//       case 9:
//           output["October"] += transaction.weight;
//           break;
//       case 10:
//           output["November"] += transaction.weight;
//           break;
//       case 11:
//           output["December"] += transaction.weight;
//           break;
//       default:
//           break;
//   }
// });

// console.log(output);

const output = [0, 0, 0, 0, 0];

transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.createdAt);
    const transactionDay = transactionDate.getDate();

    const weekIndex = Math.floor((transactionDay - 1) / 7);

    output[weekIndex] += transaction.weight;
});

console.log(output);