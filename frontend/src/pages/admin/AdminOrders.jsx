import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'packed', label: 'Packed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

const paymentStatusClass = (status) => {
  const s = String(status || 'pending').toLowerCase();
  if (s === 'paid') return 'bg-green-100 text-green-700 border border-green-200';
  if (s === 'failed') return 'bg-rose-100 text-rose-700 border border-rose-200';
  if (s === 'refunded') return 'bg-blue-100 text-blue-700 border border-blue-200';
  return 'bg-gray-100 text-gray-700 border border-gray-200';
};

const orderStatusClass = (status) => {
  const s = String(status || 'pending').toLowerCase();
  if (s === 'pending') return 'bg-amber-100 text-amber-700 border border-amber-200';
  if (s === 'confirmed') return 'bg-blue-100 text-blue-700 border border-blue-200';
  if (s === 'packed') return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
  if (s === 'shipped') return 'bg-sky-100 text-sky-700 border border-sky-200';
  if (s === 'delivered') return 'bg-green-100 text-green-700 border border-green-200';
  if (s === 'returned') return 'bg-purple-100 text-purple-700 border border-purple-200';
  if (s === 'cancelled') return 'bg-rose-100 text-rose-700 border border-rose-200';
  return 'bg-gray-100 text-gray-700 border border-gray-200';
};

