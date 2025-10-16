import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '@/services/api/orderService';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      // Sort by order date descending (newest first)
      const sortedOrders = data.sort((a, b) => 
        new Date(b.orderDate) - new Date(a.orderDate)
      );
      setOrders(sortedOrders);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return variants[status] || variants.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: 'Clock',
      processing: 'Package',
      shipped: 'Truck',
      delivered: 'CheckCircle2',
      cancelled: 'XCircle'
    };
    return icons[status] || 'Clock';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Loading type="spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Error message={error} onRetry={loadOrders} />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Empty
            title="No Orders Yet"
            message="You haven't placed any orders yet. Start shopping to see your order history here."
            actionText="Start Shopping"
            onAction={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">
            View and track all your orders in one place
          </p>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card
              key={order.Id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/order-confirmation/${order.Id}`)}
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-900">#{order.Id}</p>
                </div>
                <Badge className={`${getStatusBadgeVariant(order.status)} border flex items-center gap-1`}>
                  <ApperIcon name={getStatusIcon(order.status)} size={14} />
                  <span className="capitalize">{order.status}</span>
                </Badge>
              </div>

              {/* Order Date */}
              <div className="mb-4">
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="text-gray-900 flex items-center gap-2">
                  <ApperIcon name="Calendar" size={16} className="text-gray-400" />
                  {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                </p>
              </div>

              {/* Order Items Summary */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-500 mb-2">Items</p>
                <div className="space-y-1">
                  {order.items.slice(0, 2).map((item, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      {item.quantity}x {item.name}
                    </p>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-500">
                      +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Total */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(order.total)}
                </p>
              </div>

              {/* View Details Button */}
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/order-confirmation/${order.Id}`);
                }}
              >
                View Details
                <ApperIcon name="ArrowRight" size={16} className="ml-2" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;