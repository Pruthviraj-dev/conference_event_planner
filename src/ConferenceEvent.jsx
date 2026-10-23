
import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";

import {
  incrementQuantity,
  decrementQuantity,
} from "./venueSlice";

import {
  incrementAvQuantity,
  decrementAvQuantity,
} from "./avSlice";

import { toggleMealSelection } from "./mealsSlice";

const ConferenceEvent = () => {
  const [showItems, setShowItems] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const venueItems = useSelector((state) => state.venue);
  const avItems = useSelector((state) => state.av);
  const mealsItems = useSelector((state) => state.meals);

  const dispatch = useDispatch();

  const auditorium = venueItems.find(
    (item) => item.name === "Auditorium Hall (Capacity:200)"
  );

  const remainingAuditoriumQuantity = auditorium
    ? 3 - auditorium.quantity
    : 0;

  const handleAddToCart = (index) => {
    const item = venueItems[index];

    if (
      item.name === "Auditorium Hall (Capacity:200)" &&
      item.quantity >= 3
    ) {
      return;
    }

    if (item.quantity < 10) {
      dispatch(incrementQuantity(index));
    }
  };

  const handleRemoveFromCart = (index) => {
    if (venueItems[index].quantity > 0) {
      dispatch(decrementQuantity(index));
    }
  };

  const handleIncrementAvQuantity = (index) => {
    dispatch(incrementAvQuantity(index));
  };

  const handleDecrementAvQuantity = (index) => {
    dispatch(decrementAvQuantity(index));
  };

  const handleMealSelection = (index) => {
    dispatch(toggleMealSelection(index));
  };

  const calculateTotalCost = (section) => {
    if (section === "venue") {
      return venueItems.reduce(
        (total, item) => total + item.cost * item.quantity,
        0
      );
    }

    if (section === "av") {
      return avItems.reduce(
        (total, item) => total + item.cost * item.quantity,
        0
      );
    }

    if (section === "meals") {
      return mealsItems.reduce(
        (total, item) =>
          total +
          (item.selected ? item.cost * numberOfPeople : 0),
        0
      );
    }

    return 0;
  };

  const venueTotalCost = calculateTotalCost("venue");
  const avTotalCost = calculateTotalCost("av");
  const mealsTotalCost = calculateTotalCost("meals");

  const totalCosts = {
    venue: venueTotalCost,
    av: avTotalCost,
    meals: mealsTotalCost,
  };

  const getItemsFromTotalCost = () => {
    const items = [];

    venueItems.forEach((item) => {
      if (item.quantity > 0) {
        items.push({
          name: item.name,
          cost: item.cost,
          quantity: item.quantity,
          type: "venue",
        });
      }
    });

    avItems.forEach((item) => {
      if (item.quantity > 0) {
        items.push({
          name: item.name,
          cost: item.cost,
          quantity: item.quantity,
          type: "av",
        });
      }
    });

    mealsItems.forEach((item) => {
      if (item.selected) {
        items.push({
          name: item.name,
          cost: item.cost,
          quantity: numberOfPeople,
          type: "meals",
        });
      }
    });

    return items;
  };

  const items = getItemsFromTotalCost();

  const ItemsDisplay = ({ items }) => {
    if (items.length === 0) {
      return <p>No items selected.</p>;
    }

    return (
      <div className="selected-items-table">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Unit Cost</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={`${item.type}-${item.name}-${index}`}>
                <td>{item.name}</td>
                <td>${item.cost}</td>
                <td>
                  {item.type === "meals"
                    ? `${item.quantity} people`
                    : item.quantity}
                </td>
                <td>${item.cost * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const navigateToProducts = () => {
    setShowItems(false);
  };

  return (
    <>
      <nav className="navbar_event_conference">
        <div className="company_logo">
          Conference Expense Planner
        </div>

        <div className="left_navbar">
          <div className="nav_links">
            <a href="#venue" onClick={navigateToProducts}>
              Venue
            </a>
            <a href="#addons" onClick={navigateToProducts}>
              Add-ons
            </a>
            <a href="#meals" onClick={navigateToProducts}>
              Meals
            </a>
          </div>

          <button
            className="details_button"
            onClick={() => setShowItems((previous) => !previous)}
          >
            {showItems ? "Back to Selection" : "Show Details"}
          </button>
        </div>
      </nav>

      <div className="main_container">
        {!showItems ? (
          <div className="items-information">
            {/* Venue Selection */}
            <div
              id="venue"
              className="venue_container container_main"
            >
              <div className="text">
                <h1>Venue Room Selection</h1>
              </div>

              <div className="venue_selection">
                {venueItems.map((item, index) => (
                  <div className="venue_main" key={item.name}>
                    <div className="img">
                      <img src={item.img} alt={item.name} />
                    </div>

                    <div className="text">{item.name}</div>
                    <div>${item.cost}</div>

                    <div className="button_container">
                      <button
                        className={
                          item.quantity === 0
                            ? "btn-warning btn-disabled"
                            : "btn-warning btn-plus"
                        }
                        disabled={item.quantity === 0}
                        onClick={() => handleRemoveFromCart(index)}
                      >
                        &#8722;
                      </button>

                      <span className="selected_count">
                        {item.quantity}
                      </span>

                      <button
                        className={
                          item.quantity >=
                          (item.name ===
                          "Auditorium Hall (Capacity:200)"
                            ? 3
                            : 10)
                            ? "btn-success btn-disabled"
                            : "btn-success btn-plus"
                        }
                        disabled={
                          item.quantity >=
                          (item.name ===
                          "Auditorium Hall (Capacity:200)"
                            ? 3
                            : 10)
                        }
                        onClick={() => handleAddToCart(index)}
                      >
                        &#43;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {auditorium && (
                <p>
                  Auditorium Hall units remaining:{" "}
                  {remainingAuditoriumQuantity}
                </p>
              )}

              <div className="total_cost">
                Total Cost: ${venueTotalCost}
              </div>
            </div>

            {/* Add-ons Selection */}
            <div
              id="addons"
              className="venue_container container_main"
            >
              <div className="text">
                <h1>Add-ons Selection</h1>
              </div>

              <div className="addons_selection">
                {avItems.map((item, index) => (
                  <div className="av_data venue_main" key={item.name}>
                    <div className="img">
                      <img src={item.img} alt={item.name} />
                    </div>

                    <div className="text">{item.name}</div>
                    <div>${item.cost} each</div>

                    <div className="button_container">
                      <button
                        className="btn-warning btn-plus"
                        disabled={item.quantity === 0}
                        onClick={() =>
                          handleDecrementAvQuantity(index)
                        }
                      >
                        &#8722;
                      </button>

                      <span className="selected_count">
                        {item.quantity}
                      </span>

                      <button
                        className="btn-success btn-plus"
                        onClick={() =>
                          handleIncrementAvQuantity(index)
                        }
                      >
                        &#43;
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="total_cost">
                Total Cost: ${avTotalCost}
              </div>
            </div>

            {/* Meals Selection */}
            <div
              id="meals"
              className="venue_container container_main"
            >
              <div className="text">
                <h1>Meals Selection</h1>
              </div>

              <div className="input-container venue_selection">
                <label htmlFor="numberOfPeople">
                  Number of people:
                </label>

                <input
                  id="numberOfPeople"
                  type="number"
                  min="1"
                  value={numberOfPeople}
                  onChange={(event) => {
                    const value = Number(event.target.value);

                    setNumberOfPeople(
                      Number.isFinite(value) && value >= 1
                        ? Math.floor(value)
                        : 1
                    );
                  }}
                />
              </div>

              <div className="meal_selection">
                {mealsItems.map((item, index) => (
                  <div className="meal_item" key={item.name}>
                    <label>
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleMealSelection(index)}
                      />

                      {item.name} — ${item.cost} per person
                    </label>
                  </div>
                ))}
              </div>

              <div className="total_cost">
                Total Cost: ${mealsTotalCost}
              </div>
            </div>
          </div>
        ) : (
          <div className="total_amount_detail">
            <TotalCost
              totalCosts={totalCosts}
              ItemsDisplay={() => <ItemsDisplay items={items} />}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ConferenceEvent;