const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [updatingId, setUpdatingId] = useState('');
  const [toast, setToast] = useState({ show: false, text: '', type: 'success' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.admin.listOrders();
        if (mounted) setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message || 'Failed to load orders');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const normalizedStatus = (o) => o.orderStatus || o.status || 'pending';
  const normalizedPaymentStatus = (o) => o.paymentStatus || (o.status === 'failed' ? 'failed' : o.status === 'paid' ? 'paid' : 'pending');
  const normalizedPaymentMethod = (o) => (o.paymentMethod || (o.razorpayPaymentId ? 'razorpay' : 'cod')).toUpperCase();

  const showToast = (text, type = 'success') => {
    setToast({ show: true, text, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
  };

  const filterByDate = (createdAt) => {
    if (!createdAt) return true;
    const ts = new Date(createdAt).getTime();
    if (dateFrom && ts < new Date(dateFrom).getTime()) return false;
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      if (ts > end.getTime()) return false;
    }
    return true;
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const statusOk = orderStatus === 'all' || normalizedStatus(o) === orderStatus;
      const payOk = paymentStatus === 'all' || normalizedPaymentStatus(o) === paymentStatus;
      const dateOk = filterByDate(o.createdAt);
      const text = `${o.user?.name || ''} ${o.user?.email || ''} ${o._id || ''}`.toLowerCase();
      const searchOk = !q || text.includes(q);
      return statusOk && payOk && dateOk && searchOk;
    });
  }, [orders, search, orderStatus, paymentStatus, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search, orderStatus, paymentStatus, pageSize, dateFrom, dateTo]);

  const renderAddress = (a) => {
    if (!a) return <span className="text-gray-400">No address</span>;
    return (
      <div className="max-w-xs">
        <div className="font-medium">{a.fullName}</div>
        <div className="text-gray-600 text-xs">{a.mobileNumber || a.alternatePhone}</div>
        <div className="text-gray-700 text-sm line-clamp-2">{a.address}{a.landmark ? `, ${a.landmark}` : ''}</div>
        <div className="text-gray-500 text-xs">{a.city}, {a.state} - {a.pincode}</div>
      </div>
    );
  };

  const draftStatus = (id, fallback) => statusDrafts[id] ?? normalizedStatus(fallback || {});

  const saveStatus = async (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) return;
    const nextStatus = draftStatus(orderId, order);
    if (nextStatus === normalizedStatus(order)) return;

    setUpdatingId(orderId);
    setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, orderStatus: nextStatus, status: nextStatus } : o));

    try {
      const updated = await api.admin.updateOrder(orderId, { orderStatus: nextStatus });
      setOrders((prev) => prev.map((o) => o._id === orderId ? updated : o));
      showToast('Order status updated');
    } catch (e) {
      setOrders((prev) => prev.map((o) => o._id === orderId ? order : o));
      showToast(e.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingId('');
    }
  };

  const quickAction = async (orderId, action) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) return;
    setUpdatingId(orderId);
    try {
      const updated = await api.admin.updateOrder(orderId, { action, ...(action === 'refund' ? { paymentStatus: 'refunded' } : {}) });
      setOrders((prev) => prev.map((o) => o._id === orderId ? updated : o));
      showToast(action === 'refund' ? 'Order refunded' : 'Order cancelled');
    } catch (e) {
      showToast(e.message || 'Update failed', 'error');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-3">
      {toast.show && (
        <div className={`${toast.type==='error' ? 'bg-rose-600' : 'bg-amber-600'} fixed bottom-4 right-4 z-50 text-white px-4 py-2 rounded shadow-lg`}>
          {toast.text}
        </div>
      )}
      {loading ? (
        <div className="p-4">Loading...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm ring-1 ring-rose-50">
          <div className="px-4 py-3 border-b font-semibold">Admin Orders</div>

          <div className="p-4 space-y-3">
            <div className="flex flex-col lg:flex-row gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Order ID or Customer Name/Email"
                className="border rounded px-3 py-2 w-full lg:max-w-sm"
              />
              <div className="flex flex-wrap gap-3">
                <select className="border rounded px-3 py-2" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                  <option value="all">All Order Status</option>
                  {ORDER_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <select className="border rounded px-3 py-2" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                  <option value="all">All Payment Status</option>
                  {PAYMENT_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <input type="date" className="border rounded px-3 py-2" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                <input type="date" className="border rounded px-3 py-2" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows</span>
                  <select className="border rounded px-2 py-2" value={pageSize} onChange={(e)=>setPageSize(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y">
            {pageItems.map((o) => (
              <div key={o._id} className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">#{String(o._id).slice(-6)}</div>
                  <div className="text-sm">{formatINR(o.amount)}</div>
                </div>
                <div className="text-sm text-gray-800">{o.user?.name}</div>
                <div className="text-xs text-gray-500">{o.user?.email}</div>
                <div className="text-xs text-gray-500">
                  <div>{new Date(o.createdAt).toLocaleDateString('en-GB')}</div>
                  <div className="text-gray-400">{new Date(o.createdAt).toLocaleTimeString('en-GB')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${orderStatusClass(normalizedStatus(o))}`}>
                    {String(normalizedStatus(o)).replace(/_/g, ' ')}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusClass(normalizedPaymentStatus(o))}`}>
                    {String(normalizedPaymentStatus(o)).replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-gray-600 border rounded px-2 py-0.5">{normalizedPaymentMethod(o)}</span>
                </div>
                <select
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={draftStatus(o._id, o)}
                  onChange={(e) => setStatusDrafts((prev) => ({ ...prev, [o._id]: e.target.value }))}
                >
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => navigate(`/admin/orders/${o._id}`)}
                    className="px-3 py-1 rounded border text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => saveStatus(o._id)}
                    disabled={updatingId === o._id || draftStatus(o._id, o) === normalizedStatus(o)}
                    className={`px-3 py-1 rounded text-white text-sm ${updatingId===o._id ? 'bg-gray-400' : 'bg-rose-600 hover:bg-rose-700'} disabled:opacity-60`}
                  >
                    {updatingId === o._id ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-rose-50/60 text-rose-700">
                <tr className="text-left border-b border-rose-100">
                  <th className="p-2 whitespace-nowrap">Order ID</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Order Date</th>
                  <th className="p-2 whitespace-nowrap">Total Amount</th>
                  <th className="p-2">Payment Method</th>
                  <th className="p-2">Payment Status</th>
                  <th className="p-2">Order Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((o) => (
                  <tr key={o._id} className="border-b hover:bg-rose-50/40">
                    <td className="p-2 whitespace-nowrap font-medium">#{String(o._id).slice(-6)}</td>
                    <td className="p-2 max-w-[220px]">
                      <div className="truncate font-medium">{o.user?.name || 'Customer'}</div>
                      <div className="text-gray-500 text-xs truncate">{renderAddress(o.address)}</div>
                    </td>
                    <td className="p-2 text-gray-700">
                      <div className="text-sm">{new Date(o.createdAt).toLocaleDateString('en-GB')}</div>
                      <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleTimeString('en-GB')}</div>
                    </td>
                    <td className="p-2 whitespace-nowrap">{formatINR(o.amount)}</td>
                    <td className="p-2">
                      <span className="px-2 py-0.5 rounded-full border text-xs font-medium text-gray-700">
                        {normalizedPaymentMethod(o)}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusClass(normalizedPaymentStatus(o))}`}>
                        {String(normalizedPaymentStatus(o)).replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={draftStatus(o._id, o)}
                          onChange={(e) => setStatusDrafts((prev) => ({ ...prev, [o._id]: e.target.value }))}
                        >
                          {ORDER_STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${orderStatusClass(draftStatus(o._id, o))}`}>
                          {String(draftStatus(o._id, o)).replace(/_/g, ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate(`/admin/orders/${o._id}`)}
                          className="px-3 py-1 rounded border text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => saveStatus(o._id)}
                          disabled={updatingId===o._id || draftStatus(o._id, o)===normalizedStatus(o)}
                          className={`px-3 py-1 rounded text-white text-sm ${updatingId===o._id ? 'bg-gray-400' : 'bg-rose-600 hover:bg-rose-700'} disabled:opacity-60`}
                        >
                          {updatingId===o._id ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => quickAction(o._id, 'cancel')}
                          disabled={updatingId === o._id}
                          className="px-3 py-1 rounded border text-sm text-rose-600 border-rose-200 hover:bg-rose-50 disabled:opacity-60"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => quickAction(o._id, 'refund')}
                          disabled={updatingId === o._id}
                          className="px-3 py-1 rounded border text-sm text-blue-600 border-blue-200 hover:bg-blue-50 disabled:opacity-60"
                        >
                          Refund
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
            <div className="flex gap-2">
              <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className={`px-3 py-1 rounded border ${page<=1? 'text-gray-400 bg-gray-50' : 'hover:bg-gray-50'}`}>Prev</button>
              <button disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className={`px-3 py-1 rounded border ${page>=totalPages? 'text-gray-400 bg-gray-50' : 'hover:bg-gray-50'}`}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;





