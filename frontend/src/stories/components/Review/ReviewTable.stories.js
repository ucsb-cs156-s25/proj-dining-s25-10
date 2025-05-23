import React from "react";
import ReviewTable from "main/components/Review/ReviewTable";
import { reviewFixtures } from "fixtures/reviewFixtures";

export default {
  title: "components/Review/ReviewTable",
  component: ReviewTable,
};

const Template = (args) => {
  return <ReviewTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  reviews: [],
};

export const OneReview = Template.bind({});

OneReview.args = {
  reviews: reviewFixtures.oneReview,
};

export const ThreeReviews = Template.bind({});
ThreeReviews.args = {
  reviews: reviewFixtures.threeReviews,
};

export const ThreeReviewsWithAdmin = Template.bind({});
ThreeReviewsWithAdmin.args = {
  reviews: reviewFixtures.threeReviews,
  userOptions: true,
};

export const ThreeReviewsWithMod = Template.bind({});
ThreeReviewsWithMod.args = {
  reviews: reviewFixtures.threeReviews,
  moderatorOptions: true,
};

export const ThreeReviewsWithAdminAndMod = Template.bind({});
ThreeReviewsWithAdminAndMod.args = {
  reviews: reviewFixtures.threeReviews,
  userOptions: true,
  moderatorOptions: true,
};
