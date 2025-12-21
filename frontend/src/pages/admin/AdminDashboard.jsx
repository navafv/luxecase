import { useEffect, useState } from 'react';
import api from '../../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaDollarSign, FaShoppingBag, FaUsers } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow flex items-center">
        <div className={`p-4 rounded-full text-white mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-2xl font-bold font-serif">{value}</h3>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        api.get('orders/analytics/')
            .then(res => setData(res.data))
            .catch(console.error);
    }, []);

    if (!data) return <div className="p-8">Loading Analytics...</div>;

    return (
        <div>
            <h1 className="text-3xl font-serif text-dark mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Total Revenue" 
                    value={`₹${data.total_revenue.toLocaleString()}`} 
                    icon={<FaDollarSign size={24} />} 
                    color="bg-green-500" 
                />
                <StatCard 
                    title="Total Orders" 
                    value={data.total_orders} 
                    icon={<FaShoppingBag size={24} />} 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Total Customers" 
                    value={data.total_users} 
                    icon={<FaUsers size={24} />} 
                    color="bg-purple-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-6">Monthly Revenue</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.sales_data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="#D4AF37" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                    <ul className="space-y-4">
                        {data.recent_orders.map(order => (
                            <li key={order.id} className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <p className="font-semibold">#{order.id} - {order.full_name}</p>
                                    <p className="text-sm text-gray-500">{order.status}</p>
                                </div>
                                <span className="font-bold">₹{order.total_amount}</span>
                            </li>
                        ))}
                        {data.recent_orders.length === 0 && <p>No orders yet.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;