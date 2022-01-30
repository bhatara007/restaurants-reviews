import React, { useState, useEffect } from "react";
import RestaurantDataService from "../services/restaurant";
import { Link, useSearchParams, useLocation, useParams} from "react-router-dom";

const AddReview = props => {
  let initialReviewState = ""

  const location = useLocation()
  const { id } = useParams();
  const [param] = useSearchParams()

  const [review, setReview] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleInputChange = event => {
    setReview(event.target.value);
  };

 useEffect(() => {
    if(location.state?.currentReview?.user_id === props.user?.id){
        setEditing(true)
    }
  }
 ,[location])


  const saveReview = () => {
    const data = {
      text: review,
      name: props.user.name,
      user_id: props.user.id,
      restaurant_id: id
    };

    if (editing) {
      data.review_id = location.state.currentReview._id
      RestaurantDataService.updateReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      RestaurantDataService.createReview(data)
        .then(response => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }

  };

  return (
    <div>
      {props.user ? (
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <Link to={"/restaurants/" + id} className="btn btn-success">
                Back to Restaurant
              </Link>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="description">
                  {location.state?.currentReview?.user_id === props.user.id
                    ? "Edit"
                    : "Create"}{" "}
                  Review
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="text"
                  required
                  onChange={handleInputChange}
                  name="text"
                  defaultValue={
                    location.state?.currentReview
                      ? location.state.currentReview.text
                      : ""
                  }
                />
              </div>
              <button onClick={saveReview} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>Please log in.</div>
      )}
    </div>
  );
};

export default AddReview;