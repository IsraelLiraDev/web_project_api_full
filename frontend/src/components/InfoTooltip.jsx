function InfoTooltip({ isOpen, isSuccess, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="auth-tooltip auth-tooltip_opened">
      <div className="auth-tooltip__container">
        <button
          className="auth-tooltip__close"
          type="button"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>

        <div
          className={`auth-tooltip__icon ${
            isSuccess
              ? "auth-tooltip__icon_success"
              : "auth-tooltip__icon_error"
          }`}
        >
          {isSuccess ? "✓" : "×"}
        </div>

        <h2 className="auth-tooltip__title">
          {isSuccess
            ? "¡Registro completado correctamente!"
            : "¡Vaya! Algo ha salido mal. Inténtalo de nuevo."}
        </h2>
      </div>
    </div>
  );
}

export default InfoTooltip;
