const { TransactionStatus } = require("@prisma/client");
const { uploadDirect } = require("@uploadcare/upload-client");
const prismaClient = require("../utilities/prismaClient.utility");
const requestValidators = require("../utilities/requestValidators.utility");
const validationError = require("../utilities/validationError.utility");

class TransactionsController {
  static async index(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const index = (page - 1) * limit;
    const sellerId = Number(req.query.sellerId) || undefined;
    const buyerId = Number(req.query.buyerId) || undefined;
    const status = TransactionStatus[req.query.status?.toUpperCase()];
    const relations = req.query.relations || [];

    try {
      const total = await prismaClient.transaction.count({
        where: {
          sellerId: sellerId,
          buyerId: buyerId,
          status: status,
        },
      });

      const transactions = await prismaClient.transaction.findMany({
        skip: index,
        take: limit,
        where: {
          sellerId: sellerId,
          buyerId: buyerId,
          status: status,
        },
        include: {
          seller: relations.includes("seller")
            ? {
                select: {
                  id: true,
                  name: true,
                  address: true,
                  phoneNumber: true,
                  photo: true,
                },
              }
            : false,
          buyer: relations.includes("buyer")
            ? {
                select: {
                  id: true,
                  name: true,
                  address: true,
                  phoneNumber: true,
                  photo: true,
                },
              }
            : false,
        },
      });

      return res.json({
        data: transactions,
        meta: {
          total,
          limit,
          page: {
            first: 1,
            prev: page - 1 === 0 ? 1 : page - 1,
            current: page,
            next: page + 1 > Math.ceil(total / limit) ? Math.ceil(total / limit) : page + 1,
            last: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error,
      });
    }
  }

  static async show(req, res) {
    const { id } = req.params;
    const relations = req.query.relations || [];

    try {
      const transaction = await prismaClient.transaction.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          seller: relations.includes("seller")
            ? {
                select: {
                  id: true,
                  name: true,
                  address: true,
                  phoneNumber: true,
                },
              }
            : false,
          buyer: relations.includes("buyer")
            ? {
                select: {
                  id: true,
                  name: true,
                  address: true,
                  phoneNumber: true,
                },
              }
            : false,
        },
      });

      return res.json({
        data: transaction,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error,
      });
    }
  }

  static async save(req, res) {
    const photo = req.files?.photo;

    try {
      const validationResult = await requestValidators.transaction.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      let photoLink;

      if (photo) {
        const allowedMimetypes = ["image/jpeg", "image/png"];

        if (allowedMimetypes.includes(photo?.mimetype)) {
          const date = new Date();
          const fileName = `${validationResult.sellerId}-${
            validationResult.sellerId
          }_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

          const uploadPhotoResult = await uploadDirect(photo.data, {
            publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
            store: "auto",
            fileName,
          });

          photoLink = `https://ucarecdn.com/${uploadPhotoResult.uuid}/-/preview/512x512/`;
        } else {
          throw {
            photo: "photo must be jpg, jpeg, or png",
          };
        }
      }

      const transaction = await prismaClient.transaction.create({
        data: { ...validationResult, photo: photoLink },
      });

      return res.status(201).json({
        data: transaction,
      });
    } catch (error) {
      console.error(error);

      if (error?.details) {
        return res.status(400).json({
          error: validationError(error.details),
        });
      }

      return res.status(500).json({
        error,
        pub_key: process.env.UPLOADCARE_PUBLIC_KEY,
      });
    }
  }

  static async update(req, res) {
    const { id } = req.params;

    try {
      const validationResult = await requestValidators.transaction.validateAsync(req.body, {
        stripUnknown: true,
        abortEarly: false,
        errors: {
          wrap: {
            label: false,
          },
        },
      });

      const transaction = await prismaClient.transaction.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          transactionTime: true,
        },
      });

      if (validationResult.status === TransactionStatus.PROCESSED) {
        if (transaction.transactionTime === null) {
          validationResult.transactionTime = new Date();
        } else {
          const currentDate = new Date();
          const differentTime = currentDate - transaction.transactionTime;
          const maximumTransactionTime = 3 * 24 * 60 * 60 * 1000;

          if (differentTime > maximumTransactionTime) {
            validationResult.status = TransactionStatus.FAILED;
          }
        }
      }

      const updatedTransaction = await prismaClient.transaction.update({
        where: {
          id: Number(id),
        },
        data: validationResult,
      });

      return res.json({
        data: updatedTransaction,
      });
    } catch (error) {
      console.error(error);

      if (error?.details) {
        return res.status(400).json({
          error: validationError(error.details),
        });
      }

      return res.status(500).json({
        error,
      });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    try {
      const transaction = await prismaClient.transaction.delete({
        where: {
          id: Number(id),
        },
      });

      return res.json({
        data: transaction,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error,
      });
    }
  }
}

module.exports = TransactionsController;
