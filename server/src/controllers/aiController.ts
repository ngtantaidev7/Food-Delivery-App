import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Food } from '../models/Food';
import { Order } from '../models/Order';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ── AI Chat — Food Recommendation ─────────────────────────────────────────────
export const aiChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, userId, history = [] } = req.body;

    if (!message?.trim()) {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }

    // Fetch menu context from DB (only available foods)
    const foods = await Food.find({ isAvailable: true })
      .populate('restaurantId', 'name address tags priceRange')
      .populate('categoryId', 'name')
      .select('name description basePrice options restaurantId categoryId')
      .limit(100)
      .lean();

    // Fetch user order history for personalization
    let orderHistory: string[] = [];
    if (userId) {
      const recentOrders = await Order.find({ customerId: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('items')
        .lean();

      orderHistory = recentOrders.flatMap((o) =>
        o.items.map((i: any) => i.foodName)
      );
    }

    // Build menu context string for Gemini
    const menuContext = foods
      .map((f) => {
        const rest = f.restaurantId as any;
        const cat = f.categoryId as any;
        const sizes = f.options?.sizes?.length
          ? `Sizes: ${f.options.sizes.map((s: any) => `${s.name}(+$${s.extraPrice})`).join(', ')}`
          : '';
        const toppings = f.options?.toppings?.length
          ? `Toppings: ${f.options.toppings.map((t: any) => t.name).join(', ')}`
          : '';
        return `- "${f.name}" | Category: ${cat?.name || 'N/A'} | Price: $${f.basePrice} | Restaurant: ${rest?.name || 'N/A'} | ${sizes} ${toppings} | ${f.description || ''}`;
      })
      .join('\n');

    const systemPrompt = `Bạn là AI assistant của ứng dụng Food Delivery. Nhiệm vụ của bạn là:
1. Gợi ý món ăn phù hợp dựa trên yêu cầu của khách hàng
2. Trả lời câu hỏi về menu, giá cả, nhà hàng
3. Gợi ý cá nhân hóa dựa trên lịch sử đặt hàng

THÔNG TIN MENU HIỆN TẠI:
${menuContext}

${orderHistory.length > 0 ? `LỊCH SỬ ĐẶT HÀNG GẦN ĐÂY CỦA NGƯỜI DÙNG:\n${orderHistory.join(', ')}` : ''}

QUY TẮC:
- Chỉ gợi ý món có trong menu trên
- Trả lời bằng tiếng Việt ngắn gọn, thân thiện
- Khi gợi ý món, luôn kèm tên nhà hàng và giá
- Nếu không có món phù hợp, giải thích lý do
- Không bịa thêm món ăn không có trong menu`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: systemPrompt,
    });

    // Build chat history for multi-turn conversation
    const chatHistory = history.map((h: { role: string; text: string }) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    res.json({
      success: true,
      data: {
        reply,
        role: 'model',
      },
    });
  } catch (error: any) {
    console.error('[AI] aiChat error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Route Optimization via OSRM (free, no API key needed) ─────────────────────
export const optimizeRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { driverLocation, restaurantLocation, customerLocation } = req.body;

    // Validate required coordinates
    if (!driverLocation || !restaurantLocation || !customerLocation) {
      res.status(400).json({ success: false, message: 'driverLocation, restaurantLocation, customerLocation are required' });
      return;
    }

    const { latitude: dLat, longitude: dLng } = driverLocation;
    const { latitude: rLat, longitude: rLng } = restaurantLocation;
    const { latitude: cLat, longitude: cLng } = customerLocation;

    // OSRM Route: Driver → Restaurant → Customer
    // Format: lng,lat (OSRM uses longitude first)
    const coords = `${dLng},${dLat};${rLng},${rLat};${cLng},${cLat}`;
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`;

    const response = await fetch(osrmUrl, {
      headers: { 'User-Agent': 'FoodDeliveryApp/1.0' },
    });

    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data: any = await response.json();

    if (data.code !== 'Ok' || !data.routes?.length) {
      res.status(400).json({ success: false, message: 'Could not find a route' });
      return;
    }

    const route = data.routes[0];
    const distanceKm = (route.distance / 1000).toFixed(2);
    const durationMin = Math.ceil(route.duration / 60);

    // Extract polyline coordinates [lat, lng] for react-native-maps
    const polylineCoords = route.geometry.coordinates.map(([lng, lat]: [number, number]) => ({
      latitude: lat,
      longitude: lng,
    }));

    res.json({
      success: true,
      data: {
        polylineCoords,
        distanceKm: parseFloat(distanceKm),
        durationMin,
        etaText: durationMin < 60
          ? `${durationMin} phút`
          : `${Math.floor(durationMin / 60)}h ${durationMin % 60}p`,
        waypoints: {
          driver: { latitude: dLat, longitude: dLng },
          restaurant: { latitude: rLat, longitude: rLng },
          customer: { latitude: cLat, longitude: cLng },
        },
      },
    });
  } catch (error: any) {
    console.error('[AI] optimizeRoute error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
