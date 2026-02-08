import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import ProductItem from './ProductItem';
import ProductPicker from '../ProductPicker/ProductPicker';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([
        { id: 'empty-1', title: '', variants: [], isEmpty: true }
    ]);
    const [showPicker, setShowPicker] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const handleDragEnd = (result) => {
        const { destination, source, type } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === 'product') {
            const newProducts = Array.from(products);
            const [removed] = newProducts.splice(source.index, 1);
            newProducts.splice(destination.index, 0, removed);
            setProducts(newProducts);
        } else if (type === 'variant') {
            const productId = source.droppableId.replace('variants-', '');
            const productIndex = products.findIndex(p => String(p.id) === productId);

            if (productIndex === -1) return;

            const newProducts = [...products];
            const product = { ...newProducts[productIndex] };
            const newVariants = Array.from(product.variants);
            const [removed] = newVariants.splice(source.index, 1);
            newVariants.splice(destination.index, 0, removed);
            product.variants = newVariants;
            newProducts[productIndex] = product;
            setProducts(newProducts);
        }
    };

    const handleEditClick = (index) => {
        setEditingIndex(index);
        setShowPicker(true);
    };

    const handlePickerClose = () => {
        setShowPicker(false);
        setEditingIndex(null);
    };

    const handleProductsSelected = (selectedProducts) => {
        if (editingIndex === null || selectedProducts.length === 0) {
            handlePickerClose();
            return;
        }

        const newProducts = [...products];
        // Replace the product at editingIndex with selected products
        const before = newProducts.slice(0, editingIndex);
        const after = newProducts.slice(editingIndex + 1);

        // Map selected products to our format with discount fields
        const mappedProducts = selectedProducts.map(p => ({
            ...p,
            discountValue: '',
            discountType: 'percent',
            variants: p.variants.map(v => ({
                ...v,
                discountValue: '',
                discountType: 'percent',
            })),
        }));

        setProducts([...before, ...mappedProducts, ...after]);
        handlePickerClose();
    };

    const handleDiscountChange = (productId, field, value) => {
        setProducts(products.map(p =>
            p.id === productId
                ? { ...p, [field]: value }
                : p
        ));
    };

    const handleVariantDiscountChange = (productId, variantIndex, field, value) => {
        setProducts(products.map(p => {
            if (p.id !== productId) return p;

            const newVariants = [...p.variants];
            newVariants[variantIndex] = {
                ...newVariants[variantIndex],
                [field]: value,
            };
            return { ...p, variants: newVariants };
        }));
    };

    const handleRemoveProduct = (productId) => {
        if (products.length <= 1) return;
        setProducts(products.filter(p => p.id !== productId));
    };

    const handleRemoveVariant = (productId, variantIndex) => {
        setProducts(products.map(p => {
            if (p.id !== productId) return p;
            if (p.variants.length <= 1) return p;

            const newVariants = [...p.variants];
            newVariants.splice(variantIndex, 1);
            return { ...p, variants: newVariants };
        }));
    };

    const handleAddProduct = () => {
        const newId = `empty-${Date.now()}`;
        setProducts([...products, { id: newId, title: '', variants: [], isEmpty: true }]);
    };

    // Get list of already selected product IDs to prevent duplicates
    const selectedProductIds = products
        .filter(p => !p.isEmpty)
        .map(p => p.id);

    return (
        <div className="product-list-container">
            <div className="product-list-header">
                <h1>Add Products</h1>
                <div className="product-list-columns">
                    <span>Product</span>
                    <span>Discount</span>
                </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="products" type="product">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="product-list"
                        >
                            {products.map((product, index) => (
                                <ProductItem
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    onEditClick={handleEditClick}
                                    onDiscountChange={handleDiscountChange}
                                    onVariantDiscountChange={handleVariantDiscountChange}
                                    onRemove={handleRemoveProduct}
                                    onRemoveVariant={handleRemoveVariant}
                                    canRemove={products.length > 1}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="add-product-button-container">
                <button className="add-product-button" onClick={handleAddProduct}>
                    Add Product
                </button>
            </div>

            {showPicker && (
                <ProductPicker
                    onClose={handlePickerClose}
                    onSelect={handleProductsSelected}
                    excludeProductIds={selectedProductIds}
                />
            )}
        </div>
    );
};

export default ProductList;
