/**
 * Material Design 3 Drag Handle Component
 * 
 * Based on Material Design 3 specifications
 */

interface DragHandleProps {
  onMouseDown?: (e: React.MouseEvent) => void;
  isDragging?: boolean;
}

export function DragHandle({ onMouseDown, isDragging = false }: DragHandleProps) {
  return (
    <div
      className="relative flex items-center justify-center cursor-col-resize select-none group"
      style={{ width: '24px', height: '100%' }}
      onMouseDown={onMouseDown}
      tabIndex={0}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panels"
    >
      {/* Hover State Layer - CSS hover */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          backgroundColor: 'rgba(245, 239, 247, 0.08)',
          pointerEvents: 'none',
        }}
      />

      {/* Focus State Layer - CSS focus */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-focus:opacity-100 transition-opacity duration-200"
        style={{
          backgroundColor: 'rgba(245, 239, 247, 0.1)',
          pointerEvents: 'none',
        }}
      />

      {/* Drag Handle Visual */}
      <div
        className="relative z-10 rounded-full transition-all duration-200"
        style={{
          width: isDragging ? '12px' : '4px',
          height: isDragging ? '52px' : '48px',
          backgroundColor: isDragging ? '#1D1B20' : '#79747E',
        }}
      />
    </div>
  );
}

