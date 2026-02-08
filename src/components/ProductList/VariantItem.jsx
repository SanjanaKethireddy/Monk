import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';

const VariantItem = ({
    variant,
    productIndex,
    variantIndex,
    onRemove,
    canRemove,
}) => {
    return (
        <Draggable
            draggableId={`variant-${variant.id}`}
            index={variantIndex}
        >
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`variant-item ${snapshot.isDragging ? 'dragging' : ''}`}
                >
                    <div {...provided.dragHandleProps} className="drag-handle">
                        <RxDragHandleDots2 />
                    </div>

                    <input
                        type="text"
                        className="variant-name-input"
                        value={variant.title}
                        readOnly
                    />

                    {canRemove && (
                        <button
                            className="remove-button"
                            onClick={() => onRemove(variantIndex)}
                            title="Remove variant"
                        >
                            <IoClose />
                        </button>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default VariantItem;

