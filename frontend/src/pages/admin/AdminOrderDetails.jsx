import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const PAYMENT_STATUS_OPTIONS = ['paid', 'pending', 'failed', 'refunded'];

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

// Get selected size from order item, fallback to product metadata
const getSizeInfo = (item, product) => {
  // Priority 1: Selected size from order item (user's choice)
  if (item?.size) {
    return `Selected Size: ${item.size}`;
  }
  // Priority 2: Product metadata (fallback)
  const info = product?.product_info || {};
  if (info.pantWaist) return `Waist: ${info.pantWaist}`;
  if (info.tshirtSize) return `Size: ${info.tshirtSize}`;
  if (Array.isArray(info.availableSizes) && info.availableSizes.length > 0) {
    return `Size: ${info.availableSizes.join(', ')}`;
  }
  return '';
};

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusDraft, setStatusDraft] = useState('');
  const [paymentStatusDraft, setPaymentStatusDraft] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.admin.getOrder(id);
        if (!mounted) return;
        setOrder(data);
        setStatusDraft(data?.orderStatus || data?.status || 'pending');
        setPaymentStatusDraft(data?.paymentStatus || 'pending');
      } catch (e) {
        setError(e.message || 'Failed to load order');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const normalizedPaymentMethod = useMemo(() => {
    if (!order) return '';
    return (order.paymentMethod || (order.razorpayPaymentId ? 'razorpay' : 'cod')).toUpperCase();
  }, [order]);

  const paymentStatus = useMemo(() => order?.paymentStatus || (order?.status === 'failed' ? 'failed' : order?.status === 'paid' ? 'paid' : 'pending'), [order]);
  const orderStatus = useMemo(() => order?.orderStatus || order?.status || 'pending', [order]);
  const transactionId = order?.transactionId || order?.razorpayPaymentId || order?.razorpayOrderId || '—';

  const subtotal = useMemo(() => {
    if (!order?.items) return 0;
    return order.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  }, [order]);
  const total = Number(order?.amount || 0);
  const discount = Math.max(0, subtotal - total);

  const updateOrder = async (payload) => {
    setSaving(true);
    try {
      const updated = await api.admin.updateOrder(id, payload);
      setOrder(updated);
      setStatusDraft(updated.orderStatus || updated.status || 'pending');
      setPaymentStatusDraft(updated.paymentStatus || 'pending');
    } catch (e) {
      setError(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const saveStatus = async () => {
    await updateOrder({ orderStatus: statusDraft, paymentStatus: paymentStatusDraft });
  };

  const addNote = async () => {
    const trimmed = note.trim();
    if (!trimmed) return;
    await updateOrder({ adminNote: trimmed });
    setNote('');
  };

  const quickAction = async (action) => {
    await updateOrder({ action, ...(action === 'refund' ? { paymentStatus: 'refunded' } : {}) });
  };

  const renderAddress = (a) => {
    if (!a) return <span className="text-gray-400">No address</span>;
    return (
      <div className="space-y-0.5 text-sm">
        <div className="font-medium">{a.fullName}</div>
        <div className="text-gray-600">{a.mobileNumber || a.alternatePhone}</div>
        <div className="text-gray-700">{a.address}{a.landmark ? `, ${a.landmark}` : ''}</div>
        <div className="text-gray-500">{a.city}, {a.state} - {a.pincode}</div>
      </div>
    );
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!order) return <div className="p-4 text-gray-600">Order not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="px-3 py-1.5 rounded border text-sm">Back</button>
        <div className="flex gap-2">
          <button onClick={() => quickAction('cancel')} className="px-3 py-1.5 rounded border text-sm text-rose-600 border-rose-200 hover:bg-rose-50" disabled={saving}>Cancel</button>
          <button onClick={() => quickAction('refund')} className="px-3 py-1.5 rounded border text-sm text-blue-600 border-blue-200 hover:bg-blue-50" disabled={saving}>Refund</button>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="text-sm text-gray-500">Order ID</div>
            <div className="text-lg font-semibold">#{String(order._id).slice(-8)}</div>
            <div className="text-xs text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${orderStatusClass(orderStatus)}`}>{String(orderStatus).replace(/_/g, ' ')}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusClass(paymentStatus)}`}>{String(paymentStatus).replace(/_/g, ' ')}</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium border text-gray-700">{normalizedPaymentMethod}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 border rounded-lg bg-gray-50">
            <div className="text-sm font-semibold mb-1">Customer</div>
            <div className="text-gray-800">{order.user?.name || 'Customer'}</div>
            <div className="text-gray-600 text-sm">{order.user?.email || '—'}</div>
          </div>
          <div className="p-3 border rounded-lg bg-gray-50">
            <div className="text-sm font-semibold mb-1">Shipping Address</div>
            {renderAddress(order.address || order.shippingAddress)}
          </div>
          <div className="p-3 border rounded-lg bg-gray-50 space-y-1">
            <div className="text-sm font-semibold">Payment</div>
            <div className="text-gray-700 text-sm">Method: {normalizedPaymentMethod}</div>
            <div className="text-gray-700 text-sm">Transaction ID: {transactionId}</div>
            <div className="text-gray-700 text-sm">Amount: {formatINR(order.amount)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Order Status</div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="border rounded px-3 py-2 text-sm"
                value={statusDraft}
                onChange={(e) => setStatusDraft(e.target.value)}
              >
                {ORDER_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${orderStatusClass(statusDraft)}`}>
                {String(statusDraft).replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold">Payment Status</div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="border rounded px-3 py-2 text-sm"
                value={paymentStatusDraft}
                onChange={(e) => setPaymentStatusDraft(e.target.value)}
              >
                {PAYMENT_STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusClass(paymentStatusDraft)}`}>
                {String(paymentStatusDraft).replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <button
            onClick={saveStatus}
            disabled={saving}
            className="px-4 py-2 rounded text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Update Status'}
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-semibold">Admin Notes</div>
          <div className="flex flex-col md:flex-row gap-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="border rounded px-3 py-2 flex-1"
              placeholder="Add an internal note"
            />
            <button
              onClick={addNote}
              disabled={saving || !note.trim()}
              className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
            >
              Add Note
            </button>
          </div>
          {order.adminNotes?.length > 0 && (
            <div className="border rounded p-3 bg-gray-50 space-y-2">
              {order.adminNotes.map((n, idx) => (
                <div key={`${idx}-${n.createdAt}`} className="text-sm">
                  <div className="text-gray-800">{n.note}</div>
                  <div className="text-xs text-gray-500">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm">
        <div className="px-4 py-3 border-b font-semibold">Products</div>
        <div className="divide-y">
          {order.items?.map((item, idx) => {
            const product = item.product || {};
            const img = Array.isArray(product.images) ? (product.images[0]?.url || product.images[0]) : (product.images?.image1 || '');
            const subtotalItem = (item.price || 0) * (item.quantity || 1);
            const sizeInfo = getSizeInfo(item, product);
            return (
              <div key={`${item.product?._id || idx}-${idx}`} className="p-3 flex gap-3">
                <div className="h-16 w-16 rounded border bg-gray-50 overflow-hidden flex-shrink-0">
                  {img ? <img src={img} alt={product.title} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">No image</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{product.title || 'Product'}</div>
                  {sizeInfo && <div className="text-xs text-gray-600 font-medium">{sizeInfo}</div>}
                  <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                  <div className="text-xs text-gray-500">Price: {formatINR(item.price)}</div>
                </div>
                <div className="text-sm font-semibold">{formatINR(subtotalItem)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-4 space-y-2">
        <div className="text-sm font-semibold">Price Breakdown</div>
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
        <div className="flex justify-between text-sm"><span>Discount</span><span>{formatINR(discount)}</span></div>
        <div className="flex justify-between text-sm"><span>Tax</span><span>₹0</span></div>
        <div className="flex justify-between text-sm"><span>Shipping</span><span>₹0</span></div>
        <div className="flex justify-between text-base font-semibold border-t pt-2"><span>Total</span><span>{formatINR(total)}</span></div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;

