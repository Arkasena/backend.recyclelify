const transactions = [
  {
    partnerId: 2,
    collaboratorId: 22,
    status: "SUBMITTED",
    note: "",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwthBTSQMKJ9BcaZxoUQ-sBlPCTIQzggPciQ&s",
    weight: 250,
    pricePerKilogram: 2000,
    plasticId: 1,
    handover: "SELFDELIVERY",
    handoverFee: 15000,
    transactionTime: null,
  },
  {
    partnerId: 3,
    collaboratorId: 23,
    status: "FINISHED",
    note: "",
    photo:
      "https://lh4.googleusercontent.com/proxy/7B2iJ5-r0AOoRyUiLS9X27F0E5_HGaUrLYdeivO-LPU6vWI-2OLK4QnAn63UYTxGslV32EzQxYOaVzO4K32ZzXvfpDtYK1nDsmvtdw1f8aqdoC8fBXUMyOUhroajONSOLCmJKUHcQzoCAAz5KecFBjxLCEv_LCYppXWpbSDkUYCUgoE",
    weight: 421,
    pricePerKilogram: 3000,
    plasticId: 2,
    handover: "PICKUP",
    handoverFee: 15000,
    transactionTime: "2024-06-10T10:30:00.477Z",
  },
  {
    partnerId: 3,
    collaboratorId: 23,
    status: "PROCESSED",
    note: "",
    photo:
      "https://lh4.googleusercontent.com/proxy/7B2iJ5-r0AOoRyUiLS9X27F0E5_HGaUrLYdeivO-LPU6vWI-2OLK4QnAn63UYTxGslV32EzQxYOaVzO4K32ZzXvfpDtYK1nDsmvtdw1f8aqdoC8fBXUMyOUhroajONSOLCmJKUHcQzoCAAz5KecFBjxLCEv_LCYppXWpbSDkUYCUgoE",
    weight: 150,
    pricePerKilogram: 2500,
    plasticId: 3,
    handover: "SELFDELIVERY",
    handoverFee: 15000,
    transactionTime: "2024-06-12T10:00:00.477Z",
  },
  {
    partnerId: 4,
    collaboratorId: 24,
    status: "REJECTED_BY_PARTNER",
    note: "Tidak memenuhi berat minimum penerimaan plastik",
    photo: "https://waste4change.com/blog/wp-content/uploads/plastic-bags-1.jpg",
    weight: 1,
    pricePerKilogram: 2500,
    plasticId: 3,
    handover: "SELFDELIVERY",
    handoverFee: 0,
    transactionTime: null,
  },
];

module.exports = transactions;
