import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import { User } from './models/User';
import { Restaurant } from './models/Restaurant';
import { Category } from './models/Category';
import { Food } from './models/Food';
import { Voucher } from './models/Voucher';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in server/.env');
    }

    console.log('🔄 Đang kết nối tới MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Đã kết nối MongoDB Atlas!');

    // 1. Xoá dữ liệu cũ để tránh trùng lặp
    console.log('🧹 Đang làm sạch dữ liệu cũ...');
    await Promise.all([
      User.deleteMany({}),
      Restaurant.deleteMany({}),
      Category.deleteMany({}),
      Food.deleteMany({}),
      Voucher.deleteMany({}),
    ]);

    // 2. Tạo Người dùng mẫu (Khách hàng & Tài xế chuẩn UI)
    console.log('👤 Đang tạo User & Driver mẫu...');
    const [customer, driver] = await User.create([
      {
        fullName: 'Tai Nguyen',
        phone: '0901234567',
        email: 'customer@gmail.com',
        role: 'customer',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        addresses: [
          {
            label: 'Home',
            addressLine: '201 Katlian No.21 Street',
            location: {
              type: 'Point',
              coordinates: [106.682, 10.7769], // [kinh độ, vĩ độ]
            },
            isDefault: true,
          },
          {
            label: 'Work',
            addressLine: '88 Innovation Boulevard, Suite 500',
            location: {
              type: 'Point',
              coordinates: [106.7009, 10.7758],
            },
            isDefault: false,
          },
        ],
      },
      {
        fullName: 'John Cooper',
        phone: '0988776655',
        email: 'john.driver@gmail.com',
        role: 'driver',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
        addresses: [
          {
            label: 'Home',
            addressLine: '45 Driver Central Road',
            location: {
              type: 'Point',
              coordinates: [106.685, 10.78],
            },
            isDefault: true,
          },
        ],
      },
    ]);

    // 3. Tạo Danh mục (Trang 1 PDF)
    console.log('📂 Đang tạo Categories...');
    const categories = await Category.create([
      {
        name: 'Rice',
        slug: 'rice',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3174/3174880.png',
        displayOrder: 1,
      },
      {
        name: 'Healthy',
        slug: 'healthy',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2909/2909808.png',
        displayOrder: 2,
      },
      {
        name: 'Drink',
        slug: 'drink',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png',
        displayOrder: 3,
      },
      {
        name: 'Fastfood',
        slug: 'fastfood',
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
        displayOrder: 4,
      },
    ]);

    const catFastfood = categories.find((c) => c.slug === 'fastfood')!;
    const catHealthy = categories.find((c) => c.slug === 'healthy')!;
    const catDrink = categories.find((c) => c.slug === 'drink')!;
    const catRice = categories.find((c) => c.slug === 'rice')!;

    // 4. Tạo Nhà hàng mẫu (Chuẩn tên, tag, thông số trong PDF)
    console.log('🏪 Đang tạo Restaurants...');
    const restaurants = await Restaurant.create([
      {
        name: 'Hana Chicken',
        imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
        openTime: '06:00',
        closeTime: '21:00',
        location: {
          type: 'Point',
          coordinates: [106.685, 10.779],
        },
        address: '124 Pham Van Dong, Go Vap, TP.HCM',
        ratingAverage: 4.8,
        totalReviews: 289,
        tags: ['Freeship', 'Near you', 'Deal $1', 'Popular'],
        priceRange: { min: 5, max: 50 },
      },
      {
        name: 'Bamsu Restaurant',
        imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
        openTime: '07:00',
        closeTime: '22:00',
        location: {
          type: 'Point',
          coordinates: [106.688, 10.782],
        },
        address: '56 Nguyen Dinh Chieu, Quan 1, TP.HCM',
        ratingAverage: 4.1,
        totalReviews: 145,
        tags: ['Freeship', 'Near you'],
        priceRange: { min: 8, max: 40 },
      },
      {
        name: 'Neighbor Milk',
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
        openTime: '08:00',
        closeTime: '22:00',
        location: {
          type: 'Point',
          coordinates: [106.69, 10.775],
        },
        address: '12 Vo Van Tan, Quan 3, TP.HCM',
        ratingAverage: 4.1,
        totalReviews: 88,
        tags: ['Freeship'],
        priceRange: { min: 3, max: 20 },
      },
      {
        name: "B'Fresh Coffee",
        imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
        openTime: '06:30',
        closeTime: '22:30',
        location: {
          type: 'Point',
          coordinates: [106.683, 10.778],
        },
        address: '99 Pasteur, Ben Nghe, Quan 1, TP.HCM',
        ratingAverage: 4.5,
        totalReviews: 210,
        tags: ['Freeship', 'Near you'],
        priceRange: { min: 4, max: 25 },
      },
      {
        name: 'Laura Green',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        openTime: '08:00',
        closeTime: '20:30',
        location: {
          type: 'Point',
          coordinates: [106.681, 10.774],
        },
        address: '77 Le Duan, Ben Nghe, Quan 1, TP.HCM',
        ratingAverage: 4.2,
        totalReviews: 120,
        tags: ['Deal $1'],
        priceRange: { min: 6, max: 35 },
      },
    ]);

    const hanaChicken = restaurants.find((r) => r.name === 'Hana Chicken')!;
    const bamsu = restaurants.find((r) => r.name === 'Bamsu Restaurant')!;

    // 5. Tạo Món ăn (Đặc biệt: Fried Chicken chuẩn xác Trang 5 PDF)
    console.log('🍗 Đang tạo Foods chi tiết...');
    await Food.create([
      {
        restaurantId: hanaChicken._id,
        categoryId: catFastfood._id,
        name: 'Fried Chicken',
        description: 'Crispy fried wings, thigh',
        imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
        basePrice: 15,
        options: {
          sizes: [
            { name: 'S', extraPrice: 0 },
            { name: 'M', extraPrice: 5 },
            { name: 'L', extraPrice: 10 },
          ],
          toppings: [
            { name: 'Corn', extraPrice: 2 },
            { name: 'Cheese Cheddar', extraPrice: 5 },
            { name: 'Salted egg', extraPrice: 10 },
          ],
          spicinessOptions: ['No', 'Hot', 'Very hot'],
        },
        isAvailable: true,
      },
      {
        restaurantId: hanaChicken._id,
        categoryId: catHealthy._id,
        name: 'Chicken Salad',
        description: 'Fresh salad with roasted sesame sauce',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        basePrice: 10,
        options: {
          sizes: [
            { name: 'Regular', extraPrice: 0 },
            { name: 'Large', extraPrice: 4 },
          ],
          toppings: [
            { name: 'Extra Sauce', extraPrice: 1 },
            { name: 'Boiled Egg', extraPrice: 2 },
          ],
          spicinessOptions: ['No'],
        },
        isAvailable: true,
      },
      {
        restaurantId: hanaChicken._id,
        categoryId: catFastfood._id,
        name: 'Spicy Chicken',
        description: 'Deep fried tender chicken with spicy dip',
        imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80',
        basePrice: 15,
        options: {
          sizes: [
            { name: 'S', extraPrice: 0 },
            { name: 'M', extraPrice: 5 },
          ],
          toppings: [{ name: 'Cheese Sauce', extraPrice: 3 }],
          spicinessOptions: ['Hot', 'Very hot'],
        },
        isAvailable: true,
      },
      {
        restaurantId: hanaChicken._id,
        categoryId: catFastfood._id,
        name: 'Fried Potatos',
        description: 'Crispy French fries with ketchup',
        imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
        basePrice: 15,
        options: {
          sizes: [
            { name: 'Standard', extraPrice: 0 },
            { name: 'Jumbo', extraPrice: 3 },
          ],
          toppings: [{ name: 'Cheese Dip', extraPrice: 2 }],
          spicinessOptions: ['No', 'Hot'],
        },
        isAvailable: true,
      },
      {
        restaurantId: hanaChicken._id,
        categoryId: catRice._id,
        name: 'Sauté Chicken Rice',
        description: 'Sauté chicken, Rice & fresh cucumber',
        imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
        basePrice: 15,
        options: {
          sizes: [{ name: 'Normal', extraPrice: 0 }],
          toppings: [{ name: 'Fried Egg', extraPrice: 2 }],
          spicinessOptions: ['No', 'Hot'],
        },
        isAvailable: true,
      },
      {
        restaurantId: hanaChicken._id,
        categoryId: catFastfood._id,
        name: 'Chicken Burger',
        description: 'Fried chicken, Cheese & Burger',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        basePrice: 15,
        options: {
          sizes: [{ name: 'Single', extraPrice: 0 }, { name: 'Double', extraPrice: 4 }],
          toppings: [{ name: 'Bacon', extraPrice: 3 }],
          spicinessOptions: ['No', 'Hot'],
        },
        isAvailable: true,
      },
      // Combo items (Trang 4)
      {
        restaurantId: hanaChicken._id,
        categoryId: catFastfood._id,
        name: 'Combo B - Chicken Rice & Salad',
        description: 'Fried Chicken, Chicken Rice & Salad',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        basePrice: 25,
        options: {
          sizes: [{ name: 'Set', extraPrice: 0 }],
          toppings: [],
          spicinessOptions: ['No', 'Hot'],
        },
        isAvailable: true,
      },
      {
        restaurantId: bamsu._id,
        categoryId: catFastfood._id,
        name: 'Chicken Sandwich',
        description: 'Grilled chicken sandwich with fresh greens',
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
        basePrice: 26,
        options: {
          sizes: [{ name: 'Standard', extraPrice: 0 }],
          toppings: [],
          spicinessOptions: ['No'],
        },
        isAvailable: true,
      },
    ]);

    // 6. Tạo 5 Voucher chuẩn theo Trang 6 PDF
    console.log('🎟️ Đang tạo Vouchers...');
    const now = new Date();
    const futureDate = new Date(now.setMonth(now.getMonth() + 6));

    await Voucher.create([
      {
        title: '- 10%',
        type: 'percentage',
        discountValue: 10,
        minBillValue: 20,
        maxDiscount: 10,
        validUntil: futureDate,
        isActive: true,
      },
      {
        title: '-$1 shipping fee',
        type: 'fixed_shipping',
        discountValue: 1,
        minBillValue: 15,
        validUntil: futureDate,
        isActive: true,
      },
      {
        title: '-10% for E-wallet',
        type: 'wallet_discount',
        discountValue: 10,
        minBillValue: 25,
        maxDiscount: 8,
        validUntil: futureDate,
        isActive: true,
      },
      {
        title: '- 30% for bill over $50',
        type: 'bill_threshold',
        discountValue: 30,
        minBillValue: 50,
        maxDiscount: 20,
        validUntil: futureDate,
        isActive: true,
      },
      {
        title: 'Freeship',
        type: 'fixed_shipping',
        discountValue: 5,
        minBillValue: 40,
        validUntil: futureDate,
        isActive: true,
      },
    ]);

    console.log('🎉 SEED DỮ LIỆU THÀNH CÔNG VÀO MONGODB ATLAS!');
    console.log(`- 2 Users (Khách hàng & Tài xế ${driver.fullName})`);
    console.log(`- ${categories.length} Danh mục ẩm thực`);
    console.log(`- ${restaurants.length} Nhà hàng (Kèm toạ độ GeoJSON)`);
    console.log(`- 8 Món ăn & Combos (Kèm Sizes, Toppings, Cay)`);
    console.log(`- 5 Vouchers chuẩn Trang 6 PDF`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
};

seedDatabase();
