import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "@/services/api/orderService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const orderData = await getOrderById(parseInt(orderId));
      if (orderData) {
        setOrder(orderData);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadOrder} />;
  if (!order) return <Error message="Order not found" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="CheckCircle" size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for your order. We've received it and are processing it now.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Order Details</h2>
              <Badge variant="success">Confirmed</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Order ID:</span>
                <p className="font-medium">#{order.Id.toString().padStart(8, "0")}</p>
              </div>
              <div>
                <span className="text-gray-600">Order Date:</span>
                <p className="font-medium">{format(new Date(order.orderDate), "PPP")}</p>
              </div>
              <div>
                <span className="text-gray-600">Estimated Delivery:</span>
                <p className="font-medium">{format(new Date(order.estimatedDelivery), "PPP")}</p>
              </div>
              <div>
                <span className="text-gray-600">Payment Method:</span>
                <p className="font-medium capitalize">
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod.toUpperCase()}
                </p>
              </div>
            </div>
          </Card>

          {/* Delivery Address */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ApperIcon name="MapPin" size={20} className="mr-2" />
              Delivery Address
            </h2>
            <div className="text-gray-700">
              <p className="font-medium">{order.deliveryAddress.fullName}</p>
              <p>{order.deliveryAddress.address}</p>
              <p>
                {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
              </p>
              <p className="mt-2">
                <span className="text-gray-600">Phone:</span> {order.deliveryAddress.phone}
              </p>
              <p>
                <span className="text-gray-600">Email:</span> {order.deliveryAddress.email}
              </p>
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.name}`} className="flex space-x-4 py-3 border-b last:border-b-0">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                    <ApperIcon name="Package" size={20} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium text-primary">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Summary & Actions */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{(order.total - (order.total > 1000 ? 0 : 100)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{order.total > 1000 ? "Free" : "₹100"}</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-primary">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/")}
                className="w-full"
              >
                Continue Shopping
              </Button>
              
              <Button 
                variant="secondary"
                onClick={() => window.print()}
                className="w-full"
              >
                <ApperIcon name="Printer" size={16} className="mr-2" />
                Print Receipt
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• We'll send you email updates about your order</li>
                    <li>• Your items will be packed and shipped soon</li>
                    <li>• You'll receive tracking details once shipped</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;