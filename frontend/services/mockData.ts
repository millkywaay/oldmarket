import { Product, Brand, Order, OrderStatus, UserRole } from '../types';

/*
================================================================================
|!| PENTING |!|
URL GAMBAR SUDAH DIPERBARUI SESUAI PERMINTAAN.
================================================================================
*/

export const mockBrands: Brand[] = [
    { id: '1', name: 'Nike', description: 'Just Do It.' },
    { id: '2', name: 'Adidas', description: 'Impossible is Nothing.' },
    { id: '3', name: 'Puma', description: 'Forever Faster.' },
    { id: '4', name: 'Kappa', description: 'Omini logo.' },
    { id: '5', name: 'Ortuseight', description: 'Indonesian sports brand.' },
];

export const mockProducts: Product[] = [
    // === NIKE ===
    { id: 'N1', name: 'Liverpool Home Jersey 23/24', description: 'Jersey kandang resmi Liverpool FC untuk musim 23/24 dari Nike.', price: 850000, stock_quantity: 50, image_url: 'https://i.imgur.com/aNLO3Dv.png', brand_id: '1', brand: mockBrands[0] },
    { id: 'N2', name: 'Barcelona Away Jersey 23/24', description: 'Jersey tandang FC Barcelona dengan teknologi Dri-FIT.', price: 840000, stock_quantity: 40, image_url: 'https://i.imgur.com/JTuoEzh.png', brand_id: '1', brand: mockBrands[0] },
    { id: 'N3', name: 'Inter Milan Home Jersey 23/24', description: 'Warna biru-hitam ikonik dari Inter Milan.', price: 860000, stock_quantity: 35, image_url: 'https://i.imgur.com/9mXJXKI.png', brand_id: '1', brand: mockBrands[0] },
    { id: 'N4', name: 'Chelsea Third Kit 23/24', description: 'Kit ketiga Chelsea dengan desain modern.', price: 830000, stock_quantity: 25, image_url: 'https://i.imgur.com/EXhKuzT.png', brand_id: '1', brand: mockBrands[0] },
    { id: 'N5', name: 'PSG Home Jersey 23/24', description: 'Jersey kandang Paris Saint-Germain untuk para bintang.', price: 900000, stock_quantity: 60, image_url: 'https://i.imgur.com/kq0kS48.png', brand_id: '1', brand: mockBrands[0] },

    // === ADIDAS ===
    { id: 'A1', name: 'Real Madrid Home Jersey 23/24', description: 'Jersey putih legendaris Real Madrid dari Adidas.', price: 875000, stock_quantity: 70, image_url: 'https://i.imgur.com/vynTfwV.png', brand_id: '2', brand: mockBrands[1] },
    { id: 'A2', name: 'Manchester United Away Jersey 23/24', description: 'Jersey tandang The Red Devils dengan gaya klasik.', price: 865000, stock_quantity: 55, image_url: 'https://i.imgur.com/YgB2p3c.png', brand_id: '2', brand: mockBrands[1] },
    { id: 'A3', name: 'Arsenal Home Jersey 23/24', description: 'Jersey kandang The Gunners dengan sentuhan emas.', price: 855000, stock_quantity: 45, image_url: 'https://i.imgur.com/AtdzKs3.png', brand_id: '2', brand: mockBrands[1] },
    { id: 'A4', name: 'Bayern Munchen Home Jersey 23/24', description: 'Jersey merah dominan dari FC Bayern.', price: 880000, stock_quantity: 0, image_url: 'https://i.imgur.com/aOcG8VC.png', brand_id: '2', brand: mockBrands[1] },
    { id: 'A5', name: 'Juventus Away Jersey 23/24', description: 'Desain artistik untuk jersey tandang Juventus.', price: 845000, stock_quantity: 30, image_url: 'https://i.imgur.com/HVSvaz3.png', brand_id: '2', brand: mockBrands[1] },

    // === PUMA ===
    { id: 'P1', name: 'AC Milan Home Jersey 23/24', description: 'Jersey Rossoneri dari Puma.', price: 790000, stock_quantity: 50, image_url: 'https://i.imgur.com/fwTNyXf.png', brand_id: '3', brand: mockBrands[2] },
    { id: 'P2', name: 'Manchester City Away Jersey 23/24', description: 'Jersey tandang sang juara bertahan Liga Inggris.', price: 820000, stock_quantity: 60, image_url: 'https://i.imgur.com/49dxA71.png', brand_id: '3', brand: mockBrands[2] },
    { id: 'P3', name: 'Borussia Dortmund Home Jersey 23/24', description: 'Warna kuning-hitam khas Dortmund.', price: 780000, stock_quantity: 40, image_url: 'https://i.imgur.com/ix3Ey8G.png', brand_id: '3', brand: mockBrands[2] },
    { id: 'P4', name: 'Marseille Home Jersey 23/24', description: 'Jersey putih ikonik dari Olympique de Marseille.', price: 750000, stock_quantity: 20, image_url: 'https://i.imgur.com/3OiG6uC.png', brand_id: '3', brand: mockBrands[2] },
    { id: 'P5', name: 'Valencia CF Home Jersey 23/24', description: 'Jersey kandang Los Che.', price: 740000, stock_quantity: 15, image_url: 'https://i.imgur.com/vHsf5jU.png', brand_id: '3', brand: mockBrands[2] },
    
    // === KAPPA ===
    { id: 'K1', name: 'Fiorentina Home Jersey 23/24', description: 'Jersey ungu La Viola dari Kappa.', price: 710000, stock_quantity: 30, image_url: 'https://i.imgur.com/MHoRDZM.png', brand_id: '4', brand: mockBrands[3] },
    { id: 'K2', name: 'AS Monaco Home Jersey 23/24', description: 'Desain diagonal khas AS Monaco.', price: 720000, stock_quantity: 25, image_url: 'https://i.imgur.com/FcIPzxr.png', brand_id: '4', brand: mockBrands[3] },
    { id: 'K3', name: 'Napoli Away Jersey 23/24', description: 'Jersey tandang sang juara Serie A.', price: 730000, stock_quantity: 0, image_url: 'https://i.imgur.com/2Gziprf.png', brand_id: '4', brand: mockBrands[3] },
    { id: 'K4', name: 'Venezia FC Home Jersey 23/24', description: 'Jersey paling stylish dari Venezia.', price: 800000, stock_quantity: 10, image_url: 'https://i.imgur.com/F2prmct.png', brand_id: '4', brand: mockBrands[3] },
    { id: 'K5', name: 'Genoa CFC Home Jersey 23/24', description: 'Jersey klub tertua di Italia.', price: 690000, stock_quantity: 18, image_url: 'https://i.imgur.com/EAS3JLF.png', brand_id: '4', brand: mockBrands[3] },

    // === ORTUSEIGHT ===
    { id: 'O1', name: 'Timnas Indonesia Home Jersey 2024', description: 'Jersey kandang Garuda, semangat bangsa.', price: 550000, stock_quantity: 100, image_url: 'https://i.imgur.com/BC0qE5P.png', brand_id: '5', brand: mockBrands[4] },
    { id: 'O2', name: 'Timnas Indonesia Away Jersey 2024', description: 'Jersey tandang putih suci Garuda.', price: 550000, stock_quantity: 80, image_url: 'https://i.imgur.com/Jy5P0ZF.png', brand_id: '5', brand: mockBrands[4] },
    { id: 'O3', name: 'Persija Jakarta Home Jersey', description: 'Jersey kandang Macan Kemayoran.', price: 480000, stock_quantity: 60, image_url: 'https://i.imgur.com/s5ek8J2.png', brand_id: '5', brand: mockBrands[4] },
    { id: 'O4', name: 'Persib Bandung Home Jersey', description: 'Jersey Pangeran Biru dari Bandung.', price: 480000, stock_quantity: 65, image_url: 'https://i.imgur.com/xYMFOoV.png', brand_id: '5', brand: mockBrands[4] },
    { id: 'O5', name: 'Bali United Home Jersey', description: 'Jersey Serdadu Tridatu dari pulau Dewata.', price: 470000, stock_quantity: 40, image_url: 'https://i.imgur.com/EawjmRe.png', brand_id: '5', brand: mockBrands[4] },
];

