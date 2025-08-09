import React from "react";
import "../css/Done.css";

export default function Done() {
    return (
        <div className="done-container">
            <div className="done-box">
                <div className="checkmark">&#10004;</div>
                <h1>Order Successful!</h1>
                <p>Thank you for your order. We’ll contact you soon.</p>
            </div>
        </div>
    );
}
