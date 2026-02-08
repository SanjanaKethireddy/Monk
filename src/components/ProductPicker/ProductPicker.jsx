import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';
import { searchProducts, getMockProducts } from '../../services/api';
import './ProductPicker.css';

const ProductPicker = ({ onClose, onSelect, excludeProductIds = [] }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState({});
    const [selectedVariants, setSelectedVariants] = useState({});

    const contentRef = useRef(null);
    const debounceRef = useRef(null);

    const LIMIT = 10;
    const USE_MOCK = false; // Using real API with provided key

    const fetchProducts = useCallback(async (query, pageNum, append = false) => {
        try {
            if (append) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            let data;
            if (USE_MOCK) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 300));
                data = getMockProducts(query, pageNum, LIMIT);
            } else {
                data = await searchProducts(query, pageNum, LIMIT);
            }

            // Filter out already selected products
            const filteredData = data.filter(
                p => !excludeProductIds.includes(p.id)
            );

            if (append) {
                setProducts(prev => [...prev, ...filteredData]);
            } else {
                setProducts(filteredData);
            }

            setHasMore(data.length === LIMIT);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [excludeProductIds]);

    useEffect(() => {
        fetchProducts('', 0);
    }, [fetchProducts]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Debounce search
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            setPage(0);
            fetchProducts(value, 0);
        }, 300);
    };

    const handleScroll = () => {
        if (!contentRef.current || loading || loadingMore || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;

        if (scrollTop + clientHeight >= scrollHeight - 50) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProducts(searchQuery, nextPage, true);
        }
    };

    const handleProductCheck = (product) => {
        const productId = product.id;
        const isSelected = selectedProducts[productId];

        if (isSelected) {
            // Unselect product and all its variants
            const newSelectedProducts = { ...selectedProducts };
            delete newSelectedProducts[productId];
            setSelectedProducts(newSelectedProducts);

            const newSelectedVariants = { ...selectedVariants };
            product.variants.forEach(v => {
                delete newSelectedVariants[v.id];
            });
            setSelectedVariants(newSelectedVariants);
        } else {
            // Select product and all its variants
            setSelectedProducts({
                ...selectedProducts,
                [productId]: product,
            });

            const variantsToAdd = {};
            product.variants.forEach(v => {
                variantsToAdd[v.id] = { ...v, productId };
            });
            setSelectedVariants({
                ...selectedVariants,
                ...variantsToAdd,
            });
        }
    };

    const handleVariantCheck = (product, variant) => {
        const variantId = variant.id;
        const productId = product.id;
        const isSelected = selectedVariants[variantId];

        if (isSelected) {
            // Unselect variant
            const newSelectedVariants = { ...selectedVariants };
            delete newSelectedVariants[variantId];
            setSelectedVariants(newSelectedVariants);

            // Check if any variants of this product are still selected
            const remainingVariants = Object.values(newSelectedVariants).filter(
                v => v.productId === productId
            );

            if (remainingVariants.length === 0) {
                const newSelectedProducts = { ...selectedProducts };
                delete newSelectedProducts[productId];
                setSelectedProducts(newSelectedProducts);
            }
        } else {
            // Select variant
            setSelectedVariants({
                ...selectedVariants,
                [variantId]: { ...variant, productId },
            });

            // Also select the product
            if (!selectedProducts[productId]) {
                setSelectedProducts({
                    ...selectedProducts,
                    [productId]: product,
                });
            }
        }
    };

    const isProductSelected = (productId) => {
        return !!selectedProducts[productId];
    };

    const isVariantSelected = (variantId) => {
        return !!selectedVariants[variantId];
    };

    const isProductPartiallySelected = (product) => {
        const selectedVariantCount = product.variants.filter(v =>
            selectedVariants[v.id]
        ).length;
        return selectedVariantCount > 0 && selectedVariantCount < product.variants.length;
    };

    const handleAdd = () => {
        // Build the final selection
        const result = [];

        Object.values(selectedProducts).forEach(product => {
            // Get selected variants for this product
            const productVariants = product.variants.filter(v =>
                selectedVariants[v.id]
            );

            if (productVariants.length > 0) {
                result.push({
                    ...product,
                    variants: productVariants,
                });
            }
        });

        onSelect(result);
    };

    const getSelectedCount = () => {
        return Object.keys(selectedProducts).length;
    };

    return (
        <div className="product-picker-overlay" onClick={onClose}>
            <div
                className="product-picker-dialog"
                onClick={e => e.stopPropagation()}
            >
                <div className="product-picker-header">
                    <h2>Select Products</h2>
                    <button className="close-button" onClick={onClose}>
                        <IoClose />
                    </button>
                </div>

                <div className="search-container">
                    <div className="search-input-wrapper">
                        <IoSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search product"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>

                <div
                    className="product-picker-content"
                    ref={contentRef}
                    onScroll={handleScroll}
                >
                    {loading && products.length === 0 ? (
                        <div className="loading-container">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="no-results">No products found</div>
                    ) : (
                        <>
                            {products.map(product => (
                                <div key={product.id} className="picker-product-item">
                                    <div
                                        className="picker-product-header"
                                        onClick={() => handleProductCheck(product)}
                                    >
                                        <input
                                            type="checkbox"
                                            className="picker-checkbox"
                                            checked={isProductSelected(product.id)}
                                            ref={el => {
                                                if (el) {
                                                    el.indeterminate = isProductPartiallySelected(product);
                                                }
                                            }}
                                            onChange={() => handleProductCheck(product)}
                                        />
                                        {product.image?.src ? (
                                            <img
                                                src={product.image.src}
                                                alt={product.title}
                                                className="picker-product-image"
                                            />
                                        ) : (
                                            <div className="picker-product-image-placeholder">
                                                No img
                                            </div>
                                        )}
                                        <span className="picker-product-title">{product.title}</span>
                                    </div>

                                    {product.variants.map(variant => (
                                        <div
                                            key={variant.id}
                                            className="picker-variant-item"
                                            onClick={() => handleVariantCheck(product, variant)}
                                        >
                                            <input
                                                type="checkbox"
                                                className="picker-checkbox"
                                                checked={isVariantSelected(variant.id)}
                                                onChange={() => handleVariantCheck(product, variant)}
                                            />
                                            <span className="picker-variant-title">{variant.title}</span>
                                            <span className="picker-variant-inventory">
                                                {variant.inventory_quantity !== undefined
                                                    ? `${variant.inventory_quantity} available`
                                                    : ''}
                                            </span>
                                            <span className="picker-variant-price">${variant.price}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            {loadingMore && (
                                <div className="loading-more">Loading more products...</div>
                            )}
                        </>
                    )}
                </div>

                <div className="product-picker-footer">
                    <span className="selected-count">
                        {getSelectedCount()} product{getSelectedCount() !== 1 ? 's' : ''} selected
                    </span>
                    <div className="footer-buttons">
                        <button className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            className="add-button"
                            onClick={handleAdd}
                            disabled={getSelectedCount() === 0}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPicker;
