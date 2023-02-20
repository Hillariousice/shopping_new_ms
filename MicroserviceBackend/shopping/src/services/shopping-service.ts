import { APIError, STATUS_CODES } from "../utils/app-errors";

import { ShoppingRepository } from "../database";
import { FormateData } from "../utils";

// All Business logic will be here
class ShoppingService {
  repository: any;

  constructor() {
    this.repository = new ShoppingRepository();
  }

  async GetCart(_id: any) {
    try {
      const cartItems = await this.repository.Cart(_id);
      return FormateData(cartItems);
    } catch (err) {}
  }

  async PlaceOrder(userInput: { _id: any; txnNumber: any }) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs
    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Data Not found",
        true,
        "",
        true
      );
    }
  }

  async GetOrders(customerId: string) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Data Not found",
        true,
        "",
        true
      );
    }
  }

  // Get order details

  async ManageCart(customerId: string, item: any, qty: number, isRemove: any) {
    try {
      const cartResult = await this.repository.AddCartItem(
        customerId,
        item,
        qty,
        isRemove
      );

      return FormateData(cartResult);
    } catch (err) {
      throw err;
    }
  }

  async SubscribeEvents(payload: any) {
    // payload = JSON.parse(JSON.stringify(payload));
    payload = JSON.parse(payload);
    const { event, data } = payload;

    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      default:
        break;
    }
  }

  async GetOrderPayload(userId: any, order: any, event: string) {
    if (order) {
      const payload = {
        event: event,
        data: { userId, order },
      };
      return payload;
    } else {
      return FormateData({ error: "No Order is avalilable" });
    }
  }
}

export default ShoppingService;
