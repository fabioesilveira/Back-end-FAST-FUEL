const {
  findAllProducts,
  getProductIdModel,
  getProductCategoryModel,
  createProduct,
  updateProductPrice,
  deleteProductById,
  getCategoryInsightsSalesRows,
} = require("../models/productsModel.js");

const { findReviewsByCategory } = require("../models/reviewsModel");

async function getAllProductsService() {
  const products = await findAllProducts();
  return products;
}

async function getProductsCategoryService(category) {
  const result = await getProductCategoryModel(category);

  if (result.length === 0) {
    return { msg: "No products found for this category", status: 404 };
  }

  return result;
}

function round1(value) {
  return Math.round(Number(value || 0) * 10) / 10;
}

function safeParseJson(value) {
  try {
    if (typeof value === "string") return JSON.parse(value);
    return value ?? null;
  } catch {
    return null;
  }
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

async function getCategoryInsightsService(category) {
  if (!category) {
    return { msg: "Category is required", status: 400 };
  }

  const products = await getProductCategoryModel(category);

  if (!products || products.length === 0) {
    return { msg: "Category not found", status: 404 };
  }

  const reviews = await findReviewsByCategory(category);

  const reviewStats = new Map();

  for (const review of reviews) {
    const productId = String(review.product_id);

    if (!reviewStats.has(productId)) {
      reviewStats.set(productId, {
        total_reviews: 0,
        rating_sum: 0,
      });
    }

    const current = reviewStats.get(productId);
    current.total_reviews += 1;
    current.rating_sum += Number(review.rating || 0);
  }

  const salesRows = await getCategoryInsightsSalesRows();

  const soldByProduct = new Map();

  for (const row of salesRows) {
    const snapshot = safeParseJson(row.items_snapshot);

    if (!Array.isArray(snapshot)) continue;

    for (const item of snapshot) {
      if (String(item.category) !== String(category)) continue;

      const productId = String(item.id);
      const qty = Number(item.qty || 0);

      soldByProduct.set(
        productId,
        (soldByProduct.get(productId) || 0) + qty
      );
    }
  }

  const totalSoldInCategory = [...soldByProduct.values()].reduce(
    (sum, qty) => sum + qty,
    0
  );

  const enrichedProducts = products.map((product) => {
    const productId = String(product.id);
    const stats = reviewStats.get(productId);

    const totalReviews = stats?.total_reviews || 0;
    const averageRating =
      totalReviews > 0 ? round1(stats.rating_sum / totalReviews) : 0;

    const totalSold = soldByProduct.get(productId) || 0;

    const salesPercentage =
      totalSoldInCategory > 0
        ? Math.round((totalSold / totalSoldInCategory) * 100)
        : 0;

    return {
      id: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      average_rating: averageRating,
      total_reviews: totalReviews,
      total_sold: totalSold,
      sales_percentage: salesPercentage,
    };
  });

  const randomReviews = shuffleArray(reviews)
    .filter((review) => review.comment)
    .slice(0, 3)
    .map((review) => ({
      id: review.id,
      product_id: review.product_id,
      product_name: review.product_name,
      product_image: review.product_image,
      display_name: review.display_name,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
    }));

  return {
    category,
    products: enrichedProducts,
    random_reviews: randomReviews,
  };
}

async function getProductsIdService(id) {
  const result = await getProductIdModel(id);

  if (result.length === 0) {
    return { msg: "Product not found", status: 404 };
  }

  return result[0];
}

async function createProductService(data) {
  const { name, price, category, image, description } = data;

  if (!name || price === undefined || !category || !image || !description) {
    return {
      msg: "Missing fields. Required: name, price, category, image, description",
      status: 400,
    };
  }

  const result = await createProduct(name, price, category, image, description);

  return {
    id: result.insertId,
    name,
    price,
    category,
    image,
    description,
  };
}

async function updateProductPriceService(id, price) {
  if (price === undefined) {
    return { msg: "price is required", status: 400 };
  }

  const result = await updateProductPrice(id, price);

  if (!result.affectedRows) {
    return { msg: "Product not found", status: 404 };
  }

  return { msg: "updated", affectedRows: result.affectedRows };
}

async function removeProductService(id) {
  const result = await deleteProductById(id);

  if (!result.affectedRows) {
    return { msg: "Product not found", status: 404 };
  }

  return { msg: "deleted", affectedRows: result.affectedRows };
}

module.exports = {
  getAllProductsService,
  getProductsCategoryService,
  getCategoryInsightsService,
  getProductsIdService,
  createProductService,
  updateProductPriceService,
  removeProductService,
};