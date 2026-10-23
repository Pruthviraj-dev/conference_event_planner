
import React from "react";
import "./TotalCost.css";

const TotalCost = ({ totalCosts, ItemsDisplay }) => {
  const totalAmount =
    (totalCosts.venue || 0) +
    (totalCosts.av || 0) +
    (totalCosts.meals || 0);

  return (
    <div className="pricing-app">
      <div className="display_box">
        <div className="header">
          <h3 className="preheading">
            Total cost for the event
          </h3>
        </div>

        <h2 id="pre_fee_cost_display" className="price">
          ${totalAmount}
        </h2>

        <div className="cost-breakdown">
          <p>Venue: ${totalCosts.venue || 0}</p>
          <p>Add-ons: ${totalCosts.av || 0}</p>
          <p>Meals: ${totalCosts.meals || 0}</p>
        </div>

        <div className="render_items">
          <h3>Selected Items</h3>
          <ItemsDisplay />
        </div>
      </div>
    </div>
  );
};

export default TotalCost;
