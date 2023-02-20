import ShoppingService from "../services/shopping-service";
import UserAuth from "./middlewares/auth";
import express, { Request, Response, NextFunction } from "express";
import { SubscribeMessage, PublishMessage } from "../utils";
import { CUSTOMER_BINDING_KEY } from "../config";

export const shopping = (app: express.Application, channel: any) => {
  const service = new ShoppingService();
  SubscribeMessage(channel, service);

  app.post(
    "/order",
    UserAuth,
    async (req: Request | any, res: Response, next: NextFunction) => {
      const { _id } = req.user;
      const { txnNumber } = req.body;

      try {
        const { data } = await service.PlaceOrder({ _id, txnNumber });
        const payload = await service.GetOrderPayload(
          _id,
          data,
          "CREATE_ORDER"
        );

        // PublishedCustomerEvent(payload)

        PublishMessage(channel, CUSTOMER_BINDING_KEY, JSON.stringify(payload));
        return res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  app.get(
    "/orders",
    UserAuth,
    async (req: Request | any, res: Response, next: NextFunction) => {
      const { _id } = req.user;

      try {
        const { data } = await service.GetOrders(_id);
        return res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    }
  );

  // app.put('/cart',UserAuth, async (req:Request | any,res:Response,next:NextFunction) => {

  //     const { _id } = req.user;

  //     const { data } = await service.AddToCart(_id, req.body._id);

  //     res.status(200).json(data);

  // });

  // app.delete('/cart/:id',UserAuth, async (req:Request | any,res:Response,next:NextFunction) => {

  //     const { _id } = req.user;

  //     const { data } = await service.AddToCart(_id, req.body._id);

  //     res.status(200).json(data);

  // });

  app.get(
    "/cart",
    UserAuth,
    async (req: Request | any, res: Response, next: NextFunction) => {
      const { _id } = req.user;
      try {
        const data = await service.GetCart(_id);
        return res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    }
  );
};