const findProduct = (id: string) => mockProducts.find(p => p.id === id)!;

export const mockOrders: Order[] = [
    // --- Pesanan untuk user demo (id: '1') ---
    { 
        id: 'order_1a2b', 
        user_id: '1', 
        total_amount: 3415000, 
        order_status: OrderStatus.DELIVERED, 
        shipping_address: 'Jl. Merdeka No. 10, Jakarta Pusat', 
        payment_method: 'Manual Bank Transfer', 
        transaction_currency: 'IDR', 
        created_at: new Date(Date.now() - 86400000 * 45).toISOString(), // ~45 hari lalu
        items: [
            { id: 'oi_1', order_id: 'order_1a2b', product_id: 'A1', quantity: 1, price_at_purchase: findProduct('A1').price, product: findProduct('A1') },
            { id: 'oi_2', order_id: 'order_1a2b', product_id: 'A2', quantity: 1, price_at_purchase: findProduct('A2').price, product: findProduct('A2') },
            { id: 'oi_3', order_id: 'order_1a2b', product_id: 'A3', quantity: 2, price_at_purchase: findProduct('A3').price, product: findProduct('A3') }
        ]
    },
    { 
        id: 'order_3c4d', 
        user_id: '1', 
        total_amount: 1400000, 
        order_status: OrderStatus.SHIPPED, 
        shipping_address: 'Jl. Merdeka No. 10, Jakarta Pusat', 
        payment_method: 'Internal Courier COD', 
        transaction_currency: 'IDR', 
        created_at: new Date(Date.now() - 86400000 * 15).toISOString(), // ~15 hari lalu
        items: [
            { id: 'oi_4', order_id: 'order_3c4d', product_id: 'K4', quantity: 1, price_at_purchase: findProduct('K4').price, product: findProduct('K4') },
            { id: 'oi_5', order_id: 'order_3c4d', product_id: 'K5', quantity: 1, price_at_purchase: findProduct('K5').price, product: findProduct('K5') }
        ]
    },
    { 
        id: 'order_5e6f', 
        user_id: '1', 
        total_amount: 1735000, 
        order_status: OrderStatus.PAID, 
        shipping_address: 'Jl. Merdeka No. 10, Jakarta Pusat', 
        payment_method: 'Manual Bank Transfer', 
        transaction_currency: 'IDR', 
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 hari lalu
        items: [
            { id: 'oi_6', order_id: 'order_5e6f', product_id: 'A5', quantity: 1, price_at_purchase: findProduct('A5').price, product: findProduct('A5') },
            { id: 'oi_7', order_id: 'order_5e6f', product_id: 'N5', quantity: 1, price_at_purchase: findProduct('N5').price, product: findProduct('N5') }
        ]
    },
    { 
        id: 'order_7g8h', 
        user_id: '1', 
        total_amount: 550000, 
        order_status: OrderStatus.PENDING, 
        shipping_address: 'Jl. Merdeka No. 10, Jakarta Pusat', 
        payment_method: 'Internal Courier COD', 
        transaction_currency: 'IDR', 
        created_at: new Date().toISOString(), // Hari ini
        items: [
            { id: 'oi_8', order_id: 'order_7g8h', product_id: 'O1', quantity: 1, price_at_purchase: findProduct('O1').price, product: findProduct('O1') }
        ]
    },

    // --- Pesanan untuk user lain (untuk data admin) ---
    { 
        id: 'order_9i0j', 
        user_id: '2', // User lain
        total_amount: 2390000, 
        order_status: OrderStatus.DELIVERED, 
        shipping_address: 'Jl. Sudirman Kav. 5, Surabaya', 
        payment_method: 'Manual Bank Transfer', 
        transaction_currency: 'IDR', 
        created_at: new Date(Date.now() - 86400000 * 32).toISOString(), // ~32 hari lalu
        items: [
            { id: 'oi_9', order_id: 'order_9i0j', product_id: 'P1', quantity: 1, price_at_purchase: findProduct('P1').price, product: findProduct('P1') },
            { id: 'oi_10', order_id: 'order_9i0j', product_id: 'P2', quantity: 1, price_at_purchase: findProduct('P2').price, product: findProduct('P2') },
            { id: 'oi_11', order_id: 'order_9i0j', product_id: 'P3', quantity: 1, price_at_purchase: findProduct('P3').price, product: findProduct('P3') }
        ]
    },
    { 
        id: 'order_k1l2', 
        user_id: '3', // User lain
        total_amount: 1570000, 
        order_status: OrderStatus.CANCELLED, 
        shipping_address: 'Jl. Gajah Mada No. 8, Bandung', 
        payment_method: 'Manual Bank Transfer', 
        transaction_currency: 'IDR', 
        created_at: new Date(Date.now() - 86400000 * 20).toISOString(), // ~20 hari lalu
        items: [
            { id: 'oi_12', order_id: 'order_k1l2', product_id: 'N3', quantity: 1, price_at_purchase: findProduct('N3').price, product: findProduct('N3') },
            { id: 'oi_13', order_id: 'order_k1l2', product_id: 'N4', quantity: 1, price_at_purchase: findProduct('N4').price, product: findProduct('N4') }
        ]
    },
     { 
        id: 'order_m3n4', 
        user_id: '2', 
        total_amount: 1480000, 
        order_status: OrderStatus.DELIVERED, 
        shipping_address: 'Jl. Sudirman Kav. 5, Surabaya', 
        payment_method: 'Manual Bank Transfer', 
        transaction_currency: 'IDR', 
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 hari lalu
        items: [
            { id: 'oi_14', order_id: 'order_m3n4', product_id: 'O3', quantity: 1, price_at_purchase: findProduct('O3').price, product: findProduct('O3') },
            { id: 'oi_15', order_id: 'order_m3n4', product_id: 'O4', quantity: 1, price_at_purchase: findProduct('O4').price, product: findProduct('O4') },
            { id: 'oi_16', order_id: 'order_m3n4', product_id: 'O5', quantity: 1, price_at_purchase: findProduct('O5').price, product: findProduct('O5') }
        ]
    },
];