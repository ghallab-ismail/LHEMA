import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    // Support both static products (id + local image imports) and DB products (_id + URL strings)
    const productId = product._id || product.id;
    const imageUrl = product.images?.[0] || null;

    return (
        <Link to={`/product/${productId}`} className="group relative w-full cursor-pointer block">
            {/* Image Container */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-stone-100">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-stone-300">
                        <span className="font-serif text-sm">Image à venir</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="mt-6 flex flex-col items-center text-center space-y-2">
                <h3 className="font-serif text-lg md:text-xl tracking-wide text-primary-text">
                    {product.name}
                </h3>

                {product.archive_year && (
                    <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-stone-500">
                        Archives {product.archive_year} {product.is_limited_edition && "— Édition 01/10"}
                    </p>
                )}

                <span className="font-sans text-xs tracking-wide text-primary-text mt-1">
                    {product.price?.toLocaleString()} {product.currency || 'MAD'}
                </span>
            </div>
        </Link>
    );
};

export default ProductCard;
