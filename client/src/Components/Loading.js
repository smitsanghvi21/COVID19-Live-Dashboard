import React from "react";
import "../App.css";

export default function Loading() {
  return (
    <div id="custom_loading" class="text-center">
      <button class="btn btn-primary" type="button" disabled>
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Loading...
      </button>
    </div>
  );
}
