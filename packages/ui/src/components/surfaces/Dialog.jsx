import { Window } from './Window';
import { Icon } from '../core/Icon';

function Dialog({ open = true, title, icon, children, actions, onClose, width = 420, inline = false }) {
  if (!open) return null;
  const box = (
    <Window
      title={title}
      onClose={onClose}
      width={width}
      style={{
        maxWidth: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 16,
          padding: '20px 20px 16px',
        }}
      >
        {icon ? (
          <span
            style={{
              color: 'var(--text-1)',
            }}
          >
            <Icon name={icon} size={32} />
          </span>
        ) : null}
        <div
          style={{
            flex: 1,
            font: 'var(--type-body-s)',
            color: 'var(--text-2)',
          }}
        >
          {children}
        </div>
      </div>
      {actions ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 10,
            padding: '0 20px 18px',
          }}
        >
          {actions}
        </div>
      ) : null}
    </Window>
  );
  if (inline) return box;
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'rgba(222,218,209,.6)',
        backdropFilter: 'grayscale(1)',
      }}
    >
      {box}
    </div>
  );
}

export { Dialog };
