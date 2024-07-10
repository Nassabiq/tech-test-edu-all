const express = require('express');
const cors = require('cors');

const prisma = require('./prisma-client');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Menampilkan seluruh daftar produk
app.get('/products', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await prisma.produk.findMany({
        skip: skip,
        take: limit,
    });

    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
        data: products,
        page,
        totalPages,
        totalProducts
    });
});

// Menampilkan produk berdasarkan permintaan pencarian produk
app.get('/products/search', async (req, res) => {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await prisma.produk.findMany({
        where: {
            OR: [
                { brand: { startsWith: query } },
                { model: { startsWith: query } },
            ],
        },
        skip: skip,
        take: limit,
    });

    const totalProducts = await prisma.produk.count({
        where: {
            OR: [
                { brand: { startsWith: query } },
                { model: { startsWith: query } },
            ],
        },
    });

    const totalPages = Math.ceil(totalProducts / limit);
    res.json({
        data: products,
        page,
        totalPages,
        totalProducts
    });
});

app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});
