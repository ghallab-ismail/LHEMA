import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    // Support both static products (id + local image imports) and DB products (_id + URL strings)
    const productId = product._id || product.id;
    const imageUrl = product.images?.[0] || null;

    // Determine if sold out
    const isSoldOut =
        product.stock === 0 ||
        (product.completed_count !== undefined &&
            product.total_edition !== undefined &&
            product.completed_count >= product.total_edition);

    return (
        <Link to={`/product/${productId}`} className="group relative w-full cursor-pointer block">
            {/* Image Container */}
            <div className="aspect-[4/5] w-full overflow-hidden bg-stone-100 relative">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${isSoldOut ? 'grayscale-[40%]' : ''}`}
                        style={isSoldOut ? { filter: 'grayscale(35%) brightness(0.92)' } : {}}
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-stone-300">
                        <span className="font-serif text-sm">Image à venir</span>
                    </div>
                )}

                {/* ── Sold-out étiquette ── */}
                {isSoldOut && (
                    <>
                        {/* Subtle dark veil */}
                        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

                        {/* Ribbon badge — top right */}
                        <div className="absolute top-5 right-0 flex items-center pointer-events-none">
                            {/* Left notch */}
                            <div
                                style={{
                                    width: 0,
                                    height: 0,
                                    borderTop: '16px solid transparent',
                                    borderBottom: '16px solid transparent',
                                    borderRight: '11px solid #1A1A1A',
                                }}
                            />
                            {/* Label */}
                            <div className="bg-[#1A1A1A] text-white px-5 py-2.5 flex flex-col items-center shadow-xl">
                                <span className="font-sans text-[8px] uppercase tracking-[0.4em] text-white/50 leading-none mb-1">
                                    Édition
                                </span>
                                <span className="font-serif text-[12px] tracking-[0.12em] text-white leading-none">
                                    Épuisée
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="mt-6 flex flex-col items-center text-center space-y-2">
                <h3 className={`font-serif text-lg md:text-xl tracking-wide ${isSoldOut ? 'text-stone-400' : 'text-primary-text'}`}>
                    {product.name}
                </h3>

                {product.archive_year && (
                    <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-stone-500">
                        Archives {product.archive_year} {product.is_limited_edition && '— Édition 01/10'}
                    </p>
                )}

                <span className={`font-sans text-xs tracking-wide mt-1 ${isSoldOut ? 'text-stone-400 line-through decoration-stone-400/60' : 'text-primary-text'}`}>
                    {product.price?.toLocaleString()} {product.currency || 'MAD'}
                </span>

                {isSoldOut && (
                    <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-stone-400 mt-0.5">
                        Toutes les pièces ont été acquises
                    </span>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;
