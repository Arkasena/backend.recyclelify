const prismaClient = require("../utilities/prismaClient.utility");

class StatisticController {
  static async index(req, res) {
    const { transactionType, id } = req.params;

    try {
      const byTransactionType = {
        sales: {
          sellerId: Number(id),
        },
        purchase: {
          buyerId: Number(id),
        },
      };

      const transactions = await prismaClient.transaction.findMany({
        where: byTransactionType[transactionType?.toLowerCase()],
        orderBy: {
          updatedAt: "asc",
        },
      });

      const partners = new Set(transactions.map((transaction) => transaction.partnerId));

      const totalIncome = transactions.reduce((total, transaction) => {
        const transactionPrice = transaction.weight * transaction.pricePerKilogram;
        return total + transactionPrice;
      }, 0);

      const salesRecapData = {
        totalWeight: transactions.reduce((acc, curr) => acc + curr.weight, 0),
        totalPartner: partners.size,
        totalIncome,
        totalTransaction: transactions.length,
      };

      const totalWeightThisMonth = [0, 0, 0, 0, 0];
      const totalIncomeThisMonth = [0, 0, 0, 0, 0];

      transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.createdAt);
        const transactionDay = transactionDate.getDate();

        const weekIndex = Math.floor((transactionDay - 1) / 7);

        totalWeightThisMonth[weekIndex] += transaction.weight;
        totalIncomeThisMonth[weekIndex] += transaction.weight * transaction.pricePerKilogram;
      });

      res.json({
        lastTransactions: transactions.slice(0, 3),
        salesRecapData,
        totalWeightThisMonth,
        totalIncomeThisMonth,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error,
      });
    }
  }
}

module.exports = StatisticController;
