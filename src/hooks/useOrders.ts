import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Order, OrderItem, CartItem } from '../types';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQRCode = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 6);
    return `UB-${timestamp}-${random}`.toUpperCase();
  };

  const createOrder = async (
    customerName: string,
    customerPhone: string,
    cartItems: CartItem[],
    paymentMethod: 'qris' | 'cashier',
    notes?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (!customerName.trim() || !customerPhone.trim() || cartItems.length === 0) {
        throw new Error('Data pesanan tidak lengkap');
      }

      const totalAmount = cartItems.reduce((total, item) => total + (item.menu_item.price * item.quantity), 0);
      const qrCode = paymentMethod === 'cashier' ? generateQRCode() : undefined;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: customerName,
          customer_phone: customerPhone,
          total_amount: totalAmount,
          payment_method: paymentMethod,
          qr_code: qrCode,
          notes: notes || null,
          payment_status: 'pending',
          order_status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        menu_item_id: item.menu_item.id,
        quantity: item.quantity,
        price: item.menu_item.price,
        subtotal: item.menu_item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Add order items to the returned order
      const orderWithItems = {
        ...order,
        order_items: orderItems.map(item => ({
          ...item,
          menu_item: cartItems.find(cartItem => cartItem.menu_item.id === item.menu_item_id)?.menu_item
        }))
      };

      return { data: orderWithItems, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create order';
      setError(error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getOrderByQRCode = async (qrCode: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (*)
          )
        `)
        .eq('qr_code', qrCode)
        .single();

      if (error) throw error;
      
      const orderWithItems = {
        ...data,
        order_items: data.order_items?.map((item: any) => ({
          ...item,
          menu_item: item.menu_items
        })) || []
      };
      
      return { data: orderWithItems, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Order not found';
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const getOrdersByPhone = async (phone: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            menu_items (*)
          )
        `)
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const ordersWithItems = data?.map(order => ({
        ...order,
        order_items: order.order_items?.map((item: any) => ({
          ...item,
          menu_item: item.menu_items
        })) || []
      })) || [];
      
      return { data: ordersWithItems, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to fetch orders';
      return { data: [], error };
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['order_status']) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          order_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update order status';
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (orderId: string, status: Order['payment_status']) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          payment_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update payment status';
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    getOrderByQRCode,
    getOrdersByPhone,
    updateOrderStatus,
    updatePaymentStatus,
  };
};