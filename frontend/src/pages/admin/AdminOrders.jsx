import React, { useEffect, useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null); // For Payment Modal

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    api
      .get("orders/all-orders/")
      .then((res) => setOrders(res.data))
      .catch(console.error);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`orders/${editingOrder.id}/update/`, {
        amount_paid: editingOrder.amount_paid,
        payment_method: editingOrder.payment_method,
        payment_note: editingOrder.payment_note,
        status: editingOrder.status,
      });
      toast.success("Order Updated");
      setEditingOrder(null);
      fetchOrders();
    } catch {
      toast.error("Failed to update");
    }
  };

  const openEdit = (order) => {
    setEditingOrder({ ...order }); // Copy object to avoid direct mutation
  };

  return (
    <div>
      <h1 className="text-3xl font-serif text-dark mb-6">
        Manage Orders (B2B)
      </h1>
      <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Paid</th>
              <th className="p-4">Balance</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4">#{order.id}</td>
                <td className="p-4">
                  <div className="font-bold">{order.full_name}</div>
                  <div className="text-xs text-gray-500">{order.phone}</div>
                </td>
                <td className="p-4 font-bold">₹{order.total_amount}</td>
                <td className="p-4 text-green-600">₹{order.amount_paid}</td>
                <td className="p-4 text-red-600 font-bold">₹{order.balance}</td>
                <td className="p-4 text-sm">{order.status}</td>
                <td className="p-4">
                  <button
                    onClick={() => openEdit(order)}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Manage Order #{editingOrder.id}
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold">Order Status</label>
                <select
                  value={editingOrder.status}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, status: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <hr />

              <div>
                <label className="block text-sm font-bold">
                  Payment Received (₹)
                </label>
                <input
                  type="number"
                  value={editingOrder.amount_paid}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      amount_paid: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-bold">
                  Payment Method
                </label>
                <select
                  value={editingOrder.payment_method}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      payment_method: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="Credit">Credit (Pay Later)</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold">Payment Notes</label>
                <textarea
                  placeholder="e.g. Cheque #554433"
                  value={editingOrder.payment_note}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      payment_note: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
