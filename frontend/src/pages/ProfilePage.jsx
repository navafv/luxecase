import { useEffect, useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '', address_line: '', city: '', state: '', postal_code: '', phone: ''
    });

    const fetchAddresses = () => {
        api.get('users/addresses/').then(res => setAddresses(res.data));
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleDelete = async (id) => {
        if(confirm('Delete address?')) {
            await api.delete(`users/addresses/${id}/`);
            toast.success('Address deleted');
            fetchAddresses();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('users/addresses/', formData);
            toast.success('Address saved!');
            setShowForm(false);
            fetchAddresses();
            setFormData({ full_name: '', address_line: '', city: '', state: '', postal_code: '', phone: '' });
        } catch {
            toast.error('Failed to save address');
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-serif text-dark mb-6">My Account</h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Address Book */}
                <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Saved Addresses</h2>
                        <button onClick={() => setShowForm(!showForm)} className="text-primary hover:underline">
                            {showForm ? 'Cancel' : '+ Add New'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="full_name" placeholder="Full Name" onChange={handleChange} required className="border p-2 rounded" />
                            <input name="phone" placeholder="Phone" onChange={handleChange} required className="border p-2 rounded" />
                            <input name="address_line" placeholder="Address (House, Street)" onChange={handleChange} required className="border p-2 rounded md:col-span-2" />
                            <input name="city" placeholder="City" onChange={handleChange} required className="border p-2 rounded" />
                            <input name="state" placeholder="State" onChange={handleChange} required className="border p-2 rounded" />
                            <input name="postal_code" placeholder="Postal Code" onChange={handleChange} required className="border p-2 rounded" />
                            <button type="submit" className="bg-dark text-white py-2 rounded md:col-span-2 hover:bg-primary transition">Save Address</button>
                        </form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map(addr => (
                            <div key={addr.id} className="bg-white p-4 rounded shadow border border-gray-100 relative">
                                <h3 className="font-bold">{addr.full_name}</h3>
                                <p className="text-sm text-gray-600">{addr.address_line}</p>
                                <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.postal_code}</p>
                                <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
                                <button onClick={() => handleDelete(addr.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-sm">Delete</button>
                            </div>
                        ))}
                        {addresses.length === 0 && !showForm && <p className="text-gray-500">No saved addresses.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;