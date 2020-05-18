import React from "react";

export const SubmitButton: React.FC<{
  disabled: boolean;
  text: string;
  success: boolean;
  successText: string;
}> = (props) => {
  return (
    <div className="d-flex align-items-center">
      <button
        className={
          "mb-3 mt-3 btn " +
          (props.disabled
            ? "btn-secondary shadow"
            : "btn-primary shadow-primary")
        }
        style={{ alignSelf: "flex-end" }}
        disabled={props.disabled}
      >
        {props.text}
      </button>

      {props.success && (
        <div
          style={{
            marginLeft: 16,
            color: "var(--success)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              border: "1px solid var(--success)",
              marginRight: 8,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✓
          </div>
          {props.successText}
        </div>
      )}
    </div>
  );
};

