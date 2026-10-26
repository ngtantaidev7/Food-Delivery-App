import cloudinary from './config/cloudinary';

async function testCloudinary() {
  console.log('🔄 Đang kiểm tra kết nối Cloudinary...');
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ KẾT NỐI CLOUDINARY THÀNH CÔNG 100%!');
    console.log('📦 Trạng thái phản hồi:', result);
    console.log(`🌐 Cloud Name: ${cloudinary.config().cloud_name}`);
    process.exit(0);
  } catch (error: any) {
    console.error('❌ KẾT NỐI CLOUDINARY THẤT BẠI:', error.message || error);
    process.exit(1);
  }
}

testCloudinary();
