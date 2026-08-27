import React, { useState } from 'react';
import './Blog.css';

const POSTS = [
  {
    id: 1,
    category: 'Tech',
    title: 'Top 10 Smartphones to Buy in 2025',
    excerpt: 'The smartphone market keeps evolving. We break down the best picks across price ranges to help you decide your next upgrade.',
    author: 'Sarah Mitchell',
    date: 'Jan 12, 2025',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
  },
  {
    id: 2,
    category: 'Lifestyle',
    title: 'How Smart Home Gadgets Are Changing Daily Life',
    excerpt: 'From voice assistants to automated lighting, explore how connected devices are reshaping modern homes.',
    author: 'James Rivera',
    date: 'Jan 8, 2025',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    id: 3,
    category: 'Reviews',
    title: 'Laptop Buying Guide for Students and Professionals',
    excerpt: 'Not sure which laptop suits your workflow? We tested the top models to find the best performance-to-price ratio.',
    author: 'Emily Carter',
    date: 'Dec 28, 2024',
    readTime: '7 min read',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
  },
  {
    id: 4,
    category: 'Tips',
    title: '5 Ways to Extend Your Gadget Battery Life',
    excerpt: 'Battery anxiety is real. Here are five proven strategies to keep your devices running longer throughout the day.',
    author: 'Tom Harris',
    date: 'Dec 20, 2024',
    readTime: '3 min read',
    img: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
  },
  {
    id: 5,
    category: 'Tech',
    title: 'The Rise of Foldable Phones: Worth It in 2025?',
    excerpt: 'Foldable smartphones have matured considerably. We weigh the pros and cons of making the switch.',
    author: 'Sarah Mitchell',
    date: 'Dec 15, 2024',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&q=80',
  },
  {
    id: 6,
    category: 'Lifestyle',
    title: 'Best Wireless Earbuds for Every Budget',
    excerpt: 'Whether you need audiophile sound or just a reliable daily driver, there is a pair of earbuds on this list for you.',
    author: 'James Rivera',
    date: 'Dec 10, 2024',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
  },
];

const CATEGORIES = ['All', 'Tech', 'Lifestyle', 'Reviews', 'Tips'];

function Blog() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? POSTS : POSTS.filter(p => p.category === active);

  return (
    <div className="blog-page">
      <div className="blog-inner">
        <div className="blog-header">
          <h1>Our Blog</h1>
          <p>Stay up to date with the latest in tech, reviews, and lifestyle tips.</p>
        </div>

        <div className="blog-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`blog-filter-btn ${active === cat ? 'active' : ''}`}
              onClick={() => setActive(cat)}
            >{cat}</button>
          ))}
        </div>

        <div className="blog-grid">
          {filtered.map(post => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-img-wrap">
                <span className="blog-card-cat">{post.category}</span>
                <img src={post.img} alt={post.title} loading="lazy" />
              </div>
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span>{post.author}</span>
                  <span className="blog-dot">·</span>
                  <span>{post.date}</span>
                  <span className="blog-dot">·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <button className="blog-read-btn">Read More →</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;
