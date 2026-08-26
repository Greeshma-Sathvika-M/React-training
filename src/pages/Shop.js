import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filtered = products
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    setSearchParams(cat !== 'All' ? { category: cat } : {});
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>🛍️ Pet Shop</h1>
        <p className="muted">Find the perfect pet or accessory</p>
      </div>

      {/* Filters */}
      <div className="shop-controls">
        <div className="category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`pill ${activeCategory === cat ? 'pill-active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="shop-search-sort">
          <input
            className="search-input"
            type="text"
            placeholder="Search pets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="results-count muted">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span>🔍</span>
          <p>No pets found. Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}

export default Shop;
