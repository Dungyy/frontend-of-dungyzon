import React from "react";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
} from "reactstrap";
import { FaThumbsUp } from "react-icons/fa";

const ProductCard = ({ result, isDarkMode }) => (
  <div className="card-column" key={result.position}>
    <Card className="card">
      <CardImg
        top
        src={result.image}
        alt={result.image}
        className="card-img-top"
      />
      <CardBody>
        <CardTitle tag="h3">{result.name}</CardTitle>
        <br />
        <CardSubtitle tag="h5" className="mb-2 text-muted">
          Price:
          <span style={{ color: "green" }}>{result.price_string}</span>
        </CardSubtitle>
        {result.stars && (
          <>
            <p className="card-stars">
              Stars: {result.stars}{" "}
              {result.stars > 4.5
                ? "⭐️⭐️⭐️⭐️⭐️"
                : "⭐️".repeat(Math.floor(result.stars))}
            </p>
          </>
        )}

        {result.has_prime && (
          <p style={{ color: "gold" }} className="card-prime">
            Prime available!
          </p>
        )}
        <p className="card-reviews">
          Total Reviews: {result.total_reviews}
          <br />
          {result.is_best_seller && (
            <>
              Best Seller: <FaThumbsUp />
              <br />
            </>
          )}
          <br />
          {result.is_amazon_choice && (
            <>
              Amazon Choice: <FaThumbsUp />
              <br />
            </>
          )}
          {result.is_limited_deal && (
            <>
              Limited Deal: <FaThumbsUp />
              <br />
            </>
          )}
        </p>

        <Button
          className={isDarkMode ? "dark-mode" : ""}
          color={isDarkMode ? "outline-light" : "outline-dark"}
          onClick={() => {
            window.open(result.url, "_blank");
          }}
        >
          View on Amazon
        </Button>
      </CardBody>
    </Card>
  </div>
);

export default ProductCard;
