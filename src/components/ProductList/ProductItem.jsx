import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { FiEdit2 } from 'react-icons/fi';
import { IoClose, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import VariantItem from './VariantItem';

const ProductItem = ({
    product,
    index,
    onEditClick,
    onDiscountChange,
    onVariantDiscountChange,
    onRemove,
    onRemoveVariant,
    canRemove,
    onReorderVariants,
}) => {
    const [showVariants, setShowVariants] = useState(false);
    const [showDiscount, setShowDiscount] = useState(product.discountValue ? true : false);

    const hasMultipleVariants = product.variants && product.variants.length > 1;
    const displayTitle = product.title || 'Select Product';

    const handleDiscountValueChange = (e) => {
        const value = e.target.value;
        if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
            onDiscountChange(product.id, 'discountValue', value);
        }
    };

    const handleDiscountTypeChange = (e) => {
        onDiscountChange(product.id, 'discountType', e.target.value);
    };

    const handleVariantDiscountChange = (variantIndex, field, value) => {
        onVariantDiscountChange(product.id, variantIndex, field, value);
    };

    const handleRemoveVariant = (variantIndex) => {
        onRemoveVariant(product.id, variantIndex);
    };

    const handleAddDiscount = () => {
        setShowDiscount(true);
        onDiscountChange(product.id, 'discountValue', '');
        onDiscountChange(product.id, 'discountType', 'percent');
    };

    return (
        <Draggable draggableId={`product-${product.id}`} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`product-item ${snapshot.isDragging ? 'dragging' : ''}`}
                >
                    <div className="product-item-row">
                        <div {...provided.dragHandleProps} className="drag-handle">
                            <RxDragHandleDots2 />
                        </div>

                        <span className="product-index">{index + 1}.</span>

                        <div className="product-name-input-wrapper">
                            <input
                                type="text"
                                className="product-name-input"
                                value={displayTitle}
                                readOnly
                                placeholder="Select Product"
                            />
                            <button
                                className="edit-button"
                                onClick={() => onEditClick(index)}
                                title="Edit product"
                            >
                                <FiEdit2 />
                            </button>
                        </div>

                        <div className="discount-controls">
                            {!showDiscount ? (
                                <button
                                    className="add-discount-button"
                                    onClick={handleAddDiscount}
                                >
                                    Add Discount
                                </button>
                            ) : (
                                <div className="discount-input-group">
                                    <input
                                        type="text"
                                        className="discount-value-input"
                                        value={product.discountValue || ''}
                                        onChange={handleDiscountValueChange}
                                        placeholder="0"
                                    />
                                    <select
                                        className="discount-type-select"
                                        value={product.discountType || 'percent'}
                                        onChange={handleDiscountTypeChange}
                                    >
                                        <option value="percent">% Off</option>
                                        <option value="flat">flat off</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {canRemove && (
                            <button
                                className="remove-button"
                                onClick={() => onRemove(product.id)}
                                title="Remove product"
                            >
                                <IoClose />
                            </button>
                        )}
                    </div>

                    {hasMultipleVariants && (
                        <button
                            className="toggle-variants-button"
                            onClick={() => setShowVariants(!showVariants)}
                        >
                            {showVariants ? (
                                <>Hide variants <IoChevronUp /></>
                            ) : (
                                <>Show variants <IoChevronDown /></>
                            )}
                        </button>
                    )}

                    {showVariants && hasMultipleVariants && (
                        <Droppable droppableId={`variants-${product.id}`} type="variant">
                            {(droppableProvided) => (
                                <div
                                    ref={droppableProvided.innerRef}
                                    {...droppableProvided.droppableProps}
                                    className="variants-container"
                                >
                                    {product.variants.map((variant, variantIndex) => (
                                        <VariantItem
                                            key={variant.id}
                                            variant={variant}
                                            productIndex={index}
                                            variantIndex={variantIndex}
                                            onRemove={handleRemoveVariant}
                                            canRemove={product.variants.length > 1}
                                        />
                                    ))}
                                    {droppableProvided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default ProductItem;
