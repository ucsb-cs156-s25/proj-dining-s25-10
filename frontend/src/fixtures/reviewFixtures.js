const reviewFixtures = {
  oneReview: [
    {
      id: 1,
      itemName: "Tacos",
      itemStars: 4,
      comments: "It was alright",
      dateServed: "2022-05-02T12:00:00",
      status: "Approved",
    },
  ],

  threeReviews: [
    {
      id: 2,
      itemName: "Pizza",
      itemStars: 5,
      comments: "It was ok",
      dateServed: "2022-01-02T12:00:00",
      status: "Approved",
    },
    {
      id: 3,
      itemName: "Hamburger",
      itemStars: 3,
      comments: "I mean, it's alright",
      dateServed: "2012-01-02T12:00:00",
      status: "Approved",
    },
    {
      id: 4,
      itemName: "Cupcake",
      itemStars: 1,
      comments: "Horrible",
      dateServed: "2016-03-05T12:00:00",
      status: "Denied",
    },
  ],
};

export { reviewFixtures };
