import { useEffect, useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("orders/all-orders/")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`orders/${orderId}/status/`, { status: newStatus });
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order #${orderId} marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-dark mb-6">Manage Orders</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-mono">#{order.id}</td>
                <td className="p-4">
                  <div className="font-bold">{order.full_name}</div>
                  <div className="text-sm text-gray-500">{order.phone}</div>
                </td>
                <td className="p-4 font-bold">₹{order.total_amount}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      statusColors[order.status] || "bg-gray-100"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    className="border rounded p-1 text-sm bg-white"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
