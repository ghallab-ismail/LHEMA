import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Link to={`/product/${product.id}`} className="group relative w-full cursor-pointer block">
            {/* Image Container */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-stone-100">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="mt-6 flex flex-col items-center text-center space-y-2">
                <h3 className="font-serif text-lg md:text-xl tracking-wide text-primary-text">
                    {product.name}
                </h3>

                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-stone-500">
                    Archives {product.archive_year} {product.is_limited_edition && "— Édition 01/10"}
                </p>

                <span className="font-sans text-xs tracking-wide text-primary-text mt-1">
                    {product.price.toLocaleString()} DH
                </span>
            </div>
        </Link>
    );
};

export default ProductCard;
